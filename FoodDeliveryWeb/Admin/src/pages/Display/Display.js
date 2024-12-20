import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Display.css";
import { toast } from "react-toastify";
function Display() {
  const [list, setlist] = useState([]);
  const fetchList = async () => {
    const response = await axios.get(
      "http://localhost:5083/api/Item/displayItem"
    );
    console.log(response.data);
    if (response) {
      setlist(response.data);
    } else {
      toast.error("Error");
    }
  };
  const removeFood = async (foodId) => {
    const response = await axios.delete(
      `http://localhost:5083/api/Item/removeItem/${foodId}`
    );
    await fetchList();

    if (response.data.message) {
      toast.success(response.data.message); // Display the success message
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <div className="list add flex-col">
        <p>All Food List</p>
        <div className="list-table">
          <div className="list-table-format title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
          </div>
          {list.map((item, index) => {
            return (
              <div className="list-table-format" key={index}>
                <img src={`http://localhost:5083/uploads/${item.image}`} />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>₹ {item.price}</p>
                <p onClick={() => removeFood(item.id)} className="cursor">
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

export default Display;
