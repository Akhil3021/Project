import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Verify.css";
function Verify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {
      console.log(
        "Verifying payment with OrderId:",
        orderId,
        "Success:",
        success
      );

      const response = await axios.post(
        "http://localhost:5083/api/Orders/verify",
        {
          success,
          orderId,
        }
      );

      if (response.data.success) {
        console.log("Payment verification successful:", response.data.message);
        navigate("/myOrders");
      } else {
        console.log("Payment verification failed:", response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error("Error during payment verification:", error.message);
      alert("An error occurred while verifying payment. Please try again.");
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []); // Empty dependency array ensures this runs only once on mount.

  return (
    <>
      <div className="verify">
        <div className="spinner"></div>
        <p>Verifying your payment, please wait...</p>
      </div>
    </>
  );
}

export default Verify;
