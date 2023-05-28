import "./btns.css"


const PrimaryBtn = (props) => {
  /*
  *text
  *
  */
  return (
<button className="btn btn-primary">{props.children}</button>
  )
}

export default PrimaryBtn;
