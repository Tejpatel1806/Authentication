import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

const Dashboard = () => {
  const [message, setMessage] = useState();
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8000/dashboard")
      .then((res) => {
        console.log(res);
        if (res.data.valid) {
          setMessage(res.data.message);
        } else {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <h2>Dashboard {message}</h2>
    </>
  );
};
export default Dashboard;
