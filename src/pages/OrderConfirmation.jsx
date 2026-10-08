import { Link, useParams } from "react-router-dom";

function OrderConfirmation() {
     const { orderId } = useParams();
  const savedOrder = localStorage.getItem("lastOrder");

  const order = savedOrder
    ? JSON.parse(savedOrder)
    : null;

  return (
    <div className="order-confirmation">

      <div className="confirmation-box">

        {order ? (
          <>
            <h1>Order Confirmed! 🎉</h1>

            <p>
              Thank you for your order.
            </p>

            <div className="order-details">

              <p>
                <strong>Order ID:</strong>{" "}
                {order._id}
              </p>

              <p>
                <strong>Total Amount:</strong>{" "}
                ₹{order.totalAmount}
              </p>

              <p>
                <strong>Payment Method:</strong>{" "}
                {order.paymentMethod}
              </p>

              <p>
               <strong>Shipping Address:</strong>
              </p>

                 <div className="shipping-address">
                    {order.shippingAddress.split("\n").map((line, index) => (
                     <p key={index}>
                       {index === 1 ? `Mobile: ${line}` : line}
                    </p>
                    ))}
                </div>

            </div>

            <Link
              to="/products"
              className="continue-shopping-button"
            >
              Continue Shopping
            </Link>
          </>
        ) : (
          <>
            <h1>No Order Found</h1>

            <p>
              We could not find your recent order.
            </p>

            <Link
              to="/products"
              className="continue-shopping-button"
            >
              Continue Shopping
            </Link>
          </>
        )}

      </div>

    </div>
  );
}

export default OrderConfirmation;