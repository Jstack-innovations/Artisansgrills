import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { API_BASE } from "../Config/api";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [order, setOrder] = useState<any>(null);
  const [menu, setMenu] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showTrackModal, setShowTrackModal] = useState(false);

  // Fetch order
  useEffect(() => {
    if (!orderId) {
      alert("Order ID missing");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders?order_id=${orderId}`);
        const data = await res.json();
        if (data.status === "success") setOrder(data.order);
        else alert("Order not found");
      } catch (err) {
        console.error(err);
        alert("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Fetch menu.json
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${API_BASE}/menu`);
        const data = await res.json();
        setMenu(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMenu();
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: 50 }}>Loading...</div>;
  if (!order) return null;

  const getImage = (menu: any, menuId: number) => {
    for (const category of Object.values(menu)) {
      for (const item of category as any[]) {
        if (item.id === menuId) return item.image;
      }
    }
    return "https://jstack-sigma.vercel.app/artisangrill/default.png";
  };

  const qrValue = `${window.location.origin}/order-success?order_id=${order.id}\nPlate: ${order.plate_order_no}`;

  return (
    <div style={{ position: "relative", minHeight: "100vh", color: "#fff", fontFamily: "'Segoe UI', 'Poppins', sans-serif" }}>
      {/* Background */}
      <img
        src="https://jstack-sigma.vercel.app/artisangrill/reciept.jpeg"
        alt="background"
        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(1.5px)" }}
      />
      <div style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)" }} />

      <div style={{ position: "relative", padding: 20 }}>
        <h4 style={{ textAlign: "center", color: "beige" }}>Order Successful!</h4>
        <img src="https://i.gifer.com/7efs.gif" alt="success" style={{ display: "block", margin: "0 auto", width: 100, height: 100 }} />
        <p style={{ textAlign: "center" }}>Thank you, {order.name}</p>

        {/* Order Info */}
        <div style={{ backgroundColor: "rgba(34,34,34,0.8)", padding: 15, borderRadius: 12, marginTop: 20 }}>
          <p><b>Order ID:</b> {order.id}</p>
          <p><b>Plate No:</b> {order.plate_order_no}</p>
          {order.order_type === "table" && <p><b>Table:</b> {order.table_no}</p>}
          <p><b>Phone:</b> {order.phone}</p>
          <p><b>Order Type:</b> {order.order_type}</p>
          {order.order_type === "delivery" && <p><b>Address:</b> {order.full_address}</p>}
          {order.order_type === "pickup" && order.pickup_time && <p><b>Pickup Time:</b> {order.pickup_time}</p>}
<p><b>Total:</b> USD{order.total_amount}</p>
</div>

<h2 style={{ textAlign: "center", marginTop: 20 }}>Order Items</h2>
{order.items.map((item: any) => (
  <div
    key={item.menu_id}
    style={{
      display: "flex",
      alignItems: "center",
      backgroundColor: "rgba(17,17,17,0.8)",
      padding: 10,
      borderRadius: 10,
      margin: "8px 0"
    }}
  >
    <img
      src={getImage(menu, item.menu_id)}
      alt=""
      style={{ width: 60, height: 60, borderRadius: 10 }}
    />

    <div style={{ marginLeft: 10 }}>
      <p style={{ fontWeight: "bold", color: "#fff" }}>
        {item.menu_name}
      </p>
      <p style={{ color: "#aaa" }}>
        Quantity: {item.quantity}
      </p>
    </div>
  </div>
))}

{/* QR Code */}
<div style={{ textAlign: "center", marginTop: 20 }}>
  <QRCodeCanvas value={qrValue} size={120} fgColor="#fff" bgColor="transparent" />
</div>

        {/* Print Button */}
        <button
          style={{ marginTop: 20, padding: 15, borderRadius: 12, backgroundColor: "peru", fontWeight: "bold", width: "100%" }}
          onClick={() => window.print()}
        >
          Print Receipt
        </button>

        {/* Track Order Button triggers modal */}
        {order.order_type === "delivery" && (
          <button
            style={{ marginTop: 15, padding: 15, borderRadius: 12, backgroundColor: "beige", color: "#000", fontWeight: "bold", width: "100%" }}
            onClick={() => setShowTrackModal(true)}
          >
            Track Order
          </button>
        )}


                {/* Back To Menu Button */}
        <button
          style={{ marginTop: 20, padding: 15, borderRadius: 12, backgroundColor: "orangered", fontWeight: "bold", width: "100%" }}
          >
          Back To Menu
        </button>

        
      </div>

      {/* ⭐ Custom Modal */}
{/* ⭐ Fancy Track Order Modal with Glowing Buttons */}
{showTrackModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      backdropFilter: "blur(5px)",
      backgroundColor: "rgba(0,0,0,0.65)",
      opacity: 0,
      animation: "fadeIn 0.3s forwards",
    }}
  >
    <style>
      {`
        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes slideUp { to { transform: translateY(0); } }

        .modal-button {
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: bold;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        .modal-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); /* glowing effect */
        }
      `}
    </style>

    <div
      style={{
        background: "#000",
        padding: 30,
        borderRadius: 20,
        width: "90%",
        maxWidth: 400,
        textAlign: "center",
        fontFamily: "'Sacramento', cursive",
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        transform: "translateY(-20px)",
        animation: "slideUp 0.3s forwards",
      }}
    >
      <h2 style={{ color: "beige", fontSize: 34, marginBottom: 15 }}>
        Track Your Order
      </h2>
      <p style={{ color: "#fff", marginBottom: 25, fontSize: 16 }}>
        To track your order with convenience, please get our <b>Artisangrill</b> mobile app from Google Playstore or App Store.
      </p>

    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 15, marginBottom: 20 }}>
  {/* Google Play Store */}
  <a
    href="https://play.google.com/store/apps/details?id=com.artisangrill"
    target="_blank"
    rel="noopener noreferrer"
    className="modal-button"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      background: "#000",
      color: "#f7c77a",
      padding: "10px 15px",
      borderRadius: 12,
      border: "1px solid #f7c77a",
      flex: "1 1 calc(50% - 10px)",
      textDecoration: "none"
    }}
  >
    <img
      src="https://jstack-sigma.vercel.app/artisangrill/playstore.png"
      alt="Play Store"
      style={{ width: 24, height: 24 }}
    />
    <span>Google Play</span>
  </a>

  {/* Apple App Store */}
  <a
    href="https://apps.apple.com/app/id123456789" // replace with actual App Store link
    target="_blank"
    rel="noopener noreferrer"
    className="modal-button"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      background: "#000",
      color: "#f7c77a",
      border: "1px solid #f7c77a",
      padding: "10px 15px",
      borderRadius: 12,
      flex: "1 1 calc(50% - 10px)",
      textDecoration: "none"
    }}
  >
    <img
      src="https://jstack-sigma.vercel.app/artisangrill/appstore.png"
      alt="App Store"
      style={{ width: 24, height: 24 }}
    />
    <span>App Store</span>
  </a>

  {/* Dropbox APK Download */}
  <a
    href="https://www.dropbox.com/scl/fo/8mt0tq77h2ipksu2k31kq/APYA1CH5jblorXk3rlwaPpM?rlkey=2kkkiynh6vqz8by3dnkivu766&st=s30d9e0t&dl=1"
    target="_blank"
    rel="noopener noreferrer"
    className="modal-button"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      background: "#000",
      color: "#f7c77a",
      border: "1px solid #f7c77a",
      padding: "10px 15px",
      borderRadius: 12,
      flex: "1 1 calc(50% - 10px)",
      textDecoration: "none"
    }}
  >
    <img
      src="https://jstack-sigma.vercel.app/artisangrill/dropbox.png"
      alt="Dropbox"
      style={{ width: 24, height: 24 }}
    />
    <span>Download APK</span>
  </a>
</div>

      <button
        onClick={() => setShowTrackModal(false)}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 12,
          background: "#555",
          color: "#fff",
          fontWeight: "bold",
          transition: "background 0.2s, box-shadow 0.3s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#777")}
        onMouseLeave={e => (e.currentTarget.style.background = "#555")}
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}
