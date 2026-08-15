import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

import api from "../../services/api";

import "../Login.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      if (!data.success) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      if (data.user.role !== "admin") {
        setError(
          "This account does not have administrator access."
        );
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/admin", {
        replace: true,
      });

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Invalid administrator credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      <motion.div
        className="login-card"
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >

        <div className="login-brand">
          BrandBlvd
        </div>

        <div className="login-heading">

          <span>
            <ShieldCheck
              size={12}
              style={{
                verticalAlign: "middle",
                marginRight: "5px",
              }}
            />

            ADMIN ACCESS
          </span>

          <h1>
            Control.
          </h1>

          <p>
            Manage your BrandBlvd
            store.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >

          <div className="login-field">
            <label>
              Admin Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@brandblvd.com"
              required
            />
          </div>

          <div className="login-field">
            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? "Authenticating..."
              : "Admin Login"}

            {!loading && (
              <ArrowRight size={18} />
            )}
          </button>

        </form>

        <div className="login-register">
          <Link to="/login">
            ← Back to customer login
          </Link>
        </div>

      </motion.div>

    </main>
  );
}