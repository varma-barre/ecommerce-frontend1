import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

function AdminProducts() {

   const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [productToEdit, setProductToEdit] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
         `${API_URL}/api/products`,
         {
           headers: {
              Authorization: `Bearer ${token}`
         }
    }
);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      setProducts(data.products);
    } catch (error) {
      console.error(error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (token) {
    fetchProducts();
  }
}, [token]);


  // After creating a product
  const handleProductCreated = (newProduct) => {
    setProducts((previousProducts) => [
      newProduct,
      ...previousProducts
    ]);
  };

  // When Edit button is clicked
  const handleEdit = (product) => {
    setProductToEdit(product);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // After updating a product
  const handleProductUpdated = (updatedProduct) => {
    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        product._id === updatedProduct._id
          ? updatedProduct
          : product
      )
    );

     alert(
        "Product updated successfully"
      );


    setProductToEdit(null);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setProductToEdit(null);
  };

   // Delete product
  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    // If user clicks Cancel
    if (!confirmed) {
      return;
    }

    try {
      

      const response = await fetch(
        `${API_URL}/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      // Remove deleted product from UI
      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product._id !== productId
        )
      );

      alert(
        data.message || "Product deleted successfully"
      );

    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      alert(
        error.message || "Failed to delete product"
      );
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="admin-products">

      <h1>Admin Products</h1>

      <ProductForm
        productToEdit={productToEdit}
        onProductCreated={handleProductCreated}
        onProductUpdated={handleProductUpdated}
        onCancelEdit={handleCancelEdit}
      />

      <h2>Product List</h2>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
       <table className="admin-products-table">

  <thead>
    <tr>
      <th>Image</th>
      <th>Product Name</th>
      <th>Price</th>
      <th>Category</th>
      <th>Stock</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>

    {products.map((product) => (
      <tr key={product._id}>

        {/* IMAGE */}
        <td>
          <div className="admin-product-image">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
              />
            ) : (
              <div className="admin-no-image">
                No Image
              </div>
            )}
          </div>
        </td>


        {/* PRODUCT NAME */}
        <td>
          <span className="admin-product-name">
            {product.name}
          </span>
        </td>


        {/* PRICE */}
        <td>
          <span className="admin-product-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
        </td>


        {/* CATEGORY */}
        <td>
          <span className="admin-product-category">
            {product.category || "N/A"}
          </span>
        </td>


        {/* STOCK */}
        <td>
          <span
            className={
              Number(product.stock) === 0
                ? "stock-out"
                : Number(product.stock) <= 5
                ? "stock-low"
                : "stock-available"
            }
          >
            {product.stock}
          </span>
        </td>


        {/* STATUS */}
        <td>
          <span
            className={
              product.status?.toLowerCase() === "active"
                ? "product-status active"
                : "product-status inactive"
            }
          >
            <span className="status-dot"></span>

            {product.status || "Inactive"}
          </span>
        </td>


        {/* ACTIONS */}
        <td>
          <div className="admin-product-actions">

            <button
              className="admin-edit-button"
              onClick={() => handleEdit(product)}
            >
              Edit
            </button>

            <button
              className="admin-delete-button"
              onClick={() => handleDelete(product._id)}
            >
              Delete
            </button>

          </div>
        </td>

      </tr>
    ))}

  </tbody>

</table>
      )}

    </div>
  );
}

export default AdminProducts;