import "./Login.css"
import "../../components/navbar/Navbar"

function Login() {
    return(
        <div className="wrapper">
            <div className="card">
                <h2 className="title">Log In to your account</h2>
                <form className="form">
                    <input className="input" type="email" placeholder="Email"></input>
                    <input className="input" type="password" placeholder="Password"></input>
                    <button className="submit-button" type="submit"></button>
                    <a className="forgot-password-link" href="#"></a>
                </form>
            </div>
        </div>
    );
}

export default Login;