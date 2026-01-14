import "./topbar.css"
import { Link } from "react-router-dom";

export default function topbar() {
  return (
    <div className="top">
        <div className="topLeft">
            <i className="topIcon fa-brands fa-square-facebook"></i>
            <i className="topIcon fa-brands fa-square-twitter"></i>
            <i className="topIcon fa-brands fa-square-bluesky"></i>
        </div>
    </div>
  )
}
