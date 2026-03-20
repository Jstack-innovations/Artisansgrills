import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import './index.css'

import App from './App.tsx'

import TableReservation from "./Components/Reservations/TableReservation.jsx"
import FlutterwavePage from "./Components/Reservations/FlutterwavePage.jsx"
import ReservationSuccess from "./Components/Reservations/ReservationSuccess.jsx"
import OrderSuccess from "./Components/OrderSuccess.jsx"





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
          <Route path="/order-success" element={<OrderSuccess />} />
                  </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}
