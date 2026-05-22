import "../Sbtn/Sbtn.css";
import { useShoppingCart } from "../ShoppingCart/ShoppingCart";

const Sbtn = ({ product }) => {
  const { getItemQuantity, addToCart, updateQuantity } = useShoppingCart();
  const quantity = getItemQuantity(product.id);

  function countUp() {
    if (quantity === 0) {
      addToCart(product);
    } else {
      updateQuantity(product.id, quantity + 1);
    }
  }

  function countDown() {
    if (quantity > 0) {
      updateQuantity(product.id, quantity - 1);
    }
  }

  return (
    <div className="sp-btns">
      <button className="minusbtn" onClick={countDown}>
        -
      </button>
      <span>{quantity}</span>
      <button className="addbtn" onClick={countUp}>
        +
      </button>
    </div>
  );
};

export default Sbtn;

