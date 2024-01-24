import Registration from "./components/Registration";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login></Login>} />
          <Route path="/dashboard" element={<Dashboard></Dashboard>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
