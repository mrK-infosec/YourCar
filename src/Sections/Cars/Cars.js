// Components
import "./Cars.css";
import { MainSecHeading } from "../../components/index";
// import { Sbtn } from "../../components/index";
// import { CarCard } from "../../components/index"

// Images
import car1 from "../../assets/images/image 3.png";
import car2 from "../../assets/images/image 3-1.png";
import car3 from "../../assets/images/image 3-2.png";

import { CarCard } from "./../../components/index";
// icons
import vector from "../../assets/images/icons/chevron-right.svg";
import vectorl from "../../assets/images/icons/chevron-right-1.svg";

const Cars = () => {
  return (
    <section id="cars" className="cars container">
      <MainSecHeading
        mainTitle="CARS"
        subTitle="Cars"
        isCenter={true}
        styleMainTitle={true}
        subTitleColor={"#741906"}
      />
      <div className="card-container">
        <img className="vector" src={vector} alt="sd" />
        <CarCard
          id={1}
          price={500}
          carImage={car1}
          mainTitle="FIRST CLASS"
          subTitle="Mercedes maybach s600"
          description="Prestigious, exclusive, unique and handcrafted. The perfection of
          the S-Class, blended with the exclusivity of the Maybach, makes the
          Mercedes-Maybach S-Class the luxurious and technological spearhead
          of Mercedes-Benz."
          seats="4"
          luggage="2"
        />
        <CarCard
          id={2}
          price={400}
          carImage={car2}
          mainTitle="BUSINESS CLASS"
          subTitle="Mercedes G - wagon"
          description="The Mercedes-Benz G-Class, sometimes colloquially called the G-Wagen
          as an abbreviation of Geländewagen is a four-wheel drive automobile
          manufactured by Magna Steyr formerly Steyr-Daimler-Puch in Austria
          and sold by Mercedes-Benz."
          seats="5"
          luggage="2"
        />
        <CarCard
          id={3}
          price={250}
          carImage={car3}
          mainTitle="SUV"
          subTitle="Mercedes M class"
          description="The Mercedes-Benz GLE,sometimes colloquially called formerly Mercedes-Benz M-Class designated
            with the ML nomenclature is a mid-size luxury SUV produced by the
            German manufacturer Mercedes-Benz."
          seats="4"
          luggage="2"
        />
        {/*
          <div className="section-bot">
            <div className="properties-car">
            <div className="car-pro">
              <MdPeople />
              <h6>4 Seats</h6>
              </div>
              <div className="car-pro">
              <img className="luggage" src={lagg} alt="luggage" />
              <h6>2 Luggage</h6>
              </div>
            </div>
            <div className="sp-btns">
              <button className="minusbtn">-</button>
              <span>7</span>
              <button className="addbtn">+</button>
            </div>
          </div>
        </div>
        <div className="car-card">
          <div className="brand-title">
            <img className="car" src={car2} alt="Mercedes G - wagon" />
            <h4>BUSINESS CLASS</h4>
            <h5>Mercedes G - wagon</h5>
          </div>
          <p>
            The Mercedes-Benz G-Class, sometimes colloquially called the G-Wagen
            as an abbreviation of Geländewagen is a four-wheel drive automobile
            manufactured by Magna Steyr formerly Steyr-Daimler-Puch in Austria
            and sold by Mercedes-Benz.
          </p>
          <div className="section-bot">
            <div className="properties-car">
            <div className="car-pro">
              <MdPeople />
              <h6>5 Seats</h6>
              </div>
              <div className="car-pro">
              <img className="luggage" src={lagg} alt="luggage" />
              <h6>2 Luggage</h6>
              </div>
            </div>
            <div className="sp-btns">
              <button className="minusbtn">-</button>
              <span>7</span>
              <button className="addbtn">+</button>
            </div>
          </div>
        </div>
        <div className="car-card">
          <div className="brand-title sec">
            <img className="car" src={car3} alt="Mercedes M class" />
            <h4>SUV</h4>
            <h5>Mercedes M class</h5>
          </div>
          <p>
            The Mercedes-Benz GLE,sometimes colloquially called formerly Mercedes-Benz M-Class designated
            with the "ML" nomenclature, is a mid-size luxury SUV produced by the
            German manufacturer Mercedes-Benz.
          </p>
          <div className="section-bot">
            <div className="properties-car">
              <div className="car-pro">
              <MdPeople />
              <h6>4 Seats</h6>
              </div>
              <div className="car-pro">
              <img className="luggage" src={lagg} alt="luggage" />
              <h6>2 Luggage</h6>
              </div>
            </div>
            <div className="sp-btns">
              <button className="minusbtn">-</button>
              <span>7</span>
              <button className="addbtn">+</button>
            </div>
          </div>
        </div> */}
        <img className="vector" src={vectorl} alt="lv" />
      </div>
      <div className="dot-pages">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot1"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </section>
  );
};

export default Cars;
