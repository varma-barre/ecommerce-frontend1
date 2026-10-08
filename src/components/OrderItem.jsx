function OrderItem({ item }) {
  const itemTotal =
    item.price * item.quantity;

  return (
    <div className="order-item">
      <div>
        <h3>
          {item.product?.name ||
            "Product unavailable"}
        </h3>

        <p>
          <strong>Quantity:</strong>{" "}
          {item.quantity}
        </p>
      </div>

      <div>
        <p>
          <strong>Price:</strong>{" "}
          ₹{item.price}
        </p>

        <p>
          <strong>Item Total:</strong>{" "}
          ₹{itemTotal}
        </p>
      </div>
    </div>
  );
}

export default OrderItem;