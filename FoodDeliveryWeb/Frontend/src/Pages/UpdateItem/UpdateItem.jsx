import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./UpdateItem.css";
import { toast } from "react-toastify";

function UpdateItem() {
  const params = useParams();
  let id = Cookies.get("resId");

  const [listCategory, setlistCategory] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [data, setData] = useState({
    name: "",
    description: "",
    image: null, // Store the image file itself here, not the base64 string
    category: "",
    price: "",
    RestaurantId: "",
  });

  // Fetch existing item data
  const fetchItem = async () => {
    const response = await axios.get(
      `http://localhost:5083/api/Item/${params.id}`
    );
    if (response.status === 200) {
      setData(response.data);
      // Set imagePreview to the URL for the current image
      setImagePreview(`http://localhost:5083/uploads/${response.data.image}`);
    }
  };

  // Handle image change event and update state
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setData({ ...data, image: file }); // Store the file in the 'image' field of 'data'

    if (file) {
      // Update image preview with the newly selected file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the base64 string for UI preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("RestaurantId", id);

    // Only append image if a new file is selected
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    try {
      const response = await axios.put(
        `http://localhost:5083/api/Item/updateItem/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        console.log("Item Updated:", response.data);
        toast.success("Item Updated");
      }
    } catch (error) {
      console.error("Error Updating item:", error.message);
      toast.error("Error");
    }
  };

  // Fetch categories for the dropdown
  const fetchCategory = async () => {
    const response = await axios.get(
      `http://localhost:5083/api/Category/category/${id}`
    );
    if (response.status === 200) {
      setlistCategory(response.data);
    }
  };

  useEffect(() => {
    fetchItem();
    fetchCategory();
  }, []);

  return (
    <div className="item-container mt-4">
      <div className="container d-flex flex-column justify-content-center align-items-center m-2 p-3 rounded-3 shadow-lg item">
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="txt-field mb-3">
            <label htmlFor="itemName">Item Name</label>
            <input
              type="text"
              name="itemName"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            <br />
            <label htmlFor="description">Description</label>
            <input
              type="text"
              name="description"
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
            <br />
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              value={data.price}
              onChange={(e) => setData({ ...data, price: e.target.value })}
            />
            <br />
            <label htmlFor="category">Category</label>
            <select
              name="category"
              value={data.category}
              onChange={(e) => setData({ ...data, category: e.target.value })}
            >
              <option value="">Select</option>
              {listCategory.length > 0 ? (
                listCategory.map((category) => (
                  <option value={category.categoryName} key={category.id}>
                    {category.categoryName}
                  </option>
                ))
              ) : (
                <option disabled>No categories available</option>
              )}
            </select>
            <br />
            <label htmlFor="image">Image</label>
            <input type="file" name="image" onChange={handleImageChange} />
            {imagePreview && (
              <div className="image-preview">
                <img
                  src={imagePreview}
                  alt="Current item"
                  style={{ width: "150px", height: "150px" }}
                />
                <p>Current image</p>
              </div>
            )}
            <br />
          </div>
          <button type="submit" className="btn btn-primary reg-btn">
            Update Item
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateItem;
