import { Children, createContext, useContext, useState } from "react";

const ShoppingCartContext = createContext({});

const ShoppingCartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  return (
    <ShoppingCartContext.Provider value={{ cartItems }}>
      {children}
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartProvider;

export const useShoppingCart = () => {
  return useContext(ShoppingCartContext);
};

// let openShopping = document.querySelector(".shopping");
// let list = document.querySelector(".side-list");
// let  cardList = document.querySelector('.card-list')
// let body = document.querySelector('body');
// let quantity = document.querySelector('.quantity');

// // openShopping.addEventListener('click', ()=> {body.classList.add('active')});



let products = [
  {
    id: 1,
    name: 'Mercedes maybach s600',
    image: "../../assets/images/image 3.png",
  },

  {
    id:2,
    name:"Mercedes G - wagon",
    image: "../../assets/images/image 3-1.png",
  },

  {
    id:3,
    name:"Mercedes M class",
    image: "../../assets/images/image 3-2.png",
  }
];