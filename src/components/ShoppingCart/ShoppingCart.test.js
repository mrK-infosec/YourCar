import React from "react";
import { render, screen, act } from "@testing-library/react";
import { ShoppingCartProvider, useShoppingCart } from "./ShoppingCart";

const TestComponent = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getItemQuantity,
    clearCart,
    cartQuantity,
    cartTotal,
  } = useShoppingCart();

  return (
    <div>
      <div data-testid="cart-qty">{cartQuantity}</div>
      <div data-testid="cart-total">{cartTotal}</div>
      <div data-testid="maybach-qty">{getItemQuantity(1)}</div>
      
      <button
        data-testid="add-btn"
        onClick={() =>
          addToCart({
            id: 1,
            name: "Mercedes maybach s600",
            price: 500,
            class: "FIRST CLASS",
          })
        }
      >
        Add Maybach
      </button>
      
      <button
        data-testid="inc-btn"
        onClick={() => updateQuantity(1, getItemQuantity(1) + 1)}
      >
        Increment Maybach
      </button>

      <button
        data-testid="dec-btn"
        onClick={() => updateQuantity(1, getItemQuantity(1) - 1)}
      >
        Decrement Maybach
      </button>

      <button data-testid="remove-btn" onClick={() => removeFromCart(1)}>
        Remove Maybach
      </button>

      <button data-testid="clear-btn" onClick={clearCart}>
        Clear Cart
      </button>

      <ul data-testid="cart-items">
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} - Qty: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe("ShoppingCart Context State", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should initialize with an empty cart", () => {
    render(
      <ShoppingCartProvider>
        <TestComponent />
      </ShoppingCartProvider>
    );

    expect(screen.getByTestId("cart-qty").textContent).toBe("0");
    expect(screen.getByTestId("cart-total").textContent).toBe("0");
  });

  test("should add an item to the cart and update totals", () => {
    render(
      <ShoppingCartProvider>
        <TestComponent />
      </ShoppingCartProvider>
    );

    const addBtn = screen.getByTestId("add-btn");
    
    act(() => {
      addBtn.click();
    });

    expect(screen.getByTestId("cart-qty").textContent).toBe("1");
    expect(screen.getByTestId("maybach-qty").textContent).toBe("1");
    expect(screen.getByTestId("cart-total").textContent).toBe("500");
  });

  test("should increment, decrement, and remove items correctly", () => {
    render(
      <ShoppingCartProvider>
        <TestComponent />
      </ShoppingCartProvider>
    );

    const addBtn = screen.getByTestId("add-btn");
    const incBtn = screen.getByTestId("inc-btn");
    const decBtn = screen.getByTestId("dec-btn");

    // Add item (Qty = 1)
    act(() => {
      addBtn.click();
    });
    expect(screen.getByTestId("maybach-qty").textContent).toBe("1");

    // Increment (Qty = 2)
    act(() => {
      incBtn.click();
    });
    expect(screen.getByTestId("maybach-qty").textContent).toBe("2");
    expect(screen.getByTestId("cart-total").textContent).toBe("1000");

    // Decrement (Qty = 1)
    act(() => {
      decBtn.click();
    });
    expect(screen.getByTestId("maybach-qty").textContent).toBe("1");
    expect(screen.getByTestId("cart-total").textContent).toBe("500");

    // Decrement again (Qty = 0, should remove item)
    act(() => {
      decBtn.click();
    });
    expect(screen.getByTestId("maybach-qty").textContent).toBe("0");
    expect(screen.getByTestId("cart-qty").textContent).toBe("0");
  });

  test("should clear all items in the cart", () => {
    render(
      <ShoppingCartProvider>
        <TestComponent />
      </ShoppingCartProvider>
    );

    const addBtn = screen.getByTestId("add-btn");
    const clearBtn = screen.getByTestId("clear-btn");

    act(() => {
      addBtn.click();
    });
    expect(screen.getByTestId("cart-qty").textContent).toBe("1");

    act(() => {
      clearBtn.click();
    });
    expect(screen.getByTestId("cart-qty").textContent).toBe("0");
  });
});
