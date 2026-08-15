import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import wishlistService from "../services/wishlistService";

const WishlistContext =
  createContext(null);

export function WishlistProvider({
  children,
}) {
  const [wishlist, setWishlist] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const fetchWishlist =
    useCallback(async () => {
      if (!localStorage.getItem("token")) {
        setWishlist([]);
        return;
      }

      try {
        setLoading(true);

        const response =
          await wishlistService.getWishlist();

        setWishlist(
          response.data?.wishlist || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch wishlist:",
          error
        );

        setWishlist([]);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (
    productId
  ) => {
    if (!localStorage.getItem("token")) {
      return {
        success: false,
        requiresLogin: true,
      };
    }

    try {
      setLoading(true);

      await wishlistService.addToWishlist(
        productId
      );

      await fetchWishlist();

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to add to wishlist",
      };
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist =
    async (wishlistId) => {
      try {
        setLoading(true);

        await wishlistService.removeWishlist(
          wishlistId
        );

        await fetchWishlist();

        return {
          success: true,
        };
      } catch (error) {
        return {
          success: false,
          message:
            error.response?.data?.message ||
            "Unable to remove from wishlist",
        };
      } finally {
        setLoading(false);
      }
    };

  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) =>
        String(
          item.product?._id ||
            item.product
        ) === String(productId)
    );
  };

  const wishlistCount = useMemo(
    () => wishlist.length,
    [wishlist]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context =
    useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}