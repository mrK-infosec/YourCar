import "./Hero.css";
import { PrimaryBtn } from "./../../components/index";

import { ImArrowUpRight2 } from "react-icons/im"
const Hero = () => {
  return (
    <section id="hero" className="hero container">
      <div className="hero-desc">
        <h2 className="first-heading">
          Find the perfect car for you at YourCar
        </h2>
        <p>
          We offer a wide range of cars that cater to your needs and budget.
          Visit us today and drive away with your dream car
        </p>
        <div className="button-hero">
        <PrimaryBtn><ImArrowUpRight2 /> Discover</PrimaryBtn>
        </div>
      </div>
    </section>
  );
};

export default Hero;
