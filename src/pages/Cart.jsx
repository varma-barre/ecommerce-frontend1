import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config/api";



const getImageUrl = (image) => {

  if (!image) {
    return "";
  }

  // If image is already a complete URL
  if (image.startsWith("http")) {
    return image;
  }

  // If image is a backend/local path
  return `${API_URL}${image}`;
};


function Cart() {

  const {
    cart,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart
  } = useCart();


  // EMPTY CART
  if (cart.length === 0) {
    return (
        <div className="cart-page">

            <div className="empty-cart">

                <h2>Your cart is empty</h2>

                <p>
                    Looks like you haven't added
                    any products to your cart yet.
                </p>

                <Link
                    to="/products"
                    className="continue-shopping-btn"
                >
                    Continue Shopping
                </Link>

            </div>

        </div>
    );
}


  return (
    <div className="cart-page">

      <h1>Shopping Cart</h1>


      <div className="cart-container">

        {cart.map((item) => (

          <div
            className="cart-item"
            key={item._id}
          >

            {/* PRODUCT IMAGE */}

            {item.image ? (

              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="cart-item-image"
              />

            ) : (

              <div className="no-image">
                No Image Available
              </div>

            )}


            {/* PRODUCT DETAILS */}

            <div className="cart-item-details">

              <h2>{item.name}</h2>

              <p>
                Category: {item.category}
              </p>

              <p>
                Price: ₹{item.price}
              </p>


              {/* QUANTITY */}

              <div className="quantity-controls">

                <button
                  onClick={() =>
                    decreaseQuantity(item._id)
                  }
                >
                  −
                </button>


                <span>
                  {item.quantity}
                </span>


                <button
                  onClick={() =>
                    increaseQuantity(item._id)
                  }
                >
                  +
                </button>

              </div>


              {/* PRODUCT TOTAL */}

              <p>
                Product Total: ₹
                {Number(item.price) * item.quantity}
              </p>


              {/* REMOVE */}

              <button
                className="remove-button"
                onClick={() =>
                  removeFromCart(item._id)
                }
              >
                Remove
              </button>

            </div>

          </div>

        ))}

      </div>


      {/* CART SUMMARY */}

      <div className="cart-summary">

        <h2>
          Total: ₹{cartTotal}
        </h2>



          {/* CHECKOUT */}

        <Link
          to="/checkout"
          className="checkout-button"
        >
          Proceed to Checkout
        </Link>


        <button
          className="clear-cart-button"
          onClick={clearCart}
        >
          Clear Cart
        </button>


      

      </div>

    </div>
  );
}

export default Cart;