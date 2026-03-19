import { useState } from "react";
import FlutterwaveWebPayment from "./FlutterwaveWebPayment";
import "./Css/TableDeliverPickup.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function PickupOrderModal({
  open,
  onClose,
  cart = [],
  amount = 0
}) {

  const [showPayment, setShowPayment] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [phone, setPhone] = useState("");

  if (!open) return null;

  const handleSubmit = () => {

    const info = {
      name: document.querySelector("#pickup-name").value,
      phone: phone,
      time: document.querySelector("#pickup-time").value
    };

    if (!info.name || !info.phone || !info.time) {
      alert("Please fill all fields");
      return;
    }

    setCustomerInfo(info);
    setShowPayment(true);
  };

  if (showPayment && customerInfo) {
    return (
      
<FlutterwaveWebPayment
 name={customerInfo.name}
 phone={customerInfo.phone}
 amount={amount}
 cart={cart}
 orderType="pickup"
 pickupTime={customerInfo.time}
/>
      
      
      
    );
  }

  return (
    <div className="modal">
      <div className="modal-content" id="pickupOrderModal">

        <h3 className="modal-title">Pickup Order ~ Enter your pickup details below:</h3>
      
         <label className="labelText">Full Name</label>
        <input id="pickup-name" placeholder="Full Name" />
        
       <label className="labelText">Phone No</label>
<PhoneInput
  international
  defaultCountry="NG"
  value={phone}
  onChange={setPhone}
  placeholder="Enter phone number"
  className="phone-input"
/>

        <label className="labelText">Pickup Time</label>
        <input id="pickup-time" placeholder="Pickup Time" type="time" />

        {/* Submit */}
        <button
          id="pickupOrderSubmit"
          className="btn"
          onClick={handleSubmit}
        >
          SUBMIT & PAY
        </button>

        {/* Cancel BELOW submit */}
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