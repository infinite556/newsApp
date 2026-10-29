import logo from '../images/logo.png'
import '../css/Header.css'

function Header () {
return (
    <header id="hd">
        <div className="brand">
            <img id="logo" src={logo} alt="Techifly logo" />
            <div>
                <p className="brand-kicker">Your daily briefing</p>
                <h1>Techifly <span>News</span></h1>
            </div>
        </div>
    </header>
)
}

export default Header