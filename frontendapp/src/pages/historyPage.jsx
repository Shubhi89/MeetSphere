import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import historyImg from "../images/history.jpg";
import { AuthContext } from "../../contexts/authContext";

function HistoryPage() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch (e) {
        console.log(e);
      }
    };
    fetchHistory();
  }, []);

  let formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  return (
    <div className="min-vh-100 d-flex flex-column">
      <nav className="navbar navbar-light bg-white px-4 shadow-sm">
        <Link to="/" className="navbar-brand fw-bold text-primary fs-2">
          Meetsphere
        </Link>
        <Link to="/home" className="btn btn-outline-primary">
          <i className="fas fa-arrow-left me-1"></i> Back to Home
        </Link>
      </nav>

      <div
        className="row flex-grow-1 m-0"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        <div
          className="col-md-6 p-4 overflow-auto"
          style={{ maxHeight: "calc(100vh - 64px)" }}
        >
          <h2 className="fs-4 mb-3 text-black mt-2 mb-5">
            <i className="fas fa-history me-2"></i>Meeting History
          </h2>
          {meetings.length === 0 ? (
            <div className="text-muted fs-5">No meeting history found.</div>
          ) : (
            <div className="list-group shadow-sm mt-5">
              {meetings.map((ele, idx) => (
                <div
                  key={idx}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h5 className="mb-1">
                      <i className="fas fa-video me-2 text-success"></i>
                      {ele.meetingCode}
                    </h5>
                    <small className="text-muted">
                      <i className="fas fa-calendar-alt me-1"></i>
                      {formatDate(ele.date)}
                    </small>
                  </div>
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="fas fa-info-circle"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light p-0"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <img
            src={historyImg}
            alt="Meeting history"
            className="img-fluid rounded shadow"
            style={{ maxHeight: "90%", maxWidth: "90%", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
