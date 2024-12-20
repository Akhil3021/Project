import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { StoreContext } from "../../Context/StoreContext";
import "./DisplayRestaurant.css"; // Import the new CSS file
import Searchbar from "../../Components/Searchbar/Searchbar";

function DisplayRestaurant() {
  const { user } = useContext(UserContext);
  const [sid, setsid] = useState(null);
  const navigate = useNavigate();
  const { DisplayRestaurant, restaurants } = useContext(StoreContext);

  useEffect(() => {
    DisplayRestaurant();
    if (user) {
      setsid(user.userId);
    }
  }, [user]);
  const [query, setquery] = useState("");
  const fileterItems = restaurants.filter((i) =>
    i.name.toLowerCase().includes(query)
  );
  console.log(fileterItems);
  return (
    <>
      <h1 className="mt-4">Restaurants</h1>
      <Searchbar setquery={setquery} />
      <div className="container">
        {fileterItems.map((restaurant) => (
          <div className="card" key={restaurant.id}>
            <img
              src={`http://localhost:5083/uploads/${restaurant.image}`}
              className="card-img-top"
              alt={restaurant.name}
            />
            <div className="card-body">
              <h5 className="card-title">Name: {restaurant.name}</h5>
              <p className="card-text">Tags: {restaurant.tags}</p>
              <p className="card-text">Contact: {restaurant.contact}</p>
              <p className="card-number">
                Address: {restaurant.apartment}, {restaurant.street},{" "}
                {restaurant.locality}
              </p>
              <div className="button-group">
                <button
                  className="btn btn-danger"
                  onClick={() => navigate(`/restaurantDetail/${restaurant.id}`)}
                >
                  Info
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default DisplayRestaurant;
