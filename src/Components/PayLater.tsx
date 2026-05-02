import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { API_BASE } from "../Config/api";
import "./Css/TableDeliverPickup.css";

export default function PayLater() {

  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {

    const name    = document.querySelector("#pl-name").value.trim();
    const tableNo = document.querySelector("#pl-table").value.trim();

    if (!name || !phone || !tableNo) {
      alert("Please fill all fields");
      return;
    }

    /* ===== READ CART FROM LOCALSTORAGE ===== */
    const cart   = JSON.parse(localStorage.getItem("tab_pending_cart")   || "[]");
    const amount = parseFloat(localStorage.getItem("tab_pending_amount") || "0");

    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before starting a tab.");
      return;
    }

    setLoading(true);

    try {

      const sessionToken = localStorage.getItem("session_token") || null;

      const res = await fetch(`${API_BASE}/createSession`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          table_no:      tableNo,
          session_token: sessionToken,
          cart,
          amount
        })
      });

      const data = await res.json();

      if (data.status !== "success") {
        alert(data.message || "Could not create session");
        setLoading(false);
        return;
      }

      /* ===== SAVE SESSION TO LOCAL STORAGE ===== */
      localStorage.setItem("tab_session_code", data.session_code);
      localStorage.setItem("tab_order_id",     data.order_id);
      localStorage.setItem("tab_name",          name);
      localStorage.setItem("tab_phone",         phone);
      localStorage.setItem("tab_table",         tableNo);

      /* ===== CLEAN UP PENDING CART ===== */
      localStorage.removeItem("tab_pending_cart");
      localStorage.removeItem("tab_pending_amount");

      /* ===== SEND WHATSAPP LINK ===== */
      const resumeLink = `${window.location.origin}/session?code=${data.session_code}`;
      const waMessage  = encodeURIComponent(
        `Hi ${name}! 🍽️ Your table tab is open.\n\nSession Code: ${data.session_code}\n\nResume your tab anytime here:\n${resumeLink}`
      );
      const waNumber = phone.replace(/\D/g, "");
      window.open(`https://wa.me/${waNumber}?text=${waMessage}`, "_blank");

      /* ===== REDIRECT TO SESSION PAGE ===== */
      navigate(`/session?code=${data.session_code}`);

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="modal" style={{ position: "relative", minHeight: "100vh" }}>
      <div className="modal-content">

        <h3 className="modal-title">
          Table Order ~ Pay Later
        </h3>

        <p style={{ textAlign: "center", color: "#888", marginBottom: "1rem", fontSize: "0.9rem" }}>
          Order freely and pay when you're done
        </p>

        <label className="labelText">Full Name</label>
        <input
          id="pl-name"
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
          id="pl-table"
          placeholder="Table Number"
        />

        <button
          className="btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "CREATING MY TAB..." : "START MY TAB"}
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          CANCEL
        </button>

      </div>
    </div>
  );
}
