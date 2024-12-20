import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Restaurants() {
  const [restaurant, setrestaurant] = useState([]);
  const fetchRestaurant = async () => {
    const response = await axios.get(
      "http://localhost:5083/api/Restaurant/restaurants"
    );
    if (response.data.success) {
      setrestaurant(response.data.restaurant);
      console.log(response.data.restaurant);
    }
  };

  const removeRestaurant = async (id) => {
    // console.log(foodId);
    const response = await axios.delete(
      `http://localhost:5083/api/Restaurant/deleteRestaurant/${id}`
    );
    await fetchRestaurant();
    if (response.data) {
      toast.success(response.data);
    } else {
      toast.error("Error");
    }
  };
  useEffect(() => {
    fetchRestaurant();
  }, []);

  return (
    <>
      <div className="list add flex-col">
        <p>All Food List</p>
        <div className="list-table">
          <div className="list-table-format title">
            <b>Image</b>
            <b>Name</b>
            <b>Tags</b>
            <b>Contact</b>
            <b>Action</b>
          </div>
          {restaurant.map((res, index) => {
            return (
              <div className="list-table-format" key={index}>
                <img src={`http://localhost:5083/uploads/${res.image}`} />
                <p>{res.name}</p>
                <p>{res.tags}</p>
                <p>₹ {res.contact}</p>
                <p onClick={() => removeRestaurant(res.id)} className="cursor">
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

export default Restaurants;
