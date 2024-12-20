import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./RestaurantOrders.css";

const RestaurantOrders = () => {
  const restaurantId = parseInt(Cookies.get("resId"));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5083/api/Orders/RestaurantOrders?restaurantId=${restaurantId}`
        );

        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          setError("No orders found for this restaurant.");
        }
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [restaurantId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="restaurant-orders">
      <h2>Orders for Restaurant ID: {restaurantId}</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-item-details">
                <h3 className="order-item-name">Order ID: {order.id}</h3>
                <p className="order-item-address">
                  <strong>Delivery Address:</strong> {order.address}
                </p>
                <p>
                  <strong>Order Status:</strong> {order.status}
                </p>
              </div>
              <div className="order-item-meta">
                <p>
                  <strong>Date:</strong> {new Date(order.date).toLocaleString()}
                </p>
                <p>
                  <strong>Total Amount:</strong> ${order.amount.toFixed(2)}
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  {order.payment ? "Paid" : "Pending"}
                </p>
              </div>
              <div className="order-item-items">
                <h4>Items:</h4>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.itemId}>
                      {item.name} - {item.quantity} x ${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;
