import "../Services/Services.css";
import "../../App.css"
import "../../components/index";
import { MainSecHeading } from "../../components/index";

import starIcon from "../../assets/images/Sections-Images/Services/Group 1084.png";
import keyIcon from "../../assets/images/Sections-Images/Services/icons8-lease-100 1.png";
import dimonIcon from "../../assets/images/Sections-Images/Services/Vector.png";
// import ctaBg from '../../assets/images/Sections-Images/Services/CTA BG.png'

const Services = () => {
  return (
    <section id="service" className="Services container">
      <div className="service-title">
        <MainSecHeading
          mainTitle="SERVICES"
          subTitle="Services"
          isCenter={true}
          styleMainTitle={true}
          subTitleColor={"#12263c"}
        />
        {/* <img className="ctaBg" src={ctaBg} alt="car" /> */}
      </div>
      {/* <div className="cards">
      </div> */}
      <div className="textbox">
        <div className="box1">
          <span className="icn">
          <img className="starIcon" src={starIcon} alt="star" />
          </span>
          <h5>Car sales</h5>
          <p>
            Car sales At YourCar, we offer a wide selection of luxury vehicles
            for sale. Whether you're in the market for a sleek sports car or a
            spacious SUV, we have the perfect vehicle to fit your needs.
          </p>
        </div>
        <div className="box">
          <span>
            <img className="starIcon" src={keyIcon} alt="star" />
          </span>
          <h5>Car rental</h5>
          <p>
            If you're in need of a luxury car rental, look no further than
            YourCar. Our fleet of high-end vehicles is regularly maintained and
            serviced to ensure that you have a safe and comfortable driving
            experience.
          </p>
        </div>
        <div className="box2">
          <span className="icn">
          <img className="starIcon" src={dimonIcon} alt="star" />
          </span>
          <h5>Car selling</h5>
          <p>
            At YourCar, we make it easy to sell your car. Simply bring your
            vehicle in for an appraisal, and we'll handle the rest. We offer
            fair prices and a hassle-free selling process, so you can get your
            vehicle with minimal effort.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;
