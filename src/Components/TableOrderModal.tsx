import { useState } from "react";
import FlutterwaveWebPayment from "./FlutterwaveWebPayment";
import "./Css/TableDeliverPickup.css"; // ✅ External CSS
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";


export default function TableOrderModal({
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
      name: document.querySelector("#table-name").value,
      phone: phone,      
      table: document.querySelector("#table-number").value
    };

    if (!info.name || !info.phone || !info.table) {
      alert("Please fill all fields");
      return;
    }

    setCustomerInfo(info);
    setShowPayment(true);
  };

  // 🔥 When payment is active, render Flutterwave
  if (showPayment && customerInfo) {
    return (
      <FlutterwaveWebPayment
        name={customerInfo.name}
        phone={customerInfo.phone}
        tableNo={customerInfo.table}
        amount={amount}
        cart={cart}
        orderType="table"
        onSuccess={() => {
          setShowPayment(false);
          onClose?.();
        }}
        onClose={() => {
          setShowPayment(false);
        }}
      />
    );
  }

  return (
    <div className="modal">
      <div className="modal-content">

        <h3 className="modal-title">
          Table Order ~ Enter your details below:
        </h3>
           
        <label className="labelText">Full Name</label>
        <input
          id="table-name"
          placeholder="Full Name"
        />
        
        
       <label className="labelText">Phone No</label>
<PhoneInput
  international
  defaultCountry="NG"
  value={phone}
  onChange={setPhone}
  placeholder="Enter phone number"
  className="phone-input"
/>
        
        <label className="labelText">Table No</label>
        <input
          id="table-number"
          placeholder="Table Number"
        />

        <button
          id="tableOrderSubmit"
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



