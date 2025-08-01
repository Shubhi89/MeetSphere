import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import heroImg from "../images/home.jpg";
import { Link } from "react-router-dom";
import withAuth from "../utils/withAuth.jsx";
import { useLocation } from "react-router-dom";

function HomePage() {
  const location = useLocation();
  const stateUsername = location.state?.username;
  const localStorageUsername = localStorage.getItem("username");

  const username = stateUsername || localStorageUsername || "Guest";

  useEffect(() => {
    if (stateUsername) {
      localStorage.setItem("username", stateUsername);
    }
  }, [stateUsername]);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
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
          <a className="navbar-brand fw-bold text-primary fs-2" href="/">
            Meetsphere
          </a>

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
              <button className="btn btn-outline-primary">
                <i className="fas fa-user-circle me-1"></i> {username}
              </button>
              <Link
                to="/"
                className="btn btn-primary"
                onClick={() => localStorage.removeItem("username")}
              >
                <i className="fas fa-sign-out-alt me-1"></i>Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-6 text-center text-lg-start">
            <h1 className="fw-bold display-5 mb-4">
              Welcome <span className="text-primary">{username}</span>
            </h1>
            <p className="lead text-muted">
              Join or create seamless video meetings with one click. Fast,
              secure, and reliable!
            </p>
            <div className="mt-4 d-flex flex-column flex-sm-row gap-3">
              <a href="/userPage" className="btn btn-primary">
                <i className="fas fa-door-open"></i> Join Meeting
              </a>
              <a href="/history" className="btn btn-outline-secondary">
                <i className="fas fa-history"></i> View History
              </a>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <img
              src={heroImg}
              alt="Meeting Illustration"
              className="img-fluid rounded shadow"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(HomePage);
