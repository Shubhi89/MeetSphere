import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../auth.css";

const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light px-3 px-md-4 border-bottom "
      style={{
        backgroundColor: "transparent",
        boxShadow: "none",
        width: "100%",
        zIndex: 1000,
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-primary fs-2" to ="/">
          Meetsphere
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <div className="d-flex gap-2 mt-2 mt-lg-0">
            <Link to="/signin" className="btn btn-outline-primary">
              <FontAwesomeIcon icon={faSignInAlt} className="me-1" />
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-primary">
              <FontAwesomeIcon icon={faUserPlus} className="me-1" />
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
