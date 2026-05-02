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

  const [showTableChoice, setShowTableChoice] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  if (!open) return null;

  function handlePayLater() {
    localStorage.setItem("tab_pending_cart",   JSON.stringify(cart));
    localStorage.setItem("tab_pending_amount", JSON.stringify(amount));
    window.location.href = "/pay-later";
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

          {/* ===== STEP 1: ORDER TYPE ===== */}
          {showTableChoice === false && (
            <>
              <h2 className="modal-title">
                How would you like to order?
              </h2>

              <p className="modal-subtitle">
                Your satisfaction is our competence
              </p>

              <div className="modal-grid">

                <button
                  className="checkout-btn order-option"
                  onClick={() => setShowTableChoice(true)}
                >
                  ️<FontAwesomeIcon icon={faUtensils} />
                  TABLE ORDER
                </button>

                <button
                  className="checkout-btn order-option"
                  onClick={() => setShowDeliveryModal(true)}
                >
                  <FontAwesomeIcon icon={faTruck} />
                  DELIVERY ORDER
                </button>

                <button
                  className="checkout-btn order-option"
                  onClick={() => setShowPickupModal(true)}
                >
                  ️<FontAwesomeIcon icon={faBagShopping} />
                  PICKUP ORDER
                </button>

              </div>
            </>
          )}

          {/* ===== STEP 2: PAY NOW OR PAY LATER ===== */}
          {showTableChoice === true && (
            <>
              <h2 className="modal-title">
                Table Order
              </h2>

              <p className="modal-subtitle">
                How would you like to pay?
              </p>

              <div className="modal-grid">

                <button
                  className="checkout-btn order-option"
                  onClick={() => {
                    setShowTableChoice(false);
                    setShowTableModal(true);
                  }}
                >
                  PAY NOW
                </button>

                <button
                  className="checkout-btn order-option"
                  onClick={handlePayLater}
                >
                  PAY LATER
                </button>

              </div>
            </>
          )}

        </div>
      </div>

      {/* ⭐ Table — Pay Now flow */}
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
