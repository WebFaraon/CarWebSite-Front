import "./Login.css"
import "../../components/navbar/Navbar"

function Login() {
    return(
        <div className="wrapper">
            <div className="card">
                <h2 className="title">Welcome back!</h2>
                <h4 className="info">Enter your credentials to continue.</h4>
                <form className="form">
                    <input className="input" type="email" placeholder="Email"></input>
                    <input className="input" type="password" placeholder="Password"></input>
                    <button className="submit-button" type="submit">LOGIN</button>
                    <a className="forgot-password-link" href="#">Forgot Your Password?</a>
                </form>
            </div>
        </div>
    );
}

export default Login;