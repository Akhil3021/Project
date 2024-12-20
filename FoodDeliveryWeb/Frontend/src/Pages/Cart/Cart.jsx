import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import "./Cart.css"; // Import the new CSS file

function Cart() {
  const {
    cartItems,
    item,
    removeFromCart,
    addToCart,
    getTotalCart,
    loadCartData,
  } = useContext(StoreContext);
  const DeliveryCharge = 20; // Delivery fee in ₹

  // Load cart data on component mount
  useEffect(() => {
    loadCartData();
    console.log(item);
  }, []);

  // Check if the cart is empty
  const isEmpty = Object.keys(cartItems).length === 0;

  return (
    <>
      <h1 className="cart-title">Shopping Cart</h1>
      {isEmpty ? (
        <div className="empty-cart-container">
          <h2 className="empty-cart-text">Your cart is empty</h2>
        </div>
      ) : (
        <div className="cart-container">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Title</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {item.map((product, index) => {
                const quantity = cartItems[product.id]; // Quantity in the cart
                if (quantity > 0) {
                  return (
                    <tr key={index}>
                      <td>
                        <img
                          src={`http://localhost:5083/uploads/${product.image}`}
                          alt={product.name}
                          className="cart-item-image"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => addToCart(product.id)}
                        >
                          +
                        </button>
                        <input
                          type="text"
                          value={quantity}
                          readOnly
                          className="quantity-input"
                        />
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => removeFromCart(product.id)}
                        >
                          -
                        </button>
                      </td>
                      <td>₹{product.price}</td>
                      <td>₹{product.price * quantity}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeFromCart(product.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
          <div className="cart-summary">
            <div className="summary-row">
              <p>Subtotal:</p>
              <p>₹{getTotalCart()}</p>
            </div>
            <div className="summary-row">
              <p>Delivery Fee:</p>
              <p>₹{DeliveryCharge}</p>
            </div>
            <div className="summary-row total-row">
              <p>Total:</p>
              <p>₹{getTotalCart() + DeliveryCharge}</p>
            </div>
          </div>
          <Link to={"/checkout"}>
            <button className="btn btn-primary checkout-button">
              Checkout
            </button>
          </Link>
        </div>
      )}
    </>
  );
}

export default Cart;
