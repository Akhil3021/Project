import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function UserProfile() {
  const navigate = useNavigate();
  const id = Cookies.get("user_id");
  const [data, setdata] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  // Fetch user profile data
  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5083/api/Account/profile/${id}`
      );
      if (response.status === 200) {
        setdata(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  // Update user profile data
  const UpdateUserProfile = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      const response = await axios.put(
        `http://localhost:5083/api/Account/update-profile`,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`, // Add token if needed
          },
        }
      );
      if (response.status === 200) {
        // alert("Profile updated successfully.");
        toast.success("Profile Updated");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      // alert("Error updating profile.");
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  return (
    <>
      <div className="register-container">
        <div className="container d-flex flex-column justify-content-center align-items-center m-1 p-1 rounded-3 shadow-lg register">
          <h1>User Profile</h1>
          <form onSubmit={UpdateUserProfile}>
            <div className="txt-field mb-3">
              <label htmlFor="first-name">First Name</label>
              <input
                type="text"
                name="first_name"
                value={data.firstName}
                onChange={(e) =>
                  setdata({ ...data, firstName: e.target.value })
                }
              />
              <label htmlFor="last-name">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={data.lastName}
                onChange={(e) => setdata({ ...data, lastName: e.target.value })}
              />
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                value={data.email}
                onChange={(e) => setdata({ ...data, email: e.target.value })}
              />
              <label htmlFor="role">Role</label>
              <select
                value={data.role}
                onChange={(e) => setdata({ ...data, role: e.target.value })}
              >
                <option value="Customer">Customer</option>
                <option value="Seller">Seller</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary reg-btn">
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
