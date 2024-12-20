import React from "react";
import "./Contact.css"; // Optional: Add a custom CSS for the Contact page styling

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>
        If you have any questions or concerns, feel free to reach out to us:
      </p>

      <div className="contact-info">
        <h3> ways to reach us:</h3>
        <p>Email: contact@myapp.com</p>
        <p>Phone: +123 456 7890</p>
      </div>
    </div>
  );
};

export default Contact;
