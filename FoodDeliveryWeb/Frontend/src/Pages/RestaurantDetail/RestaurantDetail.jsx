import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { StoreContext } from "../../Context/StoreContext";
import Navbar from "../../Components/Navbar/Navbar"; // Ensure Navbar is correctly imported
import "./RestaurantDetail.css"; // Import the new CSS file

function RestaurantDetail() {
  const param = useParams();
  const { user } = useContext(UserContext);
  const [sid, setsid] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [list, setlist] = useState([]);
  const { addToCart } = useContext(StoreContext);

  const RestarurantList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5083/api/Item/resItem/${param.id}`
      );
      if (response) {
        setlist(response.data);
      }
    } catch (error) {
      console.error("Error in rendering restaurant items:", error);
    }
  };

  useEffect(() => {
    if (user) {
      setsid(user.userId);
    }
    RestarurantList();
  }, [user]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (sid) {
        try {
          const response = await axios.get(
            `http://localhost:5083/api/Restaurant/restaurant/${param.id}`
          );
          if (response.status === 200) {
            setRestaurant(response.data);
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
      <div className="restaurant-details">
        <h1>Restaurant Info</h1>

        {restaurant ? (
          <div className="restaurant-info">
            {restaurant.image && (
              <img
                src={`http://localhost:5083/uploads/${restaurant.image}`}
                alt="Restaurant"
              />
            )}
            {restaurant.name && (
              <div className="restaurant-name">
                <p>{restaurant.name}</p>
              </div>
            )}
            {restaurant.email && (
              <div className="restaurant-email">
                <p>{restaurant.email}</p>
              </div>
            )}
            {restaurant.tags && (
              <div className="restaurant-tags">
                <p>{restaurant.tags}</p>
              </div>
            )}
            {restaurant.apartment && (
              <div className="restaurant-address">
                <p>
                  <span className="text-dark">AptName:</span>{" "}
                  {restaurant.apartment}
                </p>
                {restaurant.street && (
                  <p>
                    <span className="text-dark">Street:</span>{" "}
                    {restaurant.street}
                  </p>
                )}
                {restaurant.locality && (
                  <p>
                    <span className="text-dark">Locality:</span>{" "}
                    {restaurant.locality}
                  </p>
                )}
                {restaurant.zipCode && (
                  <p>
                    <span className="text-dark">Zip:</span> {restaurant.zipCode}
                  </p>
                )}
              </div>
            )}
            {restaurant.contact && (
              <div className="restaurant-contact">
                <p>{restaurant.contact}</p>
              </div>
            )}
          </div>
        ) : (
          <p>Loading restaurant details...</p>
        )}

        <h1 className="mt-4">Items</h1>
        <div className="container">
          {list.map((item) => (
            <div className="card" key={item.id}>
              <img
                src={`http://localhost:5083/uploads/${item.image}`}
                className="card-img-top"
                alt={item.name}
              />
              <div className="card-body">
                <h5 className="card-title">Name: {item.name}</h5>
                <p className="card-text">{item.desc}</p>
                <p className="card-text">Category: {item.category}</p>
                <p className="card-number">Price: {item.price}</p>
                <div className="button-group">
                  <button
                    className="btn btn-success"
                    onClick={() => addToCart(item.id)}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default RestaurantDetail;
