import React, { useState, useEffect } from "react";
import axios from "axios";
import "./User.css";
import { toast } from "react-toastify";

function User() {
  const [users, setUsers] = useState([]);

  // Fetch user data
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5083/api/Users/listUser"
      );

      if (response.data) {
        setUsers(response.data); // Update state with response data
        console.log(response.data); // Log the data for debugging
      } else {
        toast.error("No users found.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users.");
    }
  };

  // Delete user
  const deleteUser = async (accountId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5083/api/Account/deleteUser/${accountId}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        // Refresh user list or take any other action needed
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error deleting user and account");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="list add flex-col">
        <p>All User List</p>
        <div className="list-table">
          <div className="list-table-format title">
            <b>Name</b>
            <b>Email</b>
            <b>Role</b>
            <b>Action</b>
          </div>
          {users.map((user, index) => {
            return (
              <div className="list-table-format" key={index}>
                <p>
                  {user.firstname} {user.lastname}
                </p>
                <p>{user.email}</p>
                <p>{user.roleName}</p>
                <p
                  onClick={() => deleteUser(user.accountId)}
                  className="cursor"
                >
                  x
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default User;
