import "./topbar.css"
import { Link } from "react-router-dom";

export default function topbar() {
    const user = false;
  return (
    <div className="top">
        <div className="topLeft">
            <i className="topIcon fa-brands fa-square-facebook"></i>
            <i className="topIcon fa-brands fa-square-twitter"></i>
            <i className="topIcon fa-brands fa-square-bluesky"></i>
        </div>
        <div className="topCenter">
            <ul className="topList">
                <li className="topListItem">
                    Home
                </li>
                <li className="topListItem">
                    About
                </li>
                <li className="topListItem">
                    Contact
                </li>
                <li className="topListItem">
                    Write
                </li>
            </ul>
        </div>
        <div className="topRight">
            <img
                        className="topImg"
                        src="https://pbs.twimg.com/media/G9joRN3bUAAau9-?format=jpg&name=small"
                        alt=""
                    />
            <i className="topSearchIcon fa-solid fa-magnifying-glass"></i>
        </div>
    </div>
  )
}
