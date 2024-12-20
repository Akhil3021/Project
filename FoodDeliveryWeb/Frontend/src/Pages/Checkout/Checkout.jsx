import React from "react";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext.jsx";
import Cookies from "js-cookie";
import "./Checkout.css";

function Checkout() {
  const token = Cookies.get("token");
  const UserId = parseInt(Cookies.get("user_id"));

  const { getTotalCart, cartItems, item } = useContext(StoreContext);
  const [data, setData] = useState({
    email: "",
    aptName: "",
    city: "",
    street: "",
    contact: "",
    zip: "",
  });
  const placeOrder = async (e) => {
    e.preventDefault();

    console.log("Placing order..."); // Debugging: Confirm the function is triggered

    let orderItems = [];
    item.map((items) => {
      if (cartItems[items.id] > 0) {
        let itemInfo = {
          ItemId: items.id,
          Quantity: cartItems[items.id],
          Price: items.price,
        };
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      userId: UserId,
      address: {
        email: data.email,
        aptName: data.aptName,
        city: data.city,
        street: data.street,
        contact: data.contact,
        zip: data.zip,
      },
      items: orderItems,
      amount: getTotalCart() + 20,
    };

    try {
      console.log("Sending request to backend with order data:", orderData); // Debug the data being sent
      let response = await axios.post(
        "http://localhost:5083/api/Orders/placeOrder",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Response:", response); // Debugging: check full response

      if (response.data.success) {
        const { sessionUrl } = response.data;
        console.log("Session URL:", sessionUrl); // Ensure the session URL is being returned
        if (sessionUrl) {
          window.location.replace(sessionUrl);
        } else {
          alert("Session URL is undefined");
        }
      } else {
        alert(response.data.message || "Error placing order");
      }
    } catch (error) {
      console.error("Error in Axios request:", error); // Debugging: Check error in the request
      alert("An error occurred while placing the order.");
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCart() === 0) {
      navigate("/cart");
    }
  }, [token]);
  return (
    <>
      <div className="container">
        <form className="place-order" onSubmit={placeOrder}>
          <div className="place-order-left">
            <p className="title">Deliver info</p>
            {/* <div className="multi-fields">
              <input type="text" placeholder="first" />
              <input type="text" placeholder="last" />
            </div> */}
            <input
              required
              type="email"
              placeholder="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <input
              required
              type="text"
              placeholder="Apartment/Society"
              value={data.aptName}
              onChange={(e) => setData({ ...data, aptName: e.target.value })}
            />
            <div className="multi-fields">
              <input
                required
                type="text"
                placeholder="street"
                value={data.street}
                onChange={(e) => setData({ ...data, street: e.target.value })}
              />
              <input
                required
                type="text"
                placeholder="city"
                value={data.city}
                onChange={(e) => setData({ ...data, city: e.target.value })}
              />
            </div>
            <div className="multi-fields">
              <input
                required
                type="text"
                placeholder="zipcode"
                value={data.zip}
                onChange={(e) => setData({ ...data, zip: e.target.value })}
              />
              {/* <input type="text" placeholder="country" /> */}
            </div>
            <input
              required
              type="text"
              placeholder="contact"
              value={data.contact}
              onChange={(e) => setData({ ...data, contact: e.target.value })}
            />
          </div>
          <div className="place-oreder-right">
            <div className="cart-total">
              <h2>Cart Total</h2>
              <div>
                <div className="cart-total-details">
                  <p>Subtotal</p>
                  <p>{getTotalCart()}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <p>Delivery Fees</p>
                  <p>20</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <p>Total</p>
                  <p>{getTotalCart() + 20}</p>
                </div>
              </div>
              <button
                className="btn"
                style={{ background: "orange" }}
                type="submit"
              >
                Payment
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Checkout;
