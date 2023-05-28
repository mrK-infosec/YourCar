import "./Footer.css";
import "../../App.css";

import { TiLocation } from "react-icons/ti";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

function Footer() {
  return (
    <>
      <footer id="contact" className="footer container">
        <div className="columns-cont">
          <div className="column">
            <h2 className="footer-heading footer-logo">
              Your<span>Car</span>
            </h2>
            <p>
              We are known for luxurious and premium chaffeur services
              worldwide. We are simply the best you can find.
            </p>
            <p>
              we are dedicated to providing our customers with a first-class car
              buying, selling, and renting experience.
            </p>
          </div>
          <div className="column">
            <h2 className="footer-heading">News Letter</h2>
            <p>
              Subscribe to our news letter for updates, news and exclusive
              offers
            </p>
            <div className="news-group">
              <input className="email-input" type="email" placeholder="Email" />
              <input className="btn subscribe-btn" type="submit" />
            </div>
          </div>
          <div className="column footer-contact">
            <h2 className="footer-heading ">Contact</h2>
            <ul>
              <li>
                <a href="./#">
                  <TiLocation />
                  <p>2038 2nd Avenue, Las Vegas, United States</p>
                </a>
              </li>
              <li>
                <a href="./#">
                  <FaPhoneAlt />
                  <p>01444773421423 01477678449405</p>
                </a>
              </li>
              <li>
                <a href="./#">
                  <FaEnvelope />
                  <p>info@YourCar.com</p>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="social-cont">
          <a href="www.facebook.com">
            <FaFacebook />
          </a>
          <a href="www.twitter.com">
            <FaTwitter />
          </a>
          <a href="www.instagram.com">
            <FaInstagram />
          </a>
        </div>
        <hr />
        <p className="cp">©Copyright 2023 · <strong>YourCar</strong> All rights reserved </p>
      </footer>
    </>
  );
}

export default Footer;
