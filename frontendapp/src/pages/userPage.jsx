import React, { useState } from "react";
import image from "../images/test.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext.jsx";

export default function UserPage() {
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { addToUserHistory } = React.useContext(AuthContext);
  const handleJoin = async () => {
    if (username.trim() === "") {
      setErrors({ username: "Username is required" });
    } else {
      setErrors({});
      await addToUserHistory(username);
      navigate("/url", { state: { name: username, isGuest: false } });
    }
  };

  return (
    <div className="container-fluid px-0">
      <div className="row flex-column-reverse flex-md-row">
        <div className="col-12 col-md-8 d-none d-md-flex justify-content-center align-items-center min-vh-100">
          <img
            src={image}
            alt="Lobby Background"
            className="img-fluid w-100 h-100 object-fit-cover"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="col-12 col-md-4 d-flex justify-content-center align-items-center min-vh-100 lobby-overlay">
          <div className="card shadow p-4 w-100" style={{ maxWidth: "400px" }}>
            <h3 className="text-center mb-4">Enter into Lobby</h3>

            <div className="mb-3">
              <label className="form-label"> Your Username</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-label="Username"
                  aria-describedby="addon-wrapping"
                />
              </div>
              {errors.username && (
                <small className="text-danger">{errors.username}</small>
              )}
            </div>

            <button onClick={handleJoin} className="btn btn-primary w-100 mb-3">
              Join Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
