import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { setSession, clearSession } from "../Utils/session";
import { API_BASE } from "../Config/api";
import "./Css/SessionPage.css";

export default function SessionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionCode = searchParams.get("code");

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [menuData, setMenuData] = useState([]); // ✅ ADDED
  const [loading, setLoading] = useState(true);
  const [sessionBlocked, setSessionBlocked] = useState(false);
const [blockMessage, setBlockMessage] = useState("");

  const [paying, setPaying] = useState(false);
  
  
  /* SAFE FETCH */
  const safeFetch = async (url) => {
    try {
      const res = await fetch(url);
      return await res.json();
    } catch (e) {
      return null;
    }
  };

  /* MENU LOAD (FIXED) */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/menu`);
        const data = await res.json();

        // flatten categories (IMPORTANT FIX)
        const flatMenu = Array.isArray(data)
          ? data
          : Object.values(data || {}).flat();

        setMenuData(flatMenu);
      } catch (err) {
        console.error("Menu load error", err);
        setMenuData([]);
      }
    })();
  }, []);

  /* SESSION */
useEffect(() => {
  if (!sessionCode) {
    setBlockMessage("No session code provided.");
    setSessionBlocked(true);
    setLoading(false);
    return;
  }

  (async () => {
    const data = await safeFetch(
      `${API_BASE}/getSession?code=${sessionCode}`
    );

    // ❌ Truly missing session (DB says not found OR null response)
    if (!data) {
      setBlockMessage("This tab does not exist or has not been opened yet.");
      setSessionBlocked(true);
      setLoading(false);
      return;
    }

    // ❌ Backend explicit error (closed / not found / deleted)
    if (data.status !== "success") {
      setBlockMessage(
        "This tab has not been opened yet or is no longer active. Please go to the menu to place an order."
      );
      setSessionBlocked(true);
      setLoading(false);
      return;
    }

    const sessionStatus = data.order?.status;

    if (sessionStatus === "open") {
      setSession(sessionCode);
    }

    if (sessionStatus === "paid" || sessionStatus === "closed") {
      clearSession();
      setBlockMessage("Your tab has been closed. Thanks for dining with us 🍽️");
      setSessionBlocked(true);
      setLoading(false);
      return;
    }

    setOrder(data.order || null);
    setItems(Array.isArray(data.items) ? data.items : []);
    setLoading(false);
  })();
}, [sessionCode]);

  /* IMAGE MAPPING (LIKE CART) */
  function getImage(menu_id) {
    const found = menuData.find(
      (m) => String(m.id) === String(menu_id)
    );

    if (!found?.image) return "";

    return found.image;
  }

  /* PAYMENT */
  async function handleClosePay() {
    if (!order) return;
    setPaying(true);

    const data = await safeFetch(`${API_BASE}/flutterwave`);

    if (!data?.publicKey) {
      alert("Payment config failed");
      setPaying(false);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;

    script.onload = () => {
      window.FlutterwaveCheckout({
        public_key: data.publicKey,
        tx_ref: "TAB_" + Date.now(),
        amount: Number(order?.total_amount || 0),
        currency: "USD",
        customer: {
          email: "customer@artisan.com",
          name: order?.name || "Customer",
          phone_number: order?.phone || ""
        },
        callback: async (res) => {
  if (res?.status === "successful") {

    const verify = await fetch(`${API_BASE}/closeSession`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        session_code: sessionCode,
        transaction_id: res.transaction_id,
        amount: order?.total_amount
      })
    });

    const result = await verify.json();

    if (result?.status === "success") {

      // ✅ clear local storage
      clearSession();

      // ✅ redirect properly
      window.location.href = `/order-success?order_id=${result.order_id}`;

    } else {
      alert(result?.message || "Payment verification failed");
    }
  }

  setPaying(false);
},
        onclose: () => setPaying(false)
      });
    };

    document.body.appendChild(script);
  }
  
  /* CLOSED SESSION MODAL */
if (sessionBlocked) {
  return (
    <div className="sp-modal-wrapper">

      <div className="sp-modal">
        <h2>Tab Closed</h2>
        <p>{blockMessage}</p>
      </div>

      <button
        className="sp-return-btn"
        onClick={() => navigate("/")}
      >
        GO TO MENU
      </button>

    </div>
  );
}

  /* LOADING */
  if (loading) {
    return (
      <div className="sp-center">
        <div className="sp-spinner" />
        <p>Loading your tab...</p>
      </div>
    );
  }

  /* ERROR */
  if (sessionBlocked) {
    return (
      <div className="sp-center">
        <p className="sp-error">{error}</p>
        <button className="sp-btn" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

  const total = Number(order?.total_amount || 0);

  return (
    <div className="sp-page">

      {/* HEADER */}
      <div className="sp-header">
        <h2 className="sp-title">Your Tab</h2>
        <div className="sp-code">{sessionCode}</div>
        <p className="sp-meta">
          Table {order?.table_no} &nbsp;·&nbsp; {order?.name}
        </p>
      </div>

      {/* ITEMS */}
      <div className="sp-items">
        {items.length === 0 ? (
          <div className="sp-empty">
            No items yet. Add something from the menu!
          </div>
        ) : (
          items.map((item, i) => (
            <div key={i} className="sp-item">

              {/* ✅ FIXED IMAGE (LIKE CART) */}
              {getImage(item.menu_id) && (
                <img
                  src={getImage(item.menu_id)}
                  className="sp-item-img"
                  alt={item.menu_name}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}

              <div className="sp-item-info">
                <div className="sp-item-name">{item.menu_name}</div>
                <div className="sp-item-qty">x{item.quantity}</div>
              </div>

              <div className="sp-item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* TOTAL */}
      <div className="sp-total-box">
        <span>Running Total</span>
        <span className="sp-total-amount">${total.toFixed(2)}</span>
      </div>

      {/* ACTIONS */}
      <div className="sp-actions">

        <button className="sp-btn sp-btn--add" onClick={() => navigate("/")}>
          + ADD MORE ITEMS
        </button>

        <button
          className="sp-btn sp-btn--pay"
          onClick={handleClosePay}
          disabled={paying}
        >
          {paying ? "PROCESSING..." : "CLOSE TAB & PAY"}
        </button>

      </div>

    </div>
  );
}