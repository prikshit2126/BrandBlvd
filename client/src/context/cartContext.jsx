import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import cartService from "../services/cartService";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // =====================================================
    // FETCH CART
    // =====================================================

    const fetchCart = useCallback(async () => {
        const token = localStorage.getItem("token");

        // Guest users don't have a server-side cart yet
        if (!token) {
            setCart([]);
            setTotal(0);
            return;
        }

        try {
            setLoading(true);

            const response =
                await cartService.getCart();

            const data = response.data;

            setCart(data.cart || []);

            setTotal(
                Number(data.total || 0)
            );

        } catch (error) {
            console.error(
                "Failed to fetch cart:",
                error
            );

            setCart([]);
            setTotal(0);

        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);


    // =====================================================
    // ADD TO CART
    //
    // Guests are allowed to click Add to Cart.
    // The actual server cart still requires login.
    // =====================================================

    const addToCart = async (
        productId,
        quantity = 1,
        size = "",
        color = ""
    ) => {

        const token =
            localStorage.getItem("token");

        // -------------------------------------------------
        // Guest user
        // -------------------------------------------------
        //
        // IMPORTANT:
        // Your current backend Cart model requires
        // a logged-in user.
        //
        // Therefore we return requiresLogin here.
        // The Product page can use this to show:
        //
        // "Login to add this item to your cart"
        //
        // However, if you want TRUE guest carts, we would
        // need to add localStorage cart functionality.
        //

        if (!token) {
            return {
                success: false,
                requiresLogin: true,
                message:
                    "Please login to add items to your cart.",
            };
        }

        // -------------------------------------------------
        // Logged-in user
        // -------------------------------------------------

        try {
            setLoading(true);

            await cartService.addToCart(
                productId,
                quantity,
                size,
                color
            );

            await fetchCart();

            return {
                success: true,
            };

        } catch (error) {

            console.error(
                "Failed to add product to cart:",
                error
            );

            return {
                success: false,

                message:
                    error.response?.data
                        ?.message ||
                    "Unable to add product to cart",
            };

        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // UPDATE QUANTITY
    // =====================================================

    const updateQuantity = async (
        cartId,
        quantity
    ) => {

        if (quantity < 1) {
            return {
                success: false,
            };
        }

        try {
            setLoading(true);

            await cartService.updateCart(
                cartId,
                quantity
            );

            await fetchCart();

            return {
                success: true,
            };

        } catch (error) {

            console.error(
                "Failed to update cart:",
                error
            );

            return {
                success: false,

                message:
                    error.response?.data
                        ?.message ||
                    "Unable to update cart",
            };

        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // REMOVE ITEM
    // =====================================================

    const removeItem = async (
        cartId
    ) => {

        try {
            setLoading(true);

            await cartService.removeCartItem(
                cartId
            );

            await fetchCart();

            return {
                success: true,
            };

        } catch (error) {

            console.error(
                "Failed to remove cart item:",
                error
            );

            return {
                success: false,

                message:
                    error.response?.data
                        ?.message ||
                    "Unable to remove item",
            };

        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // CLEAR CART
    // =====================================================

    const clearCart = async () => {

        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            // Nothing to clear for guest
            if (!token) {
                setCart([]);
                setTotal(0);

                return {
                    success: true,
                };
            }

            await cartService.clearCart();

            setCart([]);
            setTotal(0);

            return {
                success: true,
            };

        } catch (error) {

            console.error(
                "Failed to clear cart:",
                error
            );

            return {
                success: false,

                message:
                    error.response?.data
                        ?.message ||
                    "Unable to clear cart",
            };

        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // CART COUNT
    // =====================================================

    const cartCount = useMemo(() => {
        return cart.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.quantity || 0
                ),
            0
        );
    }, [cart]);


    // =====================================================
    // CONTEXT VALUE
    // =====================================================

    const value = {
        cart,
        total,
        cartCount,
        loading,

        fetchCart,

        addToCart,

        updateQuantity,

        removeItem,

        clearCart,
    };


    return (
        <CartContext.Provider
            value={value}
        >
            {children}
        </CartContext.Provider>
    );
}


// =====================================================
// USE CART
// =====================================================

export function useCart() {
    const context =
        useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart must be used inside CartProvider"
        );
    }

    return context;
}