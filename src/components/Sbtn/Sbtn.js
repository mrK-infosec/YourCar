import "../Sbtn/Sbtn.css";
import { useState } from "react";

const Sbtn = () => {
  const [numberOfCars, setNumberOfCars] = useState(0);

  function countUp() {
    setNumberOfCars(numberOfCars + 1);
  }

  function countDown() {
    if (numberOfCars > 0) {
      setNumberOfCars(numberOfCars - 1);
    }
  }


  return (
    <div className="sp-btns">
      <button className="minusbtn" onClick={countDown}>
        -
      </button>
      <span>{numberOfCars}</span>
      <button className="addbtn" onClick={countUp}>
        +
      </button>
    </div>
  );
};

export default Sbtn;

// function useStateImp(initValue) {
//   let itemValue = initValue;

//   function setItemValue(newValue) {
//     itemValue = newValue;
//   }

//   return [itemValue, setItemValue];
// }
