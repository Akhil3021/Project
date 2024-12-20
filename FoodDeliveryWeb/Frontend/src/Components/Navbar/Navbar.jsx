import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { UserContext } from "../../Context/UserContext";
import "./Navbar.css"; // New CSS file for custom styling

function Navbar() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const id = Cookies.get("resId");
  const token = Cookies.get("token");

  // Ensure user and role are loaded before accessing them
  const role = user?.role;

  // Logout function
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("resId"); // Remove other relevant cookies if necessary
    navigate("/login");
    window.location.reload(); // Redirect to login page after logout
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            MyApp
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {role === "Seller" ? (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to="/addRestaurant"
                    >
                      Add
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to="/restaurantInfo/id"
                    >
                      Info
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to={`/addItem/:${id}`}
                    >
                      Add Item
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to={`/restaurantItem/:${id}`}
                    >
                      Items
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to={`/restaurantOrders/:${id}`}
                    >
                      Orders
                    </Link>
                  </li>
                </>
              ) : role === "Customer" ? (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to={`/items`}
                    >
                      Items
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to={`/restaurants`}
                    >
                      Restaurants
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to={`/myOrders`}
                    >
                      Orders
                    </Link>
                  </li>{" "}
                  <li className="nav-item">
                    <Link className="nav-link" to={"/cart"}>
                      Cart
                    </Link>
                  </li>
                  {/* Updated this part to use Link for About page */}
                  <li className="nav-item">
                    <Link className="nav-link" to={"/about"}>
                      About
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/contact"}>
                      Contact
                    </Link>
                  </li>
                </>
              ) : null}
            </ul>

            <ul className="navbar-nav mb-2 mb-lg-0">
              {token ? (
                <>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      More
                    </a>
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <Link className="dropdown-item" to="/userProfile">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/settings">
                          Settings
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login" role="button">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register" role="button">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
