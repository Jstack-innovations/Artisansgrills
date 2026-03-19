import { useState } from "react";
import FlutterwaveWebPayment from "./FlutterwaveWebPayment";
import "./Css/TableDeliverPickup.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function DeliveryOrderModal({
  open,
  onClose,
  cart = [],
  amount = 0
}) {

  const [showPayment, setShowPayment] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [phone, setPhone] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  if (!open) return null;

  const handleSubmit = () => {

    const info = {
      name: document.querySelector("#delivery-name").value,
      phone: phone,
      address: document.querySelector("#delivery-address").value
    };

    if (!info.name || !info.phone || !info.address) {
      alert("Please fill all fields");
      return;
    }

    setCustomerInfo(info);
    setShowPayment(true);
  };

  const handleUseLocation = () => {

    if (!navigator.geolocation) {
      alert("Location not supported");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        try {
          const { latitude, longitude } = position.coords;

          // Simple reverse geocoding using OpenStreetMap
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await res.json();

          const address =
            data.display_name ||
            "Enter your address manually";

          document.querySelector("#delivery-address").value = address;

        } catch {
          alert("Could not fetch address");
        }

        setLoadingLocation(false);
      },

      () => {
        alert("Location permission denied");
        setLoadingLocation(false);
      }
    );
  };

  if (showPayment && customerInfo) {
    return (
      <FlutterwaveWebPayment
        name={customerInfo.name}
        phone={customerInfo.phone}
        address={customerInfo.address}
        amount={amount}
        cart={cart}
        orderType="delivery"

        onSuccess={() => {
          setShowPayment(false);
          onClose?.();
        }}

        onClose={() => setShowPayment(false)}
      />
    );
  }

  return (
    <div className="modal">
      <div className="modal-content" id="deliveryOrderModal">

        <h3 className="modal-title">Delivery Order ~ Enter your delivery details below:</h3>
        
         <label className="labelText">Full Name</label>
        <input id="delivery-name" placeholder="Full Name" />
        
              <label className="labelText">Phone No</label>
<PhoneInput
  international
  defaultCountry="NG"
  value={phone}
  onChange={setPhone}
  placeholder="Enter phone number"
  className="phone-input"
/>
        
        
       <label className="labelText">Delivery Address</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            id="delivery-address"
            placeholder="Delivery Address"
            style={{ flex: 1 }}
          />

          <button
            className="btn"
            style={{ width: "auto", padding: "12px" }}
            onClick={handleUseLocation}
            disabled={loadingLocation}
          >
            {loadingLocation ? "Locating..." : "Use My Location"}
          </button>
        </div>

        <button
          id="deliveryOrderSubmit"
          className="btn"
          onClick={handleSubmit}
        >
          SUBMIT & PAY
        </button>

        <button
          className="btn btn-secondary"
          onClick={onClose}
        >
          CANCEL
        </button>

      </div>
    </div>
  );
}