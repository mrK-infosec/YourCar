import "./Tesla.css";
import "../../App.css"
import "../../components/index"

import imgmid from "../../assets/images/Sections-Images/Cars/Rectangle 2.png"
import imgCar1 from "../../assets/images/Sections-Images/Cars/Car.png";
import imgCar2 from "../../assets/images/Sections-Images/Cars/Car-1.png";
import imgCar3 from "../../assets/images/Sections-Images/Cars/Car-2.png";
import imgCar4 from "../../assets/images/Sections-Images/Cars/Car-3.png";
import imgCar5 from "../../assets/images/Sections-Images/Cars/Car-4.png";
import imgCar6 from "../../assets/images/Sections-Images/Cars/Car-5.png";
import imgCar7 from "../../assets/images/Sections-Images/Cars/Car-6.png";
import imgCar8 from "../../assets/images/Sections-Images/Cars/Car-7.png";
import { PrimaryBtn } from "../../components/index";

const Tesla = () => {
  return (
    <section className="tesla container">
      <div className="car-collection">
      <img className="imgcar1" src={imgCar1} alt="bugate"/>
      <img className="imgcar2" src={imgCar2} alt="bugate"/>
      <img className="imgcar3" src={imgCar3} alt="bugate"/>
      <img className="imgcar4" src={imgCar4} alt="bugate"/>
      <img className="imgmid" src={imgmid} alt="bugate"/>
      <img className="imgcar5" src={imgCar5} alt="bugate"/>
      <img className="imgcar8" src={imgCar8} alt="bugate"/>
      <img className="imgcar7" src={imgCar7} alt="bugate"/>
      <img className="imgcar6" src={imgCar6} alt="bugate"/>
      </div>
      <div className="textBox-container">
        <div className="titleBox">
        <h3>Tesla Model 3</h3>
        <p>Disruptive, avant-garde, futuristic, innovative.</p>
        </div>
        <PrimaryBtn>Contact</PrimaryBtn>
      </div>
    </section>
  )
}

export default Tesla