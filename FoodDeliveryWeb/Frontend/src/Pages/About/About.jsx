import React from "react";
import "./About.css"; // Import CSS for styling

function About() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Our Food Delivery Service</h1>
      </div>
      <div className="about-content">
        <p>
          Welcome to our food delivery service! We bring your favorite meals
          right to your doorstep, ensuring fast, reliable, and delicious
          delivery.
        </p>
        <h2>Our Mission </h2>
        <p>
          Our mission is to make food delivery easy, convenient, and affordable
          for everyone. We partner with the best local restaurants to offer a
          wide variety of options that cater to every taste.
        </p>
        <h2>How It Works</h2>
        <p>
          1. Browse the menu: Explore a range of food categories from top
          restaurants in your area.
        </p>
        <p>
          2. Add to cart: Pick your favorite dishes and add them to your cart.
        </p>
        <p>3. Checkout: Enter your delivery details and place your order.</p>
        <p>
          4. Fast delivery: We will ensure your food arrives fresh and on time.
        </p>
        <h2>Why Choose Us?</h2>
        <ul>
          <li>Wide selection of restaurants and cuisines</li>
          <li>Fast and reliable delivery service</li>
          <li>Easy-to-use interface</li>
          <li>Secure payment options</li>
          <li>Great customer support</li>
        </ul>
      </div>
    </div>
  );
}

export default About;
