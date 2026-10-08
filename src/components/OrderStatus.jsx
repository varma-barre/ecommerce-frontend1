function OrderStatus({ status }) {
  const statusDetails = {
    pending: {
      icon: "⏳",
      text: "Pending",
    },

    confirmed: {
      icon: "✓",
      text: "Confirmed",
    },

    shipped: {
      icon: "🚚",
      text: "Shipped",
    },

    delivered: {
      icon: "✓",
      text: "Delivered",
    },

    cancelled: {
      icon: "✕",
      text: "Cancelled",
    },
  };

  const currentStatus = statusDetails[status];

  if (!currentStatus) {
    return (
      <span className="order-status unknown">
        ❔ Unknown Status
      </span>
    );
  }

  return (
    <span className={`order-status ${status}`}>
      <span className="order-status-icon">
        {currentStatus.icon}
      </span>

      <span>{currentStatus.text}</span>
    </span>
  );
}

export default OrderStatus;