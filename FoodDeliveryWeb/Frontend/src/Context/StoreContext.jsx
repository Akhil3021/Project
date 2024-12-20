import React, { useState, useEffect, useContext } from "react";
import { createContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";

export const StoreContext = createContext(null);

export function StoreContextProvider({ children }) {
  const [list, setlist] = useState([]);
  const [item, setitem] = useState([]);
  const [restaurants, setrestaurant] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [sellerRestaurant, setsellerRestaurant] = useState(null);
  const [sid, setsid] = useState(null);

  const token = Cookies.get("token");
  const UserId = parseInt(Cookies.get("user_id"));

  const RestaurantId = Cookies.get("resId");
  const { user } = useContext(UserContext);

  // Display restaurant items
  const RestarurantList = async () => {
    const response = await axios.get(
      `http://localhost:5083/api/Item/resItem/${RestaurantId}`
    );
    console.log(response.data);
    if (response) {
      setlist(response.data);
    } else {
      console.log("Error in rendering restaurant Items");
    }
  };

  // to delete an item from a restaurant
  const removeFood = async (foodId) => {
    // console.log(foodId);
    const response = await axios.delete(
      `http://localhost:5083/api/Item/removeItem/${foodId}`
    );
    await RestarurantList();
    if (response.status == 200) {
      console.log("Item Deleted");
    } else {
      console.log("Error in Deleting");
    }
  };

  const removeRestaurant = async (foodId) => {
    // console.log(foodId);
    const response = await axios.delete(
      `http://localhost:5083/api/Restaurant/deleteRestaurant/${RestaurantId}`
    );

    if (response.status == 200) {
      console.log("Restaurant Deleted");
      console.log(response.data);
    } else {
      console.log("Error in Deleting");
    }
  };

  // Display All Items to customer

  const DisplayItem = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5083/api/Item/displayItem"
      );
      if (response.status == 200) {
        console.log(response.data);
        setitem(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Display All Restaurant to customer
  const DisplayRestaurant = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5083/api/Restaurant/restaurants"
      );
      if (response.status == 200) {
        console.log(response.data);
        setrestaurant(response.data.restaurant);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // ----------------------------------------

  useEffect(() => {
    if (user) {
      setsid(user.userId);
    }
  }, [user]);
  const fetchRestaurant = async () => {
    if (sid) {
      try {
        const response = await axios.get(
          `http://localhost:5083/api/Restaurant/restaurantIfno/${sid}`
        );
        if (response.status === 200) {
          setsellerRestaurant(response.data); // Set the restaurant directly
          // console.log(response.data);
          // console.log(response.data.id);
          Cookies.set("resId", response.data.id);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  // ----------------------Cart---------------------------

  // Example function to decode and extract UserId

  const addToCart = async (itemId) => {
    if (!UserId) {
      console.error("UserId not found or invalid");
      return;
    }
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token && UserId) {
      try {
        await axios.post(
          `http://localhost:5083/api/Users/add`,
          { UserId: UserId, ItemId: itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // toast.success("Item Carted");
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  //remove items from cart
  const removeFromCart = async (itemId) => {
    // const token = Cookie.get("token");
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
    if (token) {
      try {
        await axios.post(
          "http://localhost:5083/api/Users/remove",
          { UserId: UserId, ItemId: itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  //display cart items
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:5083/api/Users/displayCart",
        { UserId: UserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response.data);

      setCartItems(response.data);
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  useEffect(() => {
    // console.log("Cart items:", cartItems);
  }, [cartItems]);

  const getTotalCart = () => {
    let totalAmount = 0;

    // Check if items are loaded
    if (!item || item.length === 0) {
      console.log("Items array is empty or not loaded.");
      return 0;
    }

    for (const itemId in cartItems) {
      const itemQuantity = cartItems[itemId];

      if (itemQuantity > 0) {
        // Ensure type match between itemId and item.id
        const itemInfo = item.find(
          (product) => product.id === parseInt(itemId)
        );
        console.log("Item info for itemId", itemId, itemInfo);

        if (itemInfo) {
          totalAmount += itemInfo.price * itemQuantity;
          console.log("Running total:", totalAmount);
        } else {
          console.log(`No matching item found for itemId: ${itemId}`);
        }
      }
    }

    console.log("Final total amount:", totalAmount);
    return totalAmount;
  };

  const contextValue = {
    RestarurantList,
    list,
    removeFood,
    DisplayItem,
    item,
    DisplayRestaurant,
    restaurants,
    removeRestaurant,
    fetchRestaurant,
    sellerRestaurant,
    addToCart,
    removeFromCart,
    loadCartData,
    getTotalCart,
    cartItems,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}
