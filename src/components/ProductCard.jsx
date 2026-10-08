import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {

    const { addToCart } = useCart();

    const handleAddToCart = async () => {

        if (!product?._id) {
            console.error(
                "Cannot add product: Product ID is missing."
            );
            return;
        }

        await addToCart(product);
    };


    return (
        <div className="product-card">

            {/* PRODUCT IMAGE */}

            {product?.image ? (

                <img
                    src={product.image}
                    alt={product.name}
                    className="product-card-image"
                />

            ) : (

                <div className="no-image">
                    No Image Available
                </div>

            )}


            {/* PRODUCT INFORMATION */}

            <h2>
                {product?.name}
            </h2>


            <p>
                Category: {product?.category}
            </p>


            <h3>
                ₹{Number(product?.price || 0).toLocaleString("en-IN")}
            </h3>


            <p>
                Stock: {product?.stock}
            </p>


            {/* BUTTONS */}

            <div className="product-buttons">

                <Link
                    to={`/products/${product._id}`}
                    className="view-details-button"
                >
                    View Details
                </Link>


                <button
                    type="button"
                    className="add-cart-button"
                    onClick={handleAddToCart}
                    disabled={
                        Number(product?.stock || 0) <= 0
                    }
                >

                    {Number(product?.stock || 0) <= 0
                        ? "Out of Stock"
                        : "Add to Cart"
                    }

                </button>

            </div>

        </div>
    );
}

export default ProductCard;