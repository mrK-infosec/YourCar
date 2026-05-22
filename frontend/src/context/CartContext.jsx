/**
 * SHOPPING CART STATE MANAGEMENT (React Context API)
 * This file provides a "global context" for the shopping cart.
 * Instead of passing the cart state through every single component manual-style,
 * any component (Navbar, HomePage, DetailsPage, CheckoutForm) can simply
 * import this CartContext to access and modify the active cart!
 * It also automatically saves and loads from localStorage so refreshing
 * the browser doesn't wipe out the items in the cart!
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';

// 1. Create the React Context
const CartContext = createContext();

// 2. Custom Provider Component that wraps our application
export const CartProvider = ({ children }) => {
  // Initialize cart state by checking localStorage first.
  // If a cart was saved previously, load it. If not, start with an empty array.
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('timgad_cart_items');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // 3. Keep localStorage synced whenever the cartItems array changes
  useEffect(() => {
    try {
      localStorage.setItem('timgad_cart_items', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  /**
   * Helper function: Add a car to the cart
   * @param {Object} car - The car document object from MongoDB
   * @param {Number} quantity - The requested purchase quantity (default 1)
   */
  const addToCart = (car, quantity = 1) => {
    setCartItems((prevItems) => {
      // Check if this car is already in the shopping cart
      const existingItem = prevItems.find((item) => item.car === car._id);
      
      if (existingItem) {
        // If it is in the cart, increment its quantity
        toast.success(`Updated ${car.name} quantity to ${existingItem.quantity + quantity}`);
        return prevItems.map((item) =>
          item.car === car._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // If it's a new item, construct a new cart item and add it to the list
        toast.success(`Added ${car.name} to cart!`);
        return [
          ...prevItems,
          {
            car: car._id,      // Store the Mongo ID
            name: car.name,    // Cache name
            price: car.price,  // Cache price
            imageUrl: car.imageUrl, // Cache image link
            brand: car.brand,  // Cache brand
            category: car.category, // Cache category
            quantity: quantity  // Set requested quantity
          }
        ];
      }
    });
  };

  /**
   * Helper function: Remove an item completely from the cart
   * @param {String} carId - The Mongo ID of the car to remove
   */
  const removeFromCart = (carId) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i.car === carId);
      if (item) {
        toast.error(`Removed ${item.name} from cart`);
      }
      return prevItems.filter((item) => item.car !== carId);
    });
  };

  /**
   * Helper function: Update the quantity of a specific item in the cart
   * @param {String} carId - The Mongo ID of the car to edit
   * @param {Number} newQuantity - The new target quantity
   */
  const updateQuantity = (carId, newQuantity) => {
    // Prevent quantity from dropping below 1
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.car === carId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  /**
   * Helper function: Clear the cart completely (e.g. after checkout completion)
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * Helper function: Calculate total monetary cost of items in the cart
   * @returns {Number} - The grand subtotal amount
   */
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  /**
   * Helper function: Calculate total count of items in the cart
   * @returns {Number} - Sum of all quantities
   */
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Provide all states and actions to children wrapped by this Provider
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 4. Custom hook to make it extremely easy to consume this context in components
export const useCart = () => {
  return useContext(CartContext);
};
