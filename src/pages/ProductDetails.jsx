import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    fetch(`${API_URL}/api/products/${id}`)

      .then((response) => {

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error("Product not found");
        }

        return response.json();
      })

      .then((data) => {

        console.log("Product details from backend:", data);

        setProduct(data.product);
        setLoading(false);
      })

      .catch((error) => {

        console.error("Product details error:", error);

        setError("Product Not Found");
        setLoading(false);
      });

  }, [id]);


  function increaseQuantity() {

    setQuantity((currentQuantity) => {

      if (currentQuantity < product.stock) {
        return currentQuantity + 1;
      }

      return currentQuantity;
    });

  }


  function decreaseQuantity() {

    setQuantity((currentQuantity) => {

      if (currentQuantity > 1) {
        return currentQuantity - 1;
      }

      return currentQuantity;
    });

  }


  function handleAddToCart() {

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    alert(`${quantity} ${product.name} added to cart`);

  }


  if (loading) {
    return (
      <h2 className="loading-message">
        Loading product...
      </h2>
    );
  }


  if (error) {
    return (
      <h2 className="error-message">
        {error}
      </h2>
    );
  }


  if (!product) {
    return (
      <h2 className="error-message">
        Product Not Found
      </h2>
    );
  }


  return (

    <div className="product-details">

      <button
        className="back-button"
        onClick={() => navigate("/products")}
      >
        ← Back to Products
      </button>


      <div className="product-details-content">

        <div className="product-details-image">

          {product.image ? (

            <img
            src={product.image}
            alt={product.name}
            />
          ) : (

            <div className="no-image">
              No Image Available
            </div>

          )}

        </div>


        <div className="product-details-info">

          <h1>{product.name}</h1>


          <p>
            <strong>Description:</strong>
            <br />
            {product.description}
          </p>


          <p>
            <strong>Category:</strong>{" "}
            {product.category}
          </p>


          <p className="detail-price">
            ₹{product.price}
          </p>


          <p>
            <strong>Available Stock:</strong>{" "}
            {product.stock}
          </p>


          <p>
            <strong>Status:</strong>{" "}

            <span className="product-status">
              {product.status}
            </span>

          </p>


          <div className="quantity-section">

            <h3>Quantity</h3>


            <div className="quantity-controls">

              <button
                className="quantity-button"
                onClick={decreaseQuantity}
                disabled={quantity === 1}
              >
                −
              </button>


              <span className="quantity-number">
                {quantity}
              </span>


              <button
                className="quantity-button"
                onClick={increaseQuantity}
                disabled={quantity === product.stock}
              >
                +
              </button>

            </div>


            {quantity === product.stock && (

              <p className="stock-message">
                Maximum available quantity selected.
              </p>

            )}

          </div>


          <div className="total-price">

            <strong>Total:</strong>{" "}

            ₹{product.price * quantity}

          </div>


          <button
            className="details-cart-button"
            onClick={handleAddToCart}
          >
            🛒 Add {quantity} to Cart
          </button>

        </div>

      </div>

    </div>

  );
}


export default ProductDetails;