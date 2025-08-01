import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/authContext.jsx";
import "../auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faUser,
  faUserPlus,
  faImagePortrait,
} from "@fortawesome/free-solid-svg-icons";
const SignUp = () => {
  const { handleSignUp } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name) newErrors.name = "Name is required.";
    if (!username) newErrors.username = "Username is required.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const message = await handleSignUp(name, username, password);
      console.log("Success:", message);
      navigate("/signin");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-bg ">
      <div
        className="card shadow p-4 "
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">
          <FontAwesomeIcon icon={faUserPlus} /> Sign Up
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {errors.name && (
              <small className="text-danger">{errors.name}</small>
            )}
          </div>
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
                placeholder="Enter Username"
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
            Sign Up
          </button>
          {errors.general && (
            <div className="alert alert-danger">{errors.general}</div>
          )}
        </form>
        <p className="mt-3 text-center">
          Already have an account? <Link href="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
