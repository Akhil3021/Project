import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./MyOrder.css";
import { toast } from "react-toastify";
function MyOrders() {
  const token = Cookies.get("token");
  const userId = parseInt(Cookies.get("user_id"));
  console.log("userid", userId);

  const [data, setData] = useState([]);

  // Fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5083/api/Orders/userOrder?userId=${userId}`, // Sending the userId as a query param
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the response contains the correct data structure
      console.log("Response data:", response.data);

      if (response.data.orders && Array.isArray(response.data.orders)) {
        setData(response.data.orders); // Set the orders directly from the response
      } else {
        console.error("Orders data is not in expected format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch orders when the component mounts or when the token changes
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Ensure that the data has been updated and check for changes in the data
  useEffect(() => {
    console.log("Updated data:", data); // Log the updated data
  }, [data]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {Array.isArray(data) && data.length > 0 ? (
          data.map((order, index) => (
            <div className="my-orders-order" key={index}>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(order.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Shipping Address:</strong> {order.address}
              </p>

              <p>
                <strong>Items:</strong>
                {Array.isArray(order.items) && order.items.length > 0
                  ? order.items.map((orderItem, index) => (
                      <span key={index}>
                        {orderItem.itemName} x {orderItem.quantity} (₹
                        {orderItem.price})
                        {index === order.items.length - 1 ? "" : ", "}
                      </span>
                    ))
                  : "No items"}
              </p>

              <p>
                <strong>Total Amount:</strong> ₹{order.amount}.00
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {order.payment ? <b>{order.status}</b> : <b>Cancelled</b>}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                {order.payment ? "Paid" : "Cancelled"}
              </p>

              <button
                className="btn bc-#ffe1e1"
                onClick={() => {
                  window.location.reload();
                }}
                disabled={!order.payment}
              >
                Track Order
              </button>
            </div>
          ))
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
