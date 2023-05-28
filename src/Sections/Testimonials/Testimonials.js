//components
import "./Testimonials.css";
import "../../components/index";
import { MainSecHeading } from "../../components/index";

//images
import star from "../../assets/images/icons/Star Copy 4.png";
import bmwCar from "../../assets/images/car4.png";

const Testimonials = () => {
  return (
      <section className="Testimonials container">
        <MainSecHeading
          mainTitle="TESTIMONIALS"
          subTitle="Testimonials"
          isCenter={true}
          styleMainTitle={true}
          mainTitleColor={"#193553"}
          subTitleColor={"#EBEBEB"}
        />
        <div className="inside-box">
          <p>
            I recently bought a car through YourCar and I was blown away by
            their exceptional service. The staff were friendly and
            knowledgeable, and they helped me find the perfect car for my needs.
            I highly recommend YourCar to anyone looking for a luxury car buying
            experience.
          </p>
          <div className="group-star">
            <img className="" src={star} alt="star" />
            <img className="" src={star} alt="star" />
            <img className="" src={star} alt="star" />
            <img className="" src={star} alt="star" />
            <img className="" src={star} alt="star" />
          </div>
          <div className="comment-user">
            <h5>Annie Rudy</h5>
            <h6>Las vegas</h6>
          </div>
        </div>
        <img className="bmwcar" src={bmwCar} alt="BMW" />
      </section>

  );
};

export default Testimonials;
