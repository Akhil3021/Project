import React, { useContext, useEffect } from "react";
import { UserContext } from "../../Context/UserContext";
import Dashboard from "../Dashboard/Dashboard";
import { StoreContext } from "../../Context/StoreContext";
import "./Home.css";
import foodsImage from "../../assets/foods.jpg"; // Adjust the path to match your project structure

function Home() {
  const { user, loading } = useContext(UserContext);
  const { fetchRestaurant } = useContext(StoreContext);

  // Fetch data
  useEffect(() => {
    fetchRestaurant();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in.</div>;
  }

  if (user.role === "Seller") {
    return <Dashboard />;
  }

  return (
    <div className="home-container">
      {/* Add an image banner */}
      <div className="banner">
        <img src={foodsImage} alt="Delicious Foods" className="banner-image" />
        <h1 className="banner-text">Welcome to Food Paradise!</h1>
      </div>

      {/* User information */}
      <div className="user-info">
        <h2>Welcome, {user.firstName}!</h2>
        <p>
          Your email: <span className="highlight">{user.email}</span>
        </p>
        <p>
          Your role: <span className="highlight">{user.role}</span>
        </p>
        <p>
          Your ID: <span className="highlight">{user.userId}</span>
        </p>
      </div>
    </div>
  );
}

export default Home;
