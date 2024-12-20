import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../Context/UserContext";
// import "./AddRestaurant.css";
import axios from "axios";
import { isRouteErrorResponse, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function UpdateRestaurant() {
  const param = useParams();
  console.log("Restaurant", param.id);
  const { user } = useContext(UserContext);
  const [id, setId] = useState(null);
  const [data, setData] = useState({
    sellerId: "",
    name: "",
    tags: "",
    minOrderAmount: "",
    apartment: "",
    locality: "",
    street: "",
    zipCode: "",
    contact: "",
    paymentMode: "",
    image: null, // Set image to null initially
  });

  const GetRestaurant = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5083/api/Restaurant/restaurant/${param.id}`
      );
      if (response.status == 200) {
        console.log(response.data);
        setData(response.data);
      }
    } catch (error) {
      console.log("Error in fetching Restaurant");
      toast.error("Errror");
    }
  };
  // Set the seller_id based on the user context
  useEffect(() => {
    GetRestaurant();
    if (user) {
      setId(user.userId); // Assuming userId is coming from context
      setData((prevData) => ({
        ...prevData,
        sellerId: user.userId,
      }));
      console.log("Seller ID:", user.userId); // Log the correct value
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle the file and other data
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    try {
      const response = await axios.put(
        `http://localhost:5083/api/Restaurant/updateRestaurant/${param.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        // console.log(response);
        console.log(response.data.message);
        console.log(response.data.restaurant);
        toast.success("Restaurant Updated");

        setData({});
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="restaurant-container mt-4">
        <div className="container d-flex flex-column justify-content-center align-items-center m-2 p-3 rounded-3 shadow-lg restaurant">
          {/* <h1 className="text-center mb-4">Restaurants</h1> */}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="txt-field mb-3">
              <label htmlFor="restaurant-name">Restaurant Name</label>
              <input
                type="text"
                name="restaurant_name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
              <br />
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                name="tags"
                value={data.tags}
                onChange={(e) => setData({ ...data, tags: e.target.value })}
              />
              <br />
              <label htmlFor="minorderamt">Min Order Amount</label>
              <input
                type="number"
                name="minorderamt"
                value={data.minOrderAmount}
                onChange={(e) =>
                  setData({ ...data, minOrderAmount: e.target.value })
                }
              />
              <br />
              <div className="address">
                <div className="address-apt">
                  <label htmlFor="apartment">Apartment</label>
                  <input
                    type="text"
                    name="apartment"
                    value={data.apartment}
                    onChange={(e) =>
                      setData({ ...data, apartment: e.target.value })
                    }
                  />
                  <br />
                  <label htmlFor="locality">Locality</label>
                  <input
                    type="text"
                    name="locality"
                    value={data.locality}
                    onChange={(e) =>
                      setData({ ...data, locality: e.target.value })
                    }
                  />
                  <br />
                </div>
                <div className="address-street">
                  <label htmlFor="street">Street</label>
                  <input
                    type="text"
                    name="street"
                    value={data.street}
                    onChange={(e) =>
                      setData({ ...data, street: e.target.value })
                    }
                  />
                  <br />
                  <label htmlFor="zipcode">Zip Code</label>
                  <input
                    type="number"
                    name="zipcode"
                    value={data.zipCode}
                    onChange={(e) =>
                      setData({ ...data, zipCode: e.target.value })
                    }
                  />
                  <br />
                </div>
              </div>
              <label htmlFor="contact">Contact</label>
              <input
                type="number"
                name="contact"
                value={data.contact}
                onChange={(e) => setData({ ...data, contact: e.target.value })}
              />
              <br />
              <label htmlFor="paymentmode">Payment Mode</label>
              <input
                type="text"
                name="paymentmode"
                value={data.paymentMode}
                onChange={(e) =>
                  setData({ ...data, paymentMode: e.target.value })
                }
              />
              <br />
              <label htmlFor="image">Image</label>
              <input
                type="file"
                name="image"
                onChange={(e) => setData({ ...data, image: e.target.files[0] })}
              />
              <br />
            </div>
            <button type="submit" className="btn btn-primary reg-btn">
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdateRestaurant;
