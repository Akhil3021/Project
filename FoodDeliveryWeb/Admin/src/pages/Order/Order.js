import React, { useState, useEffect } from "react";
import "./Order.css";
import axios from "axios";
import { toast } from "react-toastify";

function Order() {
  const [orders, setOrders] = useState([]);

  // Fetch all orders grouped by users
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5083/api/Orders/DisplayOrders"
      );

      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
        console.log(response.data); // To check the fetched data
      } else {
        toast.error("Invalid data format received");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching orders");
    }
  };

  // Update order status
  const status = async (e, orderId) => {
    try {
      const response = await axios.post(
        "http://localhost:5083/api/Orders/status",
        {
          orderId,
          status: e.target.value,
        }
      );
      if (response.data.success) {
        await fetchAllOrders(); // Re-fetch orders after status update
      } else {
        toast.error("Error updating status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <>
      <div className="order add">
        <h3>All Orders</h3>
        <div className="order-list">
          {orders.map((userOrders, index) => {
            return (
              <div className="user-orders" key={index}>
                <div className="order-items">
                  {userOrders.orders.map((order, idx) => {
                    return (
                      <div className="order-item" key={idx}>
                        <div>
                          <p className="order-item-food">
                            {order.items.length > 0 ? (
                              order.items.map((item, index) => {
                                if (index === order.items.length - 1) {
                                  return item.itemName + " x" + item.quantity;
                                } else {
                                  return (
                                    item.itemName + " x" + item.quantity + ","
                                  );
                                }
                              })
                            ) : (
                              <span>No items in this order</span>
                            )}
                          </p>
                          <p className="order-item-address">{order.address}</p>{" "}
                          {/* Handle address as string */}
                        </div>
                        <p>Items: {order.items.length}</p>
                        <p>₹ {order.amount}</p>
                        <select
                          onChange={(e) => {
                            status(e, order.id);
                          }}
                          value={order.status}
                        >
                          <option value="Food Processing">
                            Food Processing
                          </option>
                          <option value="Out For Delivery">
                            Out For Delivery
                          </option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        <div className="user-name-box">
                          <p>{userOrders.userName}</p>{" "}
                          {/* Display user's name in a box below the amount */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Order;
