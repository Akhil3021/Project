import React, { useState, useContext } from "react";
import "./Login.css";
import axios from "axios";
import Cookies from "js-cookie";
import { UserContext } from "../../Context/UserContext";
import { useNavigate, redirect } from "react-router-dom";
import { toast } from "react-toastify";
function Login() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [data, setdata] = useState({
    email: "",
    password: "",
  });

  const handleLoggin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5083/api/Account/login",
        {
          email: data.email,
          password: data.password,
        }
      );
      if (response.status === 200) {
        console.log(response.data.message);
        toast.success("Loggedin");
        Cookies.set("token", response.data.token);

        navigate("/");
        window.location.reload();
      }
      // console.log("User", user);

      // console.log(response.data.token);
    } catch (error) {
      console.error(error);
      toast.error("Error in login");
    }
  };

  return (
    <div className="shadow-lg  p-4 rounded login" id="c1">
      <h1 className="text-center mb-3">Login</h1>
      <form onSubmit={handleLoggin}>
        <div className="mb-3 txt_field">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            name="email"
            value={data.email}
            onChange={(e) => setdata({ ...data, email: e.target.value })}
          />
        </div>
        <div className="mb-3 txt_field">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password" // Change to 'password' for better security
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            value={data.password}
            onChange={(e) => setdata({ ...data, password: e.target.value })}
          />
        </div>
        <button type="submit" className="btn log-btn">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
