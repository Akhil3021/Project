import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./AddItem.css";
import axios from "axios";
import { toast } from "react-toastify";
function AddItem() {
  const params = useParams();
  // console.log("params_id", params.id.split(":")[1]);
  let id = params.id.split(":")[1];
  console.log(id);
  const [data, setData] = useState({
    name: "",
    Description: "",
    image: null,
    category: "",
    price: "",
    RestaurantId: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    console.log(formData);
    try {
      const response = await axios.post(
        `http://localhost:5083/api/Item/addItem`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Item added:", response.data);
        toast.success("Item Added");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Error");
    }

    // FOR CATEGORY
  };
  const [category, setcategory] = useState({
    CategoryName: "",
    RestaurantId: "",
  });
  const addCategory = async (e) => {
    e.preventDefault();
    const { CategoryName, RestaurantId } = category;

    const response = await axios.post(
      "http://localhost:5083/api/Category/addCategory",
      {
        CategoryName,
        RestaurantId,
      }
    );
    if (response.status === 200) {
      console.log("Category added:", response.data);
      toast.success("Category Added");
    }
  };
  // Display Category

  const [listCategory, setlistCategory] = useState([]);

  const fetchCategory = async () => {
    const response = await axios.get(
      `http://localhost:5083/api/Category/category/${id}`
    );
    if (response.status === 200) {
      console.log(response.data);
      const categoryData = response.data;
      const categoryArray = Array.isArray(categoryData)
        ? categoryData
        : [categoryData];

      setlistCategory(categoryArray);
    }
  };
  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <>
      <div className="item-container mt-4">
        <div className="container d-flex flex-column justify-content-center align-items-center m-2 p-3 rounded-3 shadow-lg item">
          <h1 className="text-center mb-4">Item</h1>
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className="txt-field mb-3">
              <label htmlFor="restaurant-name">Item Name</label>
              <input
                type="text"
                name="resId"
                value={(data.RestaurantId = params.id.split(":")[1])}
                onChange={(e) =>
                  setData({ ...data, RestaurantId: e.target.value })
                }
                hidden
              />
              <input
                type="text"
                name="itemName"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
              <br />
              <label htmlFor="desc">Desc</label>
              <input
                type="text"
                name="desc"
                value={data.Description}
                onChange={(e) =>
                  setData({ ...data, Description: e.target.value })
                }
              />

              <br />
              <label htmlFor="tags">Price</label>
              <input
                type="number"
                name="price"
                value={data.price}
                onChange={(e) => setData({ ...data, price: e.target.value })}
              />
              <br />
              <label htmlFor="Category">Category</label>
              <select
                name=""
                id=""
                value={data.category}
                onChange={(e) => setData({ ...data, category: e.target.value })}
              >
                <option value="">Select</option>
                {listCategory.length > 0 ? (
                  listCategory.map((category) => {
                    return (
                      <option value={category.categoryName} key={category.id}>
                        {category.categoryName}
                      </option>
                    );
                  })
                ) : (
                  <option disabled>No categories available</option>
                )}
              </select>

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
              Add Item
            </button>
          </form>
        </div>
        <div className="category">
          <form
            className="flex-col"
            encType="multipart/form-data"
            onSubmit={addCategory}
          >
            <div className="add-product-name flex-col">
              <input
                type="hidden"
                name="id"
                id=""
                placeholder="id"
                value={(category.RestaurantId = params.id.split(":")[1])}
                onChange={(e) =>
                  setcategory({ ...category, RestaurantId: e.target.value })
                }
              />
            </div>

            <div className="add-category-name flex-col">
              <p>Category Name</p>
              <input
                type="text"
                name="cname"
                id=""
                placeholder="Name"
                value={category.CategoryName}
                onChange={(e) =>
                  setcategory({ ...category, CategoryName: e.target.value })
                }
              />
            </div>

            <button type="submit" className="category-btn">
              Add
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddItem;
