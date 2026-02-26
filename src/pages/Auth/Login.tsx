import "./Login.css"
import Navbar from "../../components/navbar/Navbar"

function Login() {
    return (
        <div className="login-page">
            <Navbar />
            <div className="login-bg">
                <div className="login-orbs">
                    <div className="login-orb login-orb-one" />
                    <div className="login-orb login-orb-two" />
                    <div className="login-orb login-orb-three" />
                </div>
                <div className="login-wrapper">
                    <div className="login-card">
                        <div className="login-brand">
                            <span className="login-brand-dot" />
                            AutoMarket
                        </div>
                        <h2 className="login-title">Welcome back</h2>
                        <p className="login-subtitle">Sign in to your account to continue</p>
                        <form className="login-form">
                            <div className="login-field">
                                <label className="login-label" htmlFor="email">Email address</label>
                                <input className="login-input" id="email" type="email" placeholder="you@example.com" />
                            </div>
                            <div className="login-field">
                                <label className="login-label" htmlFor="password">Password</label>
                                <input className="login-input" id="password" type="password" placeholder="••••••••" />
                                <a className="login-forgot" href="#">Forgot password?</a>
                            </div>
                            <button className="login-submit" type="submit">Sign in</button>
                            <div className="login-divider">
                                <span />
                                <p>or continue with</p>
                                <span />
                            </div>
                            <button className="login-google" type="button">
                                <img
                                    className="login-google-icon"
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/1280px-Google_Favicon_2025.svg.png"
                                    alt="Google"
                                />
                                <span>Google</span>
                            </button>
                            <p className="login-signup-cta">
                                Don't have an account? <a href="#">Sign up</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
