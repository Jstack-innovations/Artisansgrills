import { useEffect, useState } from "react";
import OrderTypeModal from "./OrderTypeModal";
import "./Css/CartSidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { API_BASE } from "../Config/api";

export default function CartSidebar({
  cart = [],
  subtotal = 0,
  taxAmount = 0,
  totalAmount = 0,
  updateQty,
  checkout,
  cartOpen,
  setCartOpen
}) {

  const [visible, setVisible] = useState(false);

  const [fees, setFees] = useState({
    tax: 0,
    delivery_fee: 0,
    service_fee: 0
  });

  const [loading, setLoading] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    async function loadFees() {
      try {
        const res = await fetch(
        `${API_BASE}/tax`
        );

        const data = await res.json();
        setFees(data);

      } catch (err) {
        console.log("Fee load error", err);
      }
    }

    loadFees();
  }, []);

  useEffect(() => {
    if (cartOpen) setVisible(true);
    else {
      const timer = setTimeout(() => setVisible(false), 300);
     return () => clearTimeout(timer);
    }
  }, [cartOpen]);

 if (!visible) return null;

  function deleteItem(id) {
    updateQty?.(id, 0);
  }

  const taxValue = subtotal * (fees.tax || 0);
  const serviceValue = subtotal * (fees.service_fee || 0);
  const deliveryValue = fees.delivery_fee || 0;

  const finalTotal =
    subtotal +
    taxValue +
    serviceValue +
    deliveryValue;

  function handlePlaceOrderClick() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setShowOrderModal(true);
    }, 3000);
  }

  return (
    <>
      <div
        onClick={() => setCartOpen(false)}
        className="cart-overlay"
      />

      <div className="cart-sidebar">

        <div className="cart-header">
          <h2 className="cart-title">GUESTS ORDER</h2>
          <button
            className="cart-close"
            onClick={() => setCartOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 && (
            <div className="cart-empty">No items in cart</div>
          )}

          {cart.map(item => (
            <div key={item.id} className="cart-item">

              <div className="cart-img-wrap">
                <img src={item.image} className="cart-img" />
              </div>

              <div style={{ flex: 1 }}>

                <div className="cart-name">{item.name}</div>

                {item.description && (
                  <div className="cart-desc">{item.description}</div>
                )}

                {item.signature && (
                  <div className="cart-signature">
                    Signature: {item.signature}
                  </div>
                )}

                {item.tags && (
                  <div className="cart-tags">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="cart-tag">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="cart-price-row">
                  <span className="cart-price">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </span>

                  <button
                    className="cart-trash"
                    onClick={() => deleteItem(item.id)}
                  >
                  <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>

                <div className="cart-controls">
                  <button
                    className="cart-qty-btn"
                    style={{
                      opacity: (item.quantity || 1) <= 1 ? 0.4 : 1
                    }}
                    disabled={(item.quantity || 1) <= 1}
                    onClick={() => updateQty?.(item.id, -1)}
                  >
                    −
                  </button>

                  <span className="cart-qty-text">
                    {item.quantity || 1}
                  </span>

                  <button
                    className="cart-qty-btn"
                    onClick={() => updateQty?.(item.id, 1)}
                  >
                    +
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

       {cart.length > 0 && (
  <div className="cart-total-box">

    <div className="cart-total-row">
      <span>Subtotal</span>
      <span>${subtotal.toFixed(2)}</span>
    </div>

    <div className="cart-total-row">
      <span>Tax</span>
      <span>${taxValue.toFixed(2)}</span>
    </div>

    <div className="cart-total-row">
      <span>Service Fee</span>
      <span>${serviceValue.toFixed(2)}</span>
    </div>

    <div className="cart-total-row">
      <span>Delivery Fee</span>
      <span>${deliveryValue.toFixed(2)}</span>
    </div>

    <div className="cart-total-final">
      <span>Total</span>
      <span>${finalTotal.toFixed(2)}</span>
    </div>

    <button
      className="cart-checkout-btn"
      onClick={handlePlaceOrderClick}
    >
      PLACE ORDER
    </button>

  </div>
)}

      </div>

      {loading && (
        <div className="cart-spinner-overlay">
          <div className="cart-spinner" />
        </div>
      )}

      <OrderTypeModal
        open={showOrderModal}
        cart={cart}
        amount={finalTotal}
        onClose={() => setShowOrderModal(false)}
        onSelectType={(type) => {

          setShowOrderModal(false);

          checkout({
            amount: finalTotal,
            cart,
            orderType: type
          });

        }}
      />
    </>
  );
}
