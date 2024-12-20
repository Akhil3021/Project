import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { StoreContext } from "../../Context/StoreContext";
import Cookies from "js-cookie";
import "./RestaurantInfo.css";

function RestaurantInfo() {
  const { user } = useContext(UserContext);
  const { removeRestaurant } = useContext(StoreContext);
  const [sid, setsid] = useState(null);
  const [restaurant, setRestaurant] = useState(null); // Changed to null to handle single restaurant
  let id;

  useEffect(() => {
    if (user) {
      setsid(user.userId);
    }
  }, [user]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (sid) {
        try {
          const response = await axios.get(
            `http://localhost:5083/api/Restaurant/restaurantIfno/${sid}`
          );
          if (response.status === 200) {
            setRestaurant(response.data); // Set the restaurant directly
            // console.log(response.data);
            // console.log(response.data.id);
            Cookies.set("resId", response.data.id);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchRestaurant();
  }, [sid]);

  return (
    <>
      <h1>Restaurant Info</h1>
      {restaurant && (
        <>
          <div
            className="container ml-3 restaurant-info"
            style={{ maxWidth: "90%" }}
          >
            <img
              src={`http://localhost:5083/uploads/${restaurant.image}`}
              alt="Restaurant"
              style={{ maxWidth: "70%" }}
            />

            <br />

            <div className="restaurant-address">
              <p>
                <span className="text-dark">Name:</span> {restaurant.name}
              </p>
              <p>
                <span className="text-dark">Tags:</span> {restaurant.tags}
              </p>
              <p>
                <span className="text-dark">AptName:</span>{" "}
                {restaurant.apartment}
              </p>
              <p>
                <span className="text-dark">Street:</span> {restaurant.street}
              </p>
              <p>
                <span className="text-dark">Locality:</span>{" "}
                {restaurant.locality}
              </p>
              <p>
                <span className="text-dark">Zip:</span> {restaurant.zipCode}
              </p>
            </div>
            <div className="restaurant-contact">
              <p>{restaurant.contact}</p>
            </div>
            <Link to={`/updateRestaurant/${restaurant.id}`}>
              <button
                className="btn btn-success"
                style={{ textAlign: "center" }}
              >
                Update
              </button>
            </Link>

            <button
              className="btn btn-danger"
              style={{ textAlign: "center" }}
              onClick={() => removeRestaurant(restaurant.id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default RestaurantInfo;
