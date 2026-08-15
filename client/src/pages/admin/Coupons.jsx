import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    TicketPercent,
    Plus,
    Pencil,
    Trash2,
    Power,
    X,
    Check,
} from "lucide-react";

import couponService from "../../services/couponService";

import "./Coupons.css";

const emptyForm = {
    code: "",
    discountType: "percentage",
    discountValue: "",
    maxDiscount: "",
    minimumOrderValue: "",
    usageLimit: "",
    perUserLimit: "1",
    expiresAt: "",
    isActive: true,
};

export default function Coupons() {
    const [coupons, setCoupons] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState(emptyForm);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // LOAD COUPONS
    // =====================================================

    const loadCoupons = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await couponService.getAllCoupons();

            setCoupons(
                response.data?.coupons || []
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load coupons."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCoupons();
    }, []);

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (event) => {
        const { name, value, type, checked } =
            event.target;

        setForm((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : name === "code"
                        ? value.toUpperCase()
                        : value,
        }));
    };

    // =====================================================
    // OPEN CREATE
    // =====================================================

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setError("");
        setSuccess("");
        setShowForm(true);
    };

    // =====================================================
    // OPEN EDIT
    // =====================================================

    const openEdit = (coupon) => {
        setEditingId(coupon._id);

        setForm({
            code: coupon.code || "",

            discountType:
                coupon.discountType ||
                "percentage",

            discountValue:
                coupon.discountValue ?? "",

            maxDiscount:
                coupon.maxDiscount ?? "",

            minimumOrderValue:
                coupon.minimumOrderValue ?? "",

            usageLimit:
                coupon.usageLimit ?? "",

            perUserLimit:
                coupon.perUserLimit ?? 1,

            expiresAt: coupon.expiresAt
                ? new Date(coupon.expiresAt)
                    .toISOString()
                    .slice(0, 16)
                : "",

            isActive:
                coupon.isActive !== false,
        });

        setError("");
        setSuccess("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeForm = () => {
        if (saving) return;

        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        setError("");
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const code =
            form.code.trim().toUpperCase();

        if (!code) {
            setError("Enter a coupon code.");
            return;
        }

        const discountValue =
            Number(form.discountValue);

        if (
            !Number.isFinite(discountValue) ||
            discountValue <= 0
        ) {
            setError(
                "Discount value must be greater than 0."
            );
            return;
        }

        if (
            form.discountType === "percentage" &&
            discountValue > 100
        ) {
            setError(
                "Percentage discount cannot exceed 100%."
            );
            return;
        }

        const payload = {
            code,

            discountType:
                form.discountType,

            discountValue,

            maxDiscount:
                form.maxDiscount === ""
                    ? null
                    : Number(form.maxDiscount),

            minimumOrderValue:
                form.minimumOrderValue === ""
                    ? 0
                    : Number(
                        form.minimumOrderValue
                    ),

            usageLimit:
                form.usageLimit === ""
                    ? null
                    : Number(form.usageLimit),

            perUserLimit:
                form.perUserLimit === ""
                    ? 1
                    : Number(form.perUserLimit),

            expiresAt:
                form.expiresAt || null,

            isActive:
                form.isActive,
        };

        try {
            setSaving(true);

            let response;

            if (editingId) {
                response =
                    await couponService.updateCoupon(
                        editingId,
                        payload
                    );
            } else {
                response =
                    await couponService.createCoupon(
                        payload
                    );
            }

            setSuccess(
                response.data?.message ||
                (
                    editingId
                        ? "Coupon updated successfully."
                        : "Coupon created successfully."
                )
            );

            await loadCoupons();

            setTimeout(() => {
                closeForm();
            }, 700);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to save coupon."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // TOGGLE
    // =====================================================

    const handleToggle = async (coupon) => {
        try {
            setError("");
            setSuccess("");

            const response =
                await couponService.toggleCoupon(
                    coupon._id
                );

            setSuccess(
                response.data?.message ||
                "Coupon status updated."
            );

            await loadCoupons();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to change coupon status."
            );
        }
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (coupon) => {
        const confirmed = window.confirm(
            `Delete coupon "${coupon.code}"?`
        );

        if (!confirmed) return;

        try {
            setError("");
            setSuccess("");

            await couponService.deleteCoupon(
                coupon._id
            );

            setSuccess(
                "Coupon deleted successfully."
            );

            await loadCoupons();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete coupon."
            );
        }
    };

    // =====================================================
    // FORMAT
    // =====================================================

    const formatMoney = (value) => {
        return `₹${Number(
            value || 0
        ).toLocaleString("en-IN")}`;
    };

    const formatDiscount = (coupon) => {
        if (
            coupon.discountType ===
            "percentage"
        ) {
            return `${coupon.discountValue}%`;
        }

        return formatMoney(
            coupon.discountValue
        );
    };

    const formatExpiry = (date) => {
        if (!date) return "No expiry";

        const expiry =
            new Date(date);

        if (Number.isNaN(expiry.getTime())) {
            return "No expiry";
        }

        return expiry.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const isExpired = (coupon) => {
        if (!coupon.expiresAt) return false;

        return (
            new Date(coupon.expiresAt) <
            new Date()
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="coupons-page">

            {/* =================================================
                TOPBAR
            ================================================= */}

            <header className="coupons-topbar">

                <Link
                    to="/admin"
                    className="coupons-logo"
                >
                    BrandBlvd
                </Link>

                <Link
                    to="/admin"
                    className="coupons-back"
                >
                    <ArrowLeft size={15} />
                    Back to Dashboard
                </Link>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="coupons-container">

                <div className="coupons-heading">

                    <div>
                        <span>
                            MANAGEMENT
                        </span>

                        <h1>
                            Coupons
                        </h1>

                        <p>
                            Create and manage
                            discount codes and
                            promotions.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="coupon-create-button"
                        onClick={openCreate}
                    >
                        <Plus size={17} />
                        Create Coupon
                    </button>

                </div>


                {/* =================================================
                    MESSAGES
                ================================================= */}

                {error && (
                    <div className="coupon-alert coupon-alert-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="coupon-alert coupon-alert-success">
                        <Check size={15} />
                        {success}
                    </div>
                )}


                {/* =================================================
                    CREATE / EDIT FORM
                ================================================= */}

                {showForm && (
                    <section className="coupon-form-card">

                        <div className="coupon-form-header">

                            <div>
                                <span>
                                    {editingId
                                        ? "EDIT COUPON"
                                        : "NEW PROMOTION"}
                                </span>

                                <h2>
                                    {editingId
                                        ? "Edit Coupon"
                                        : "Create Coupon"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="coupon-close"
                                onClick={closeForm}
                            >
                                <X size={19} />
                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="coupon-form"
                        >

                            <div className="coupon-form-grid">

                                {/* CODE */}

                                <div className="coupon-field coupon-field-wide">
                                    <label>
                                        COUPON CODE
                                    </label>

                                    <input
                                        name="code"
                                        value={form.code}
                                        onChange={handleChange}
                                        placeholder="WELCOME20"
                                        maxLength={30}
                                        required
                                    />

                                    <small>
                                        Customers will enter
                                        this code at checkout.
                                    </small>
                                </div>


                                {/* TYPE */}

                                <div className="coupon-field">
                                    <label>
                                        DISCOUNT TYPE
                                    </label>

                                    <select
                                        name="discountType"
                                        value={
                                            form.discountType
                                        }
                                        onChange={handleChange}
                                    >
                                        <option value="percentage">
                                            Percentage
                                        </option>

                                        <option value="fixed">
                                            Fixed Amount
                                        </option>
                                    </select>
                                </div>


                                {/* VALUE */}

                                <div className="coupon-field">
                                    <label>
                                        DISCOUNT VALUE
                                    </label>

                                    <div className="coupon-input-prefix">

                                        <span>
                                            {form.discountType ===
                                            "percentage"
                                                ? "%"
                                                : "₹"}
                                        </span>

                                        <input
                                            type="number"
                                            name="discountValue"
                                            value={
                                                form.discountValue
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            min="0"
                                            max={
                                                form.discountType ===
                                                "percentage"
                                                    ? "100"
                                                    : undefined
                                            }
                                            step="0.01"
                                            placeholder={
                                                form.discountType ===
                                                "percentage"
                                                    ? "20"
                                                    : "500"
                                            }
                                            required
                                        />

                                    </div>
                                </div>


                                {/* MAX DISCOUNT */}

                                <div className="coupon-field">
                                    <label>
                                        MAX DISCOUNT
                                    </label>

                                    <input
                                        type="number"
                                        name="maxDiscount"
                                        value={
                                            form.maxDiscount
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="1"
                                        placeholder={
                                            form.discountType ===
                                            "percentage"
                                                ? "500"
                                                : "Optional"
                                        }
                                        disabled={
                                            form.discountType ===
                                            "fixed"
                                        }
                                    />

                                    <small>
                                        Only used for
                                        percentage coupons.
                                    </small>
                                </div>


                                {/* MINIMUM ORDER */}

                                <div className="coupon-field">
                                    <label>
                                        MINIMUM ORDER VALUE
                                    </label>

                                    <input
                                        type="number"
                                        name="minimumOrderValue"
                                        value={
                                            form.minimumOrderValue
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="1"
                                        placeholder="1999"
                                    />
                                </div>


                                {/* USAGE LIMIT */}

                                <div className="coupon-field">
                                    <label>
                                        TOTAL USAGE LIMIT
                                    </label>

                                    <input
                                        type="number"
                                        name="usageLimit"
                                        value={
                                            form.usageLimit
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="1"
                                        placeholder="100"
                                    />

                                    <small>
                                        Leave empty for
                                        unlimited usage.
                                    </small>
                                </div>


                                {/* PER USER */}

                                <div className="coupon-field">
                                    <label>
                                        USES PER CUSTOMER
                                    </label>

                                    <input
                                        type="number"
                                        name="perUserLimit"
                                        value={
                                            form.perUserLimit
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="1"
                                        step="1"
                                        placeholder="1"
                                    />
                                </div>


                                {/* EXPIRY */}

                                <div className="coupon-field">
                                    <label>
                                        EXPIRY DATE
                                    </label>

                                    <input
                                        type="datetime-local"
                                        name="expiresAt"
                                        value={
                                            form.expiresAt
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                    <small>
                                        Leave empty for
                                        no expiry.
                                    </small>
                                </div>


                                {/* ACTIVE */}

                                <label className="coupon-active-toggle">

                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={
                                            form.isActive
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                    <span className="coupon-toggle-track">
                                        <span />
                                    </span>

                                    <div>
                                        <strong>
                                            Active Coupon
                                        </strong>

                                        <small>
                                            Customers can use
                                            this coupon.
                                        </small>
                                    </div>

                                </label>

                            </div>


                            {/* ACTIONS */}

                            <div className="coupon-form-actions">

                                <button
                                    type="button"
                                    className="coupon-cancel"
                                    onClick={closeForm}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="coupon-save"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Save Changes"
                                            : "Create Coupon"}
                                </button>

                            </div>

                        </form>

                    </section>
                )}


                {/* =================================================
                    COUPON LIST
                ================================================= */}

                <section className="coupon-list-section">

                    <div className="coupon-list-header">

                        <div>
                            <span>
                                PROMOTIONS
                            </span>

                            <h2>
                                All Coupons
                            </h2>
                        </div>

                        <strong>
                            {coupons.length}{" "}
                            {coupons.length === 1
                                ? "coupon"
                                : "coupons"}
                        </strong>

                    </div>


                    {loading ? (
                        <div className="coupon-loading">
                            Loading coupons...
                        </div>
                    ) : coupons.length === 0 ? (

                        <div className="coupon-empty">

                            <div className="coupon-empty-icon">
                                <TicketPercent size={27} />
                            </div>

                            <h3>
                                No coupons yet
                            </h3>

                            <p>
                                Create your first
                                discount code to
                                start promoting
                                your store.
                            </p>

                            <button
                                type="button"
                                onClick={openCreate}
                                className="coupon-empty-button"
                            >
                                <Plus size={15} />
                                Create Coupon
                            </button>

                        </div>

                    ) : (

                        <div className="coupon-table">

                            <div className="coupon-table-head">

                                <span>
                                    CODE
                                </span>

                                <span>
                                    DISCOUNT
                                </span>

                                <span>
                                    REQUIREMENT
                                </span>

                                <span>
                                    USAGE
                                </span>

                                <span>
                                    EXPIRY
                                </span>

                                <span>
                                    STATUS
                                </span>

                                <span>
                                    ACTIONS
                                </span>

                            </div>


                            {coupons.map((coupon) => {

                                const expired =
                                    isExpired(coupon);

                                const exhausted =
                                    coupon.usageLimit !==
                                        null &&
                                    coupon.usedCount >=
                                        coupon.usageLimit;

                                const active =
                                    coupon.isActive &&
                                    !expired &&
                                    !exhausted;

                                return (
                                    <div
                                        className="coupon-row"
                                        key={coupon._id}
                                    >

                                        <div className="coupon-code-cell">

                                            <div className="coupon-code-icon">
                                                <TicketPercent
                                                    size={17}
                                                />
                                            </div>

                                            <div>
                                                <strong>
                                                    {coupon.code}
                                                </strong>

                                                <small>
                                                    Created{" "}
                                                    {formatExpiry(
                                                        coupon.createdAt
                                                    )}
                                                </small>
                                            </div>

                                        </div>


                                        <div className="coupon-discount">

                                            <strong>
                                                {formatDiscount(
                                                    coupon
                                                )}
                                            </strong>

                                            <small>
                                                {coupon.discountType ===
                                                "percentage"
                                                    ? "OFF"
                                                    : "DISCOUNT"}
                                            </small>

                                        </div>


                                        <div className="coupon-requirement">

                                            <span>
                                                Min. order
                                            </span>

                                            <strong>
                                                {formatMoney(
                                                    coupon.minimumOrderValue
                                                )}
                                            </strong>

                                            {coupon.maxDiscount !==
                                                null &&
                                                coupon.discountType ===
                                                "percentage" && (
                                                    <small>
                                                        Max{" "}
                                                        {formatMoney(
                                                            coupon.maxDiscount
                                                        )}
                                                    </small>
                                                )}

                                        </div>


                                        <div className="coupon-usage">

                                            <strong>
                                                {coupon.usedCount || 0}
                                                {coupon.usageLimit !==
                                                    null
                                                    ? ` / ${coupon.usageLimit}`
                                                    : ""}
                                            </strong>

                                            <small>
                                                {coupon.perUserLimit}
                                                {" "}
                                                per customer
                                            </small>

                                        </div>


                                        <div className="coupon-expiry">

                                            <strong
                                                className={
                                                    expired
                                                        ? "expired"
                                                        : ""
                                                }
                                            >
                                                {formatExpiry(
                                                    coupon.expiresAt
                                                )}
                                            </strong>

                                            {expired && (
                                                <small>
                                                    Expired
                                                </small>
                                            )}

                                        </div>


                                        <div>

                                            <span
                                                className={`coupon-status ${
                                                    active
                                                        ? "active"
                                                        : "inactive"
                                                }`}
                                            >
                                                <span />
                                                {active
                                                    ? "Active"
                                                    : expired
                                                        ? "Expired"
                                                        : exhausted
                                                            ? "Limit Reached"
                                                            : "Inactive"}
                                            </span>

                                        </div>


                                        <div className="coupon-actions">

                                            <button
                                                type="button"
                                                title="Edit coupon"
                                                onClick={() =>
                                                    openEdit(
                                                        coupon
                                                    )
                                                }
                                            >
                                                <Pencil
                                                    size={15}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                title={
                                                    coupon.isActive
                                                        ? "Deactivate"
                                                        : "Activate"
                                                }
                                                onClick={() =>
                                                    handleToggle(
                                                        coupon
                                                    )
                                                }
                                            >
                                                <Power
                                                    size={15}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                title="Delete coupon"
                                                className="delete"
                                                onClick={() =>
                                                    handleDelete(
                                                        coupon
                                                    )
                                                }
                                            >
                                                <Trash2
                                                    size={15}
                                                />
                                            </button>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    )}

                </section>

            </main>

        </div>
    );
}