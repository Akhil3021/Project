import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import Display from "./pages/Display/Display";
import Order from "./pages/Order/Order";
import Add from "./pages/Add/Add";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Restaurants from "./pages/Restaurants/Restaurants";
import User from "./pages/Users/User";
// axios.defaults.baseURL = "http://localhost:8000";
// axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <ToastContainer />
      <Navbar></Navbar>
      <hr />
      <div className="app-content">
        <Sidebar></Sidebar>
        <Routes>
          <Route exact path="/add" element={<Add></Add>}></Route>
          <Route exact path="/display" element={<Display></Display>}></Route>
          <Route exact path="/orders" element={<Order></Order>}></Route>
          <Route
            exact
            path="/restaurants"
            element={<Restaurants></Restaurants>}
          ></Route>
          <Route exact path="/users" element={<User></User>}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
