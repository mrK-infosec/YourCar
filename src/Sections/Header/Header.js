import "./Header.css";
import { useState } from "react";

import { Sbtn, PrimaryBtn } from "../../components";
import ShoppingCartProvider from "../../components/ShoppingCart/ShoppingCart";

import { FaTrash } from "react-icons/fa";

import cart from "../../assets/images/Sections-Images/Hero/Group.png";
import car1 from "../../assets/images/image 3.png";
import car2 from "../../assets/images/image 3-1.png";
import car3 from "../../assets/images/image 3-2.png";

function Header() {
  const [classInBtn, setClassInBtn] = useState("");

  function addActiveClass() {
    // if (classInBtn.includes("active")) {
    //   setClassInBtn("");
    // } else {
    //   setClassInBtn("active");
    // }

    // classInBtn.includes("active") ? setClassInBtn("") : setClassInBtn("active");

    setClassInBtn(`${classInBtn.includes("active") ? "" : "active"}`);
  }

  return (
    <>
      <header className="container">
        <h1 className="logo">
          Your<span>Car</span>
        </h1>
        <div className="main-nav">
          <ul className="nav-child">
            <li>
              <a href="#hero" className="active">
                Home
              </a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#service">Service</a>
            </li>
            <li>
              <a href="#cars">Cars</a>
            </li>
            <li>
              <a href="#contact">Contact us</a>
            </li>
          </ul>
          <div
            className={`shopping  ${classInBtn}`}
            onClick={addActiveClass}
          >
            <img className="shopping-cart" src={cart} alt="cart" />
            <span className="sty quantity">0</span>
          </div>
          <div className="side-list">
            <ul className="card-list">
              <li className="cartCard">
                <div className="min-textBox">
                  <h3>First class</h3>
                  <p>Mercedes maybach s600</p>
                  <div className="control-btns">
                    <Sbtn />
                    <button>
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <img src={car1} alt="" />
              </li>
              <li className="cartCard">
                <div className="min-textBox">
                  <h3>First class</h3>
                  <p>Mercedes maybach s600</p>
                  <div className="control-btns">
                    <Sbtn />
                    <button>
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <img src={car1} alt="" />
              </li>
              {/*<li className="cartCard">
                  <div className="min-textBox">
                <h6>First class</h6>  
                <h7>Mercedes maybach s600</h7>
                <Sbtn />
                  </div>
                </li>
                <li className="cartCard">
                  <div className="min-textBox">
                <h6>First class</h6>  
                <h7>Mercedes maybach s600</h7>
                <Sbtn />
                  </div>
                </li> */}
            </ul>
            <PrimaryBtn>Delete All</PrimaryBtn>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
