import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext.jsx";
import "../auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faLock,
  faImagePortrait,
} from "@fortawesome/free-solid-svg-icons";

const SignIn = () => {
  const { handleSignIn } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!username) newErrors.username = "Username is required.";
    if (!password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      await handleSignIn(username, password);
      console.log("Logged in!");
      navigate("/home", { state: { username } });
    } catch (err) {
      const errorText = err.message?.toLowerCase() || "";
      if (errorText.includes("password")) {
        setErrors({ password: "Incorrect password." });
      } else if (errorText.includes("user")) {
        setErrors({ username: "User not found." });
      } else {
        setErrors({ general: "Login failed. Please try again." });
      }
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="auth-bg">
      <div
        className="card shadow p-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">
          <FontAwesomeIcon icon={faUserPlus} /> Sign In
        </h3>
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faImagePortrait} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {errors.username && (
              <small className="text-danger">{errors.username}</small>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && (
              <small className="text-danger">{errors.password}</small>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Sign In
          </button>
          {errors.general && (
            <small className="text-danger">{errors.general}</small>
          )}
        </form>
        <p className="mt-3 text-center">
          Dont have an account? <Link to ="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
