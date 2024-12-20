import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import "./DisplayItems.css"; // Import the new CSS file
import Searchbar from "../../Components/Searchbar/Searchbar";
function DisplayItem() {
  const { DisplayItem, item, addToCart } = useContext(StoreContext);

  useEffect(() => {
    DisplayItem();
  }, []);
  const [query, setquery] = useState("");
  const fileterItems = item.filter((i) => i.name.toLowerCase().includes(query));
  console.log(fileterItems);
  return (
    <>
      <h1 className="mt-4">Items</h1>
      <Searchbar setquery={setquery} />
      <div className="container">
        {fileterItems.map((item) => (
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
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default DisplayItem;
