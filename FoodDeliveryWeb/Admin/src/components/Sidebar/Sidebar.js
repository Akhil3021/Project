import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        {/* <NavLink to="/add" className="sidebar-option">
          <p>Add items</p>
        </NavLink> */}
        <NavLink to="/display" className="sidebar-option">
          <p>List items</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <p>Order items</p>
        </NavLink>
        <NavLink to="/restaurants" className="sidebar-option">
          <p>Restaurants</p>
        </NavLink>
        <NavLink to="/users" className="sidebar-option">
          <p>Users</p>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
