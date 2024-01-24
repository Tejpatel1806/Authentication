import axios from "axios";
import { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    axios
      .get("http://localhost:8000/dashboard")
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <h1>This is Dashboard Page</h1>
    </>
  );
};
export default Dashboard;
