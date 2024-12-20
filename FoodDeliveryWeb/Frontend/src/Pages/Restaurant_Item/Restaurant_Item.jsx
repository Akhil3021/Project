import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import "../Restaurant_Item/Restaurant_Item.css";
import Searchbar from "../../Components/Searchbar/Searchbar";

function RestaurantItem() {
  const { RestarurantList, list, removeFood } = useContext(StoreContext);

  useEffect(() => {
    RestarurantList();
  }, []);
  const [query, setquery] = useState("");
  const fileterItems = list.filter((i) => i.name.toLowerCase().includes(query));
  console.log(fileterItems);
  return (
    <>
      <h1 className="mt-4">Items</h1>
      <Searchbar setquery={setquery} />
      <div className="container">
        {fileterItems.map((item) => {
          return (
            <div className="card " key={item.id}>
              <img
                src={`http://localhost:5083/uploads/${item.image}`}
                className="card-img-top"
                alt={item.name}
              />
              <div className="card-body">
                <h5 className="card-title">Name: {item.name}</h5>
                <p className="card-text">{item.desc}</p>
                <p className="card-text">Category : {item.category}</p>
                <p className="card-number">Price : {item.price}</p>
                <div className="button-group">
                  <button
                    className="btn btn-danger "
                    onClick={() => removeFood(item.id)}
                  >
                    Delete
                  </button>

                  <button className="btn btn-success">
                    <Link
                      to={`/updateItem/${item.id}`}
                      style={{
                        color: "white",
                        textDecoration: "None",
                      }}
                    >
                      Update
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default RestaurantItem;
