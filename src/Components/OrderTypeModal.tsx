import { useState } from "react";
import TableOrderModal from "./TableOrderModal";
import PickupOrderModal from "./PickupOrderModal";
import DeliveryOrderModal from "./DeliveryOrderModal";
import "./Css/OrderTypeModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUtensils, 
  faTruck, 
  faBagShopping 
} from "@fortawesome/free-solid-svg-icons";

export default function OrderTypeModal({
  open,
  onClose,
  cart,
  amount
}) {

  const [showTableModal, setShowTableModal] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  if (!open) return null;

  function handleType(type) {
  if (type === "table") {
    setShowTableModal(true);
    return;
  }

  if (type === "pickup") {
    setShowPickupModal(true);
    return;
  }

  if (type === "delivery") {
    setShowDeliveryModal(true);
    return;
  }
}

  return (
    <>
      {/* ⭐ Order Type Selector */}
      <div className="order-type-modal">
        
        <div className="modal-overlay" onClick={onClose}></div>


        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          

          <button
            className="modal-close"
            onClick={onClose}
          >
            &times;
          </button>

          <h2 className="modal-title">
            How would you like to order?
          </h2>

          <p className="modal-subtitle">
            Your satisfaction is our competence
          </p>

          <div className="modal-grid">

            <button
              className="checkout-btn order-option"
              onClick={() => handleType("table")}
            >
              ️<FontAwesomeIcon icon={faUtensils} />
              TABLE ORDER
            </button>

            <button
              className="checkout-btn order-option"
              onClick={() => handleType("delivery")}
            >
              <FontAwesomeIcon icon={faTruck} />
              DELIVERY ORDER
            </button>

            <button
              className="checkout-btn order-option"
              onClick={() => handleType("pickup")}
            >
              ️<FontAwesomeIcon icon={faBagShopping} />
              PICKUP ORDER
            </button>

          </div>
        </div>
      </div>

      {/* ⭐ Table */}
      <TableOrderModal
        open={showTableModal}
        cart={cart}
        amount={amount}
        onClose={() => {
          setShowTableModal(false);
          onClose?.();
        }}
      />

      {/* ⭐ Pickup */}
      <PickupOrderModal
        open={showPickupModal}
        cart={cart}
        amount={amount}
        onClose={() => {
          setShowPickupModal(false);
          onClose?.();
        }}
      />

      {/* ⭐ Delivery */}
      <DeliveryOrderModal
        open={showDeliveryModal}
        cart={cart}
        amount={amount}
        onClose={() => {
          setShowDeliveryModal(false);
          onClose?.();
        }}
      />

    </>
  );
}