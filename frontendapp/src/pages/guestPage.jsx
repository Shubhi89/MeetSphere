import { useState } from "react";
import image from "../images/test.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function GuestPage() {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleJoin = () => {
    if (name.trim() === "") {
      setErrors({ name: "Name is required" });
    } else {
      setErrors({});
      navigate("/url", { state: { name, isGuest: true } });
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
              <label className="form-label"> Your full name</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Name"
                  aria-describedby="addon-wrapping"
                />
              </div>
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
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
