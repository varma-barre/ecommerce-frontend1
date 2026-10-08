import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

function ProductForm({
  productToEdit,
  onProductCreated,
  onProductUpdated,
  onCancelEdit
}) {


  const { token } = useAuth();



  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    status: "active",
    image: null
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Cloudinary details
  const CLOUD_NAME = "k9scfge5";
  const UPLOAD_PRESET = "ecommerce_products";

  // Load existing product when Edit is clicked
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || "",
        description: productToEdit.description || "",
        price: productToEdit.price || "",
        category: productToEdit.category || "",
        stock: productToEdit.stock ?? "",
        status: productToEdit.status || "active",
        image: null
      });

      setSuccess("");
      setError("");
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        status: "active",
        image: null
      });

      setSuccess("");
      setError("");
    }
  }, [productToEdit]);

  useEffect(() => {
  const fetchCategories = async () => {
    try {

     const response = await fetch(
        `${API_URL}/api/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`
        }
    }   
);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch categories"
        );
      }

      setCategories(result.categories || []);

    } catch (error) {
      console.error("Category fetch error:", error);
      setError(error.message);
    }
  };

  fetchCategories();
}, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: files ? files[0] : value
    }));
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (imageFile) => {
    const cloudinaryData = new FormData();

    cloudinaryData.append("file", imageFile);
    cloudinaryData.append(
      "upload_preset",
      UPLOAD_PRESET
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: cloudinaryData
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error?.message ||
        "Image upload failed"
      );
    }

    return result.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Product name is required");
      return;
    }

    if (!formData.price) {
      setError("Price is required");
      return;
    }

    if (Number(formData.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (formData.stock === "") {
      setError("Stock is required");
      return;
    }

    if (Number(formData.stock) < 0) {
      setError("Stock cannot be negative");
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";

      // Upload image to Cloudinary
      if (formData.image) {
        imageUrl = await uploadImageToCloudinary(
          formData.image
        );
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        stock: formData.stock,
        status: formData.status,
        image: imageUrl
      };

      

      let url = `${API_URL}/api/products`;
      let method = "POST";

      // EDIT MODE
      if (productToEdit) {
        url = `${API_URL}/api/products/${productToEdit._id}`;
        method = "PUT";
      }

      console.log("PRODUCT API URL:", url);
      console.log("PRODUCT DATA:", productData);
      console.log("AUTH TOKEN:", token);


      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Something went wrong"
        );
      }

      // CREATE
      if (!productToEdit) {
        setSuccess(
          result.message ||
          "Product created successfully"
        );

        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          stock: "",
          status: "active",
          image: null
        });

        if (onProductCreated) {
          onProductCreated(result.product);
        }
      }

      // UPDATE
      else {
        setSuccess(
          result.message ||
          "Product updated successfully"
        );

        if (onProductUpdated) {
          onProductUpdated(result.product);
        }
      }

    } catch (error) {
      console.error(
        "Product save error:",
        error
      );

      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">

      <h2>
        {productToEdit
          ? "Edit Product"
          : "Add Product"}
      </h2>

      {success && (
        <p className="success-message">
          {success}
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Product Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
          />
        </div>

        <div className="form-group">
          <label>Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
          />
        </div>

        <div className="form-group">
          <label>Price</label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
          />
        </div>

        <div className="form-group">
        <label>Category</label>

       <select
         name="category"
         value={formData.category}
         onChange={handleChange}
       >
       <option value="">
         Select Category
       </option>

         {categories.map((category) => (
      <option
        key={category._id}
        value={category.name}
      >
        {category.name}
      </option>
    ))}
  </select>
</div>

        <div className="form-group">
          <label>Stock</label>

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Enter stock"
          />
        </div>

        <div className="form-group">
          <label>Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>Product Image</label>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="add-product-btn"
        >
          {loading
            ? "Saving..."
            : productToEdit
            ? "Update Product"
            : "Add Product"}
        </button>

        {productToEdit && (
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}

      </form>

    </div>
  );
}

export default ProductForm;