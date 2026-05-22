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
    <>
      {quantity === 0 ? (
        <button className="btn-primary" onClick={countUp} style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#741906', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
          Rent Now
        </button>
      ) : (
        <div className="sp-btns">
          <button className="minusbtn" onClick={countDown}>
            -
          </button>
          <span>{quantity}</span>
          <button className="addbtn" onClick={countUp}>
            +
          </button>
        </div>
      )}
    </>
  );
};

export default Sbtn;

