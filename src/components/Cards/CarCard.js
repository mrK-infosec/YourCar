import "../Cards/CarCard.css";
import { MdPeople } from "react-icons/md";
import lagg from "./../../assets/images/icons/lagg.png";

import { Sbtn } from "./../index";

const CarCard = (props) => {
  const product = {
    id: props.id,
    name: props.subTitle,
    class: props.mainTitle,
    price: props.price,
    image: props.carImage,
    seats: props.seats,
    luggage: props.luggage,
    description: props.description,
  };

  return (
    <div className="car-card">
      <div className="brand-title">
        <img className="car" src={props.carImage} alt={props.subTitle} />

        <h4>{props.mainTitle}</h4>
        <h5>{props.subTitle}</h5>
      </div>
      <p>{props.description}</p>
      <div className="section-bot">
        <div className="properties-car">
          <div className="car-pro">
            <MdPeople />
            <h6>{props.seats} Seats</h6>
          </div>
          <div className="car-pro">
            <img className="luggage" src={lagg} alt="luggage" />
            <h6>{props.seats === "5" ? "2" : props.luggage} Luggage</h6>
          </div>
        </div>
        <Sbtn product={product} />
      </div>
    </div>
  );
};

export default CarCard;

