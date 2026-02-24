import "./Login.css"
import "../../components/navbar/Navbar"

function Login() {
    return(
        <div className="login-container">
            <div className="login-inner-container">
                <h1 className="login-title">LOG IN TO YOUR ACCOUNT</h1>
                <input className="email-input" type="email" placeholder="Email"></input>
                <input className="password-input" type="password" placeholder="Password"></input>
                <button className="Login">LOGIN</button>
                <p className="forgot-password">Forgot password?</p>
            </div>
        </div>
    );
}

export default Login;