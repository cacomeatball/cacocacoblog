import "./topbar.css"

export default function topbar() {
  return (
    <div className="top">
        <div className="topLeft">
            <a className="link" href='https://x.com/CacoMeatBall'>
            caco's twitter
            <i className="topIcon fa-brands fa-square-twitter"></i>
            </a>
            <a className="link" href='https://bsky.app/profile/cacomeatball.bsky.social'>
            caco's bluesky
            <i className="topIcon fa-brands fa-square-bluesky"></i>
            </a>
        </div>
    </div>
  )
}
