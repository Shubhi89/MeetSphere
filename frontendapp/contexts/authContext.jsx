import { createContext, useContext, useState } from "react";
import axios from "axios";
import httpStatus from "http-status";
import { useNavigate } from "react-router-dom";
import servers from "../environment";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: `${servers.prod}/users`,
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const router = useNavigate();

  const handleSignUp = async (name, username, password) => {
    try {
      let request = await client.post("/signup", {
        name: name,
        username: username,
        password: password,
      });
      if (request.status === httpStatus.CREATED) {
        return request.data.message;
      }
    } catch (e) {
      throw e;
    }
  };

  const handleSignIn = async (username, password) => {
    try {
      let request = await client.post("/signin", {
        username: username,
        password: password,
      });
      if (request.status === httpStatus.OK) {
        localStorage.setItem("token", request.data.token);
        setUserData(request.data.user);
      }
    } catch (e) {
      throw e;
    }
  };

  const getHistoryOfUser = async () => {
    try {
      let request = await client.get("/get_all_activity", {
        params: {
          token: localStorage.getItem("token"),
        },
      });
      return request.data;
    } catch (e) {
      console.error("Error fetching user history:", e);
      throw e;
    }
  };

  const addToUserHistory = async (meetingCode) => {
    try {
      let request = await client.post("/add_to_activity", {
        token: localStorage.getItem("token"),
        meeting_code: meetingCode,
      });
      if (request.status === httpStatus.CREATED) {
        console.log("Meeting added to history");
      }
    } catch (e) {
      console.error("Error adding meeting to history:", e);
      throw e;
    }
  };

  const data = {
    userData,
    setUserData,
    handleSignUp,
    handleSignIn,
    getHistoryOfUser,
    addToUserHistory,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
