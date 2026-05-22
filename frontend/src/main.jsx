/**
 * MAIN BOOTSTRAP ENTRYPOINT (React client)
 * This is the first file executed when the browser boots up the React frontend.
 * Features:
 * 1. Imports core React 18 DOM rendering libraries.
 * 2. Imports the central Tailwind CSS stylesheet (index.css).
 * 3. Wraps the main <App /> in the React Router <BrowserRouter> so URL paths work.
 * 4. Wraps everything in our <CartProvider> to grant global shopping cart state access!
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import App from './App';
import './index.css'; // Global Tailwind CSS styling rules

// Target our root mount node in index.html (id="root")
const rootElement = document.getElementById('root');

// Initialize React 18 virtual DOM root
const root = ReactDOM.createRoot(rootElement);

// Render the application tree inside React StrictMode (enforces best practices)
root.render(
  <React.StrictMode>
    {/* Router wraps the entire app to enable client-side navigation paths */}
    <BrowserRouter>
      {/* CartProvider wraps the app to deliver global shopping cart context variables */}
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
