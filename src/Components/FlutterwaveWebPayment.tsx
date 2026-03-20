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

  function startPayment(key: string) {
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

          const orderPayload = {
            name: name || "Customer",
            phone: phone || "",
            table_no: tableNo || "",
            address,
            order_type: orderType || "table",
            pickup_time: pickupTime,
            amount: safeAmount,
            transaction_id: data.transaction_id || data.tx_ref,
            cart
          };

          try {
            const res = await fetch(`${API_BASE}/saveOrder`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(orderPayload)
            });

            const result = await res.json();

            if (result.status === "success") {
              // ✅ Navigate immediately to OrderSuccess page
              // FlutterwaveWebPayment
navigate(`/order-success?order_id=${result.order_id}`, { replace: true });
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
        onClose?.();
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
