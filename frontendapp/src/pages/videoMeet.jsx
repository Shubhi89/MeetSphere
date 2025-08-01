import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import image from "../images/videoPage.jpg";
import servers from "../../environment";
const server_url = servers.prod;

var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeet() {
  var socketRef = useRef();
  let socketIdRef = useRef();
  let localvideoRef = useRef();

  const navigate = useNavigate();

  let [videoAvailable, setvideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);
  let [screenAvailable, setScreenAvailable] = useState();
  let [video, setVideo] = useState(true);
  let [audio, setAudio] = useState(true);
  let [screen, setScreen] = useState();
  let [chatOpen, setChatOpen] = useState(false);
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  let [newMessages, setNewMessages] = useState(0);

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  const location = useLocation();
  const guestStatus = location.state?.isGuest ?? true;

  const storedUsername = localStorage.getItem("username");
  let defaultName =
    location.state?.name ||
    storedUsername ||
    `Guest-${Math.floor(Math.random() * 10000)}`;

  if (!storedUsername) {
    localStorage.setItem("username", defaultName);
  }

  const [username, setUsername] = useState(defaultName);
  const [isGuest, setIsGuest] = useState(guestStatus);

  useEffect(() => {
    getPermissions().then(() => {
      getMedia();
    });
  }, []);

  let getDisplayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDisplayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  const getPermissions = async () => {
    try {
      let stream;
      let audioAllowed = false;
      let videoAllowed = false;

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoAllowed = true;
        setvideoAvailable(true);
        console.log("Video permission granted");

        if (localvideoRef.current) {
          localvideoRef.current.srcObject = stream;
        }
      } catch (videoErr) {
        setvideoAvailable(false);
        console.log("Video permission denied");
      }

      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioAllowed = true;
        setAudioAvailable(true);
        console.log("Audio permission granted");

        if (stream) {
          audioStream
            .getAudioTracks()
            .forEach((track) => stream.addTrack(track));
        } else {
          stream = audioStream;
        }
      } catch (audioErr) {
        setAudioAvailable(false);
        console.log("Audio permission denied");
      }

      if (stream) {
        window.localStream = stream;
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
        console.log("Screen sharing is supported");
      } else {
        setScreenAvailable(false);
        console.log("Screen sharing not supported");
      }
    } catch (err) {
      console.error("Unexpected error in getPermissions:", err);
    }
  };

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log("Error in getUserMediaSuccess:", e);
    }
    window.localStream = stream;
    localvideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) {
        continue;
      }
      connections[id].addStream(window.localStream);
      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => {
            console.log("Error setting local description:", e);
          });
      });
    }

    stream.getTracks().forEach((track) => {
      track.onended = () => {
        setVideo(false);
        setAudio(false);

        try {
          let tracks = localvideoRef.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        } catch (e) {
          console.log("Error stopping tracks:", e);
        }

        let blackSilence = (...args) =>
          new MediaStream([black(...args), silence()]);
        window.localStream = blackSilence();
        localvideoRef.current.srcObject = window.localStream;

        for (let id in connections) {
          connections[id].addStream(window.localStream);
          connections[id].createOffer().then((description) => {
            connections[id]
              .setLocalDescription(description)
              .then(() => {
                socketRef.current.emit(
                  "signal",
                  id,
                  JSON.stringify({ sdp: connections[id].localDescription })
                );
              })
              .catch((e) => {
                console.log("Error setting local description:", e);
              });
          });
        }
      };
    });
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localvideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {
        console.log(e);
      }
    }
  };

  let getDisplayMediaSuccess = (stream) => {
    console.log("HERE");
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localvideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localvideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localvideoRef.current.srcObject = window.localStream;

          getUserMedia();
        })
    );
  };

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);
    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp) {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => {
                      console.log("Error setting local description:", e);
                    });
                })
                .catch((e) => {
                  console.log("Error creating answer:", e);
                });
            }
          });
      } else if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => {
            console.log("Error adding ice candidate:", e);
          });
      }
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });
    socketRef.current.on("signal", gotMessageFromServer);
    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href, username);
      socketIdRef.current = socketRef.current.id;
      socketRef.current.on("chat-message", addMessage);
      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });
      socketRef.current.on("user-joined", (id, clients, userNames) => {
        const name = userNames[id] || "Guest";
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections
          );
          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate !== null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({
                  ice: event.candidate,
                })
              );
            }
          };

          connections[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId
            );

            if (videoExists) {
              setVideos((videos) => {
                const updatevideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? {
                        ...video,
                        stream: event.stream,
                      }
                    : video
                );
                videoRef.current = updatevideos;
                return updatevideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                username:
                  userNames[socketListId] || `User-${socketListId.slice(0, 4)}`,
                autoPlay: true,
                playsinline: true,
              };

              setVideos((videos) => {
                const updatevideos = [...videos, newVideo];
                videoRef.current = updatevideos;
                return updatevideos;
              });
            }
          };

          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) {
              continue;
            }
            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {
              console.log(e);
            }
            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({
                      sdp: connections[id2].localDescription,
                    })
                  );
                })
                .catch((e) => {
                  console.log("Error setting local description:", e);
                });
            });
          }
        }
      });
    });
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();

    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let handleVideo = () => {
    setVideo((prev) => {
      const newState = !prev;
      const stream = localvideoRef.current?.srcObject;
      if (stream) {
        stream.getVideoTracks().forEach((track) => (track.enabled = newState));
      }
      return newState;
    });
  };

  let handleAudio = () => {
    setAudio((prev) => {
      const newState = !prev;
      const stream = localvideoRef.current?.srcObject;
      if (stream) {
        stream.getAudioTracks().forEach((track) => (track.enabled = newState));
      }
      return newState;
    });
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);

  let handleScreen = () => {
    const shouldShare = !screen;

    setScreen(shouldShare);

    if (shouldShare) {
      getDisplayMedia();
    } else {
      try {
        let tracks = localvideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {
        console.log("Error stopping screen tracks:", e);
      }

      let blackSilence = (...args) =>
        new MediaStream([black(...args), silence()]);

      window.localStream = blackSilence();
      localvideoRef.current.srcObject = window.localStream;

      getUserMedia();
    }
  };

  let handleEndCall = () => {
    try {
      let tracks = localvideoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    console.log(username);
    if (isGuest) {
      navigate("/");
    } else {
      navigate("/home", { state: { username } });
    }
  };

  let handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let sendMessage = () => {
    console.log(socketRef.current);
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      connections = {};
      videoRef.current = [];
      setVideos([]);
      setMessages([]);
    };
  }, []);

  return (
    <div
      className="container-fluid bg-dark  min-vh-100 d-flex flex-column"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 ">
        <h5 className="mb-0 fs-2 fw-bold text-white">Meeting Room</h5>
        <span className="badge bg-dark">{username || "Guest"}</span>
      </div>

      <div className="row flex-grow-1 overflow-auto p-3 g-3">
        <div className="col-md-6 col-lg-4">
          <div className="position-relative bg-black rounded shadow">
            <video
              ref={localvideoRef}
              className="w-100 rounded"
              autoPlay
              muted
            ></video>
            <div className="position-absolute bottom-0 start-0 p-2 bg-dark bg-opacity-50 w-100 text-white small">
              You ({username || "Guest"})
            </div>
          </div>
        </div>

        {videos.map((video) => (
          <div className="col-md-6 col-lg-4" key={video.socketId}>
            <div className="position-relative bg-black rounded shadow">
              <video
                data-socket={video.socketId}
                ref={(ref) => {
                  if (ref && video.stream) {
                    ref.srcObject = video.stream;
                  }
                }}
                className="w-100 rounded"
                autoPlay
              ></video>
              <div className="position-absolute bottom-0 start-0 p-2 bg-dark bg-opacity-50 w-100 text-white small">
                {video.username || `User-${video.socketId.slice(0, 4)}`}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center align-items-center gap-3 py-3 border-top border-secondary">
        <button className="btn btn-outline-light" onClick={handleAudio}>
          <i
            className={`fas ${audio ? "fa-microphone" : "fa-microphone-slash"}`}
          ></i>
        </button>
        <button className="btn btn-outline-light" onClick={handleVideo}>
          <i className={`fas ${video ? "fa-video" : "fa-video-slash"}`}></i>
        </button>
        <button className="btn btn-outline-light" onClick={handleScreen}>
          <i className="fas fa-desktop"></i>
        </button>
        <button
          className="btn btn-outline-light position-relative"
          onClick={() => {
            setChatOpen(!chatOpen);
            setNewMessages(0);
          }}
        >
          <i className="fas fa-comment-dots"></i>
        </button>

        <button className="btn btn-danger" onClick={handleEndCall}>
          <i className="fas fa-phone-slash"></i> Leave
        </button>
      </div>

      <div
        className="position-fixed top-0 end-0 h-100 bg-light shadow"
        style={{
          width: "300px",
          transform: chatOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 1050,
        }}
      >
        <div className="d-flex justify-content-between align-items-center bg-primary p-3 text-white">
          <span className="fw-bold fs-5">💬 Chat</span>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setChatOpen(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div
          className="flex-grow-1 overflow-auto p-3"
          style={{ height: "calc(100% - 120px)" }}
        >
          {messages.length === 0 ? (
            <div className="text-muted text-center mt-5">No messages yet</div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx}>
                <p className="fw-bold">{msg.sender}</p>
                <p>{msg.data}</p>
              </div>
            ))
          )}
        </div>

        <div className="p-2 border-top bg-white d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Type message..."
            value={message}
            onChange={handleMessage}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="btn btn-primary" onClick={sendMessage}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
