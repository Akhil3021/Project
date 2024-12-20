import React from "react";
import "./Register.css";
import { useState } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar";
import { toast } from "react-toastify";

function Register() {
  const [data, setdata] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "Customer",
    password: "",
    confirm_password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { first_name, last_name, email, password, confirm_password, role } =
      data;
    if (password !== confirm_password) {
      // alert("Password does not match");
      toast.error("Password doesn't match");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5083/api/Account/register",
        {
          firstname: first_name,
          lastname: last_name,
          email: email,
          password: password,
          role: role,
        }
      );
      if (response.status === 200) {
        // alert("Registered Successfully");
        toast.success("Registered");
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error");
      console.log(error.response.data);
    }
  };
  return (
    <>
      {/* <div className="container d-flex flex-column justify-content-center align-items-center register"> */}
      <div className="register-container">
        <div className="container d-flex flex-column justify-content-center align-items-center m-2 p-3  rounded-3 shadow-lg register">
          {/* <h1 className="text-center mb-4">Register</h1> */}
          <form onSubmit={handleSubmit}>
            <div className="txt-field mb-3">
              <label htmlFor="first-name">First Name</label>
              <br />
              <input
                type="text"
                name="first_name"
                value={data.first_name}
                onChange={(e) =>
                  setdata({ ...data, first_name: e.target.value })
                }
              />
              <br />
              <label htmlFor="last-name">Last Name</label> <br />
              <input
                type="text"
                name="last_name"
                value={data.last_name}
                onChange={(e) =>
                  setdata({ ...data, last_name: e.target.value })
                }
              />
              <br />
              <label htmlFor="email">Email</label> <br />
              <input
                type="text"
                name="email"
                value={data.email}
                onChange={(e) => setdata({ ...data, email: e.target.value })}
              />
              <br />
              <label htmlFor="role">Role</label> <br />
              <select
                onChange={(e) => setdata({ ...data, role: e.target.value })}
              >
                <option value="Customer">Customer</option>
                <option value="Seller">Seller</option>
              </select>
              <br />
              <label htmlFor="password">Password</label> <br />
              <input
                type="text"
                name="password"
                value={data.password}
                onChange={(e) => setdata({ ...data, password: e.target.value })}
              />
              <br />
              <label htmlFor="password">Confirm Password</label> <br />
              <input
                type="text"
                name="confirm_password"
                value={data.confirm_password}
                onChange={(e) =>
                  setdata({ ...data, confirm_password: e.target.value })
                }
              />
            </div>
            <button type="submit" className="btn btn-primary reg-btn">
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
