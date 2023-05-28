import "./MainSecHeading.css";

const MainSecHeading = (props) => {
  /**
   * mainTitle        : String
   * subTitle         : String
   * subTitleColor    : String has a Color Formate like #777
   * isCenter :TODO   : Boolean
   *
   *
   */

  let styleSubTitle = {
    color: props.subTitleColor,
  };

  let styleMainTitle = {
    color: props.mainTitleColor,
  }

  if (props.isCenter) {
    console.log("i am center");
    styleMainTitle = { 
      textAlign: "center",
      position: "relative",
      left: "1rem",
      color: props.mainTitleColor,
      top: "4rem",
    };
    styleSubTitle = {
      color: props.subTitleColor, 
      top: "4.9rem",
      left: "1.2rem",
      textAlign: "center"
    };
  } else {
    console.log("I'm not center");
    styleSubTitle = {
      color: props.subTitleColor,
      top: "14px",
      left: "15px",
    }
  }

  return (
    <div className="main-sec-heading">
      <h2 style={styleMainTitle}>{props.mainTitle}</h2>
      <h3 style={styleSubTitle}>{props.subTitle}</h3>
    </div>
  );
};

export default MainSecHeading;
