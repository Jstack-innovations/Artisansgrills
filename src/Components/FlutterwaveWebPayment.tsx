import { useEffect, useRef } from "react";
import { API_BASE } from "../Config/api";
import { useNavigate } from "react-router-dom";

type FlutterwaveWebPaymentProps = {
  name: string;
  phone: string;
  tableNo?: string;
  address?: string;
  amount: number;
  orderType: string;
  cart?: any[];
  pickupTime?: string;
  onClose?: () => void;
};

export default function FlutterwaveWebPayment({
  name,
  phone,
  tableNo,
  address = "",
  amount,
  orderType,
  cart = [],
  pickupTime = "",
  onClose
}: FlutterwaveWebPaymentProps) {

  const paymentStarted = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadKeyAndScript() {
      try {
        const res = await fetch(`${API_BASE}/flutterwave`);
        const data = await res.json();

        if (!data.publicKey) {
          alert("Failed to load payment key");
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.flutterwave.com/v3.js";
        script.async = true;

        script.onload = () => {
          setTimeout(() => startPayment(data.publicKey), 500);
        };

        document.body.appendChild(script);

      } catch (err) {
        alert("Unable to load payment configuration");
        console.error(err);
      }
    }

    loadKeyAndScript();
  }, []);

  async function startPayment(key: string) {
    if (paymentStarted.current) return;
    paymentStarted.current = true;

    const safeAmount = Number(amount);
    if (!safeAmount || isNaN(safeAmount) || safeAmount <= 0) {
      alert("Invalid payment amount");
      return;
    }

    if (!window.FlutterwaveCheckout) {
      alert("Payment gateway failed to load");
      return;
    }

    /* ===== STEP 1: CREATE ORDER BEFORE FLUTTERWAVE OPENS ===== */

    let order_id: number | null = null;

    try {
      const createRes = await fetch(`${API_BASE}/createOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Customer",
          phone: phone || "",
          table_no: tableNo || "",
          address,
          order_type: orderType || "table",
          pickup_time: pickupTime,
          amount: safeAmount,
          cart
        })
      });

      const createData = await createRes.json();

      if (createData.status !== "success") {
        alert("Could not initialize order");
        paymentStarted.current = false;
        return;
      }

      order_id = createData.order_id;

    } catch (err) {
      console.error(err);
      alert("Could not initialize order");
      paymentStarted.current = false;
      return;
    }

    /* ===== STEP 2: OPEN FLUTTERWAVE ===== */

    window.FlutterwaveCheckout({
      public_key: key,
      tx_ref: "ARTISAN_" + Date.now(),
      amount: safeAmount,
      currency: "USD",
      payment_options: "card,banktransfer,ussd",
      customer: {
        email: "customer@artisan.com",
        phone_number: phone || "0000000000",
        name: name || "Customer"
      },
      customizations: {
        title: "Artisan Grill Collective",
        description: `${orderType || "Order"} Payment`
      },
      callback: async function (data) {
        paymentStarted.current = false;

        if (data.status === "successful") {

          /* ===== STEP 3: CONFIRM ORDER AFTER PAYMENT ===== */

          try {
            const res = await fetch(`${API_BASE}/confirmOrder`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id,
                transaction_id: data.transaction_id || data.tx_ref,
                amount: safeAmount,
                order_type: orderType || "table",
                table_no: tableNo || "",
                cart
              })
            });

            const result = await res.json();

            if (result.status === "success") {
              // ✅ Navigate immediately to OrderSuccess page
              // FlutterwaveWebPayment
              window.location.href = `/order-success?order_id=${result.order_id}`;
            } else {
              alert(result.message || "Database save failed");
            }

          } catch (err) {
            console.error(err);
            alert("Payment succeeded but database save failed");
          }

        } else {
          alert("Payment Failed ❌");
        }
      },
      onclose: function () {
        paymentStarted.current = false;
        window.location.href = "/";
      }
    });
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <h2>Processing Payment...</h2>
    </div>
  );
}
