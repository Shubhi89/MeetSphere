import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faUser } from "@fortawesome/free-solid-svg-icons";
import image from "../images/photo.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className=" hero-section d-flex flex-column justify-content-center align-items-center text-center px-3 py-5"
      style={{ minHeight: "80vh" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 mt-5 text-md-start text-center">
            <h1 className="display-5 fw-bold mb-3">
              Connect Instantly, Anywhere
            </h1>
            <p className="lead text-muted mb-4">
              Meet, chat, and collaborate in one click with Meetsphere.
            </p>

            <div className="d-grid d-sm-flex  gap-3">
              <Link to={"/signin"} className="btn btn-primary">
                <FontAwesomeIcon icon={faPlay} className="me-2" />
                Get Started
              </Link>
              <Link to={"/guest"} className="btn btn-outline-primary">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Join as Guest
              </Link>
            </div>
          </div>
          <div className="col-12 col-md-6 mt-4 mt-md-0">
            <img
              src={image}
              alt="Hero"
              className="img-fluid d-block mx-auto"
              style={{ width: "70%", maxWidth: "100%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
