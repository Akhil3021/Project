import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Navbar from "./Components/Navbar/Navbar";
import AddRestaurant from "./Pages/AddRestaurant/AddRestaurant";
import Home from "./Pages/Home/Home";
import RestaurantInfo from "./Pages/RestaurantInfo/RestaurantInfo";
import AddItem from "./Pages/AddItem/AddItem";
import RestaurantItem from "./Pages/Restaurant_Item/Restaurant_Item";
import UpdateItem from "./Pages/UpdateItem/UpdateItem";
import UpdateRestaurant from "./Pages/UpdateRestaurant/UpdateRestaurant";
import DisplayItem from "./Pages/DisplayItems/DisplayItems";
import DisplayRestaurant from "./Pages/DisplayRestaurant/DisplayRestaurant";
import RestaurantDetail from "./Pages/RestaurantDetail/RestaurantDetail";
import UserProfile from "./Pages/UserProfile/UserProfile";
import Cart from "./Pages/Cart/Cart";
import Checkout from "./Pages/Checkout/Checkout";
import Verify from "./Pages/Verify/Verify";
import MyOrder from "./Pages/MyOrder/MyOrder";
import RestaurantOrders from "./Pages/RestaurantOrders/RestaurantOrders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./Pages/Dashboard/Dashboard";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Navbar />

        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/" element={<Home />} />
          <Route exact path="/dashboard" element={<Dashboard />} />

          <Route exact path="/userProfile" element={<UserProfile />} />

          <Route exact path="/addRestaurant" element={<AddRestaurant />} />
          <Route exact path="/restaurantInfo/id" element={<RestaurantInfo />} />
          <Route exact path="/addItem/:id" element={<AddItem />} />
          <Route
            exact
            path="/restaurantItem/:id"
            element={<RestaurantItem />}
          />
          <Route exact path="UpdateItem/:id" element={<UpdateItem />} />
          <Route
            exact
            path="UpdateRestaurant/:id"
            element={<UpdateRestaurant />}
          />
          <Route exact path="/items" element={<DisplayItem />} />
          <Route exact path="/restaurants" element={<DisplayRestaurant />} />
          <Route
            exact
            path="/restaurantDetail/:id"
            element={<RestaurantDetail />}
          />

          <Route exact path="/cart" element={<Cart />} />
          <Route exact path="/checkout" element={<Checkout />} />
          <Route exact path="/verify" element={<Verify />} />
          <Route exact path="/myOrders" element={<MyOrder />} />
          <Route
            exact
            path="/restaurantOrders/:id"
            element={<RestaurantOrders />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
