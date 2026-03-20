import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import './index.css'

import App from './App.tsx'

import TableReservation from "./Components/Reservations/TableReservation.jsx"
import FlutterwavePage from "./Components/Reservations/FlutterwavePage.jsx"
import ReservationSuccess from "./Components/Reservations/ReservationSuccess.jsx"

import CartSidebar from "./Components/CartSidebar.tsx"
import DeliveryOrderModal from "./Components/DeliveryOrderModal.tsx"
import FlutterwaveWebPayment from "./Components/FlutterwaveWebPayment.tsx"
import Menu from "./Components/Menu.tsx"
import MenuModal from "./Components/MenuModal.tsx"
import OrderSuccess from "./Components/OrderSuccess.tsx"
import OrderTypeModal from "./Components/OrderTypeModal.tsx"
import PickupOrderModal from "./Components/PickupOrderModal.tsx"
import TableOrderModal from "./Components/TableOrderModal.tsx"





const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />

          <Route path="/reservations" element={<TableReservation />} />
          <Route path="/flutterwave" element={<FlutterwavePage />} />
          <Route path="/reservation-success" element={<ReservationSuccess />} />
         
          
          <Route path="/cart" element={<CartSidebar />} />
          <Route path="/deliveryOrder" element={<DeliveryOrderModal />} />
          <Route path="/flutterwaveMenu" element={<FlutterwaveWebPayment />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menuModal" element={<MenuModal />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orderType" element={<OrderTypeModal />} />
          <Route path="/pickupOrder" element={<PickupOrderModal />} /> 
          <Route path="/tableOrder" element={<TableOrderModal />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}
