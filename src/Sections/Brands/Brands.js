import "./Brands.css";

import bmwLogo from "../../assets/images/Logos/BMW.png";
import volvoLogo from "../../assets/images/Logos/Volvo_logo1 1.png";
import suzukiLogo from "../../assets/images/Logos/Suzuki_logo_2 1.png";
import toytaLogo from "../../assets/images/Logos/Toyota_EU 1.png";
import nissanLogo from "../../assets/images/Logos/Nissan_2020_logo.png";
import mercedesLogo from "../../assets/images/Logos/Mercedes-Benz_free_logo.png";
import subaruLogo from "../../assets/images/Logos/subaru.png";
import mustubshiLogo from "../../assets/images/Logos/mustbshi-logo.png";

const Brands = () => {
  return (
    <section className="brands container">
      <div className="group-brand">
        <img className="" src={bmwLogo} alt="" />
        <img className="" src={volvoLogo} alt="" />
        <img className="" src={suzukiLogo} alt="" />
        <img className="" src={toytaLogo} alt="" />
        <img className="" src={nissanLogo} alt="" />
        <img className="" src={mercedesLogo} alt="" />
        <img className="" src={subaruLogo} alt="" />
        <img className="" src={mustubshiLogo} alt="" />
      </div>
    </section>
  );
};

export default Brands;
