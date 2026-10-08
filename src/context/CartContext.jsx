import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";


import { useAuth } from "./AuthContext";
import { API_URL } from "../config/api";


const CartContext = createContext();


export function CartProvider({ children }) {

  // Get the currently logged-in user
  // and their active JWT token
  const {
    user,
    token,
    authLoading
  } = useAuth();


  const [cart, setCart] = useState([]);


  // =========================
  // GET USER CART
  // =========================

  const fetchCart = async () => {

    try {

      if (!token) {
        setCart([]);
        return;
      }


      const response = await fetch(
        `${API_URL}/api/cart`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to fetch cart"
        );

      }


      // Backend returns:
      //
      // cart.items
      //
      // Each item contains:
      // product
      // quantity

      const cartItems = data.cart?.items || [];


      // Convert backend cart format
      // into the format your existing
      // Cart.jsx already uses.
      const formattedCart = cartItems
        .filter((item) => item.product)
        .map((item) => ({
          ...item.product,
          quantity: item.quantity
        }));


      setCart(formattedCart);


    } catch (error) {

      console.error(
        "Fetch cart error:",
        error
      );

      setCart([]);

    }

  };


  // =========================
  // LOAD CART WHEN USER LOGIN CHANGES
  // =========================

  useEffect(() => {

    // Wait for AuthContext to finish
    // restoring the login session
    if (authLoading) {
      return;
    }


    // No logged-in user
    if (!token || !user) {

      setCart([]);

      // Remove old common cart
      // from the previous implementation
      localStorage.removeItem("cart");

      return;
    }


    // Admin should not use the
    // normal user shopping cart
    if (user.role !== "user") {

      setCart([]);

      localStorage.removeItem("cart");

      return;
    }


    // Logged-in normal user
    // Load ONLY that user's cart
    fetchCart();


  }, [token, user, authLoading]);


  // =========================
  // ADD PRODUCT TO CART
  // =========================

  const addToCart = async (product) => {

    try {

      if (!token || !user) {

        console.error(
          "Please login to add products to cart."
        );

        return;

      }


      const response = await fetch(
        `${API_URL}/api/cart/add`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            productId: product._id,
            quantity: 1
          })
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to add product to cart"
        );

      }


      // Refresh cart from backend
      await fetchCart();


    } catch (error) {

      console.error(
        "Add to cart error:",
        error
      );

    }

  };


  // =========================
  // INCREASE QUANTITY
  // =========================

  const increaseQuantity = async (productId) => {

    try {

      if (!token) {
        return;
      }


      const currentItem = cart.find(
        (item) => item._id === productId
      );


      if (!currentItem) {
        return;
      }


      const newQuantity =
        currentItem.quantity + 1;


      const response = await fetch(
        `${API_URL}/api/cart/update/${productId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            quantity: newQuantity
          })
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to increase quantity"
        );

      }


      await fetchCart();


    } catch (error) {

      console.error(
        "Increase quantity error:",
        error
      );

    }

  };


  // =========================
  // DECREASE QUANTITY
  // =========================

  const decreaseQuantity = async (productId) => {

    try {

      if (!token) {
        return;
      }


      const currentItem = cart.find(
        (item) => item._id === productId
      );


      if (!currentItem) {
        return;
      }


      // If quantity is 1,
      // remove product from cart
      if (currentItem.quantity === 1) {

        await removeFromCart(productId);

        return;

      }


      const newQuantity =
        currentItem.quantity - 1;


      const response = await fetch(
        `${API_URL}/api/cart/update/${productId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            quantity: newQuantity
          })
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to decrease quantity"
        );

      }


      await fetchCart();


    } catch (error) {

      console.error(
        "Decrease quantity error:",
        error
      );

    }

  };


  // =========================
  // REMOVE PRODUCT
  // =========================

  const removeFromCart = async (productId) => {

    try {

      if (!token) {
        return;
      }


      const response = await fetch(
        `${API_URL}/api/cart/remove/${productId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to remove product"
        );

      }


      await fetchCart();


    } catch (error) {

      console.error(
        "Remove from cart error:",
        error
      );

    }

  };


  // =========================
  // CLEAR CART
  // =========================

  const clearCart = async () => {

    try {

      if (!token) {
        return;
      }


      const response = await fetch(
        `${API_URL}/api/cart/clear`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to clear cart"
        );

      }


      setCart([]);


    } catch (error) {

      console.error(
        "Clear cart error:",
        error
      );

    }

  };


  // =========================
  // TOTAL NUMBER OF PRODUCTS
  // =========================

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );


  // =========================
  // TOTAL PRICE
  // =========================

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) * item.quantity,
    0
  );


  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );

}


export function useCart() {

  return useContext(CartContext);

}