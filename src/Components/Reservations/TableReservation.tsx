import React, { useState, useEffect } from "react";
import "../Css/TableReservation.css";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../Config/api";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function TableReservation() {

const navigate = useNavigate();

const [selectedFloor, setSelectedFloor] = useState("1st");
const [floorsData, setFloorsData] = useState({});
const [bookedTables, setBookedTables] = useState([]);
const [loading, setLoading] = useState(true);

const [modalVisible, setModalVisible] = useState(false);
const [modalLoading, setModalLoading] = useState(false);
const [selectedTable, setSelectedTable] = useState(null);

const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [bookingDate, setBookingDate] = useState(new Date());


/* ================= FETCH TABLES ================= */

useEffect(() => {

const fetchTables = async () => {

try {

const response = await fetch(
        `${API_BASE}/table`
);

const data = await response.json();

setFloorsData(data.floors);


const bookedRes = await fetch(
        `${API_BASE}/getBooked`
);

const bookedData = await bookedRes.json();

setBookedTables(bookedData.booked || []);

setLoading(false);

} catch (error) {

console.error("Error fetching tables:", error);

}

};

fetchTables();

}, []);


/* ================= RESERVE ================= */

const handleReservePress = (table) => {

setSelectedTable(table);
setModalVisible(true);
setModalLoading(true);

setTimeout(() => {

setModalLoading(false);

}, 1000);

};


/* ================= SUBMIT BOOKING ================= */

const handleBookingSubmit = () => {

const mysqlDate = bookingDate
.toISOString()
.slice(0,19)
.replace("T"," ");

navigate("/flutterwave", {
  state: {
    tableId: selectedTable?.id,
    name: fullName,
    email,
    phone,
    bookingDate: mysqlDate,
    amount: selectedTable?.amount
  }
});

setModalVisible(false);

};



/* ================= UI ================= */

return (

<div className="container">

<div className="topBar">

<button className="circleBtn">←</button>

</div>


<h2 className="title">Reserve a Table</h2>


<div className="chipRow">

{Object.keys(floorsData).map((floor) => (

<button
key={floor}
className={
selectedFloor === floor
? "floorBtn active"
: "floorBtn"
}
onClick={() => setSelectedFloor(floor)}
>

{floor} Floor Reserve

</button>

))}

</div>


<div className="tableList">

{floorsData[selectedFloor]?.map((table) => {

const isBooked = bookedTables.includes(table.id);

return (

<div key={table.id} className="card">

<img src={table.image} className="cardImage"/>

<div className="overlay"/>

<div className="statusBadge">

{isBooked ? (

<button className="bookedBtn">

BOOKED

</button>

) : (

<span className="available">

AVAILABLE

</span>

)}

</div>


<div className="cardOverlay">

<h2>Table {table.number}</h2>

<p>Seats: {table.seats}</p>

<p className="price">

Reservation Fee: ${table.amount.toLocaleString()}

</p>

<p>{table.description}</p>

</div>


{!isBooked && (

<button
className="arrowBtn"
onClick={() => handleReservePress(table)}
>

Reserve this Table →

</button>

)}

</div>

);

})}

</div>


{/* ================= MODAL ================= */}

{modalVisible && (

<div className="modalOverlay">

<div className="modalContent">

{modalLoading ? (

<div className="spinner"></div>

) : (

<>

<div className="modalHeaderRow">

<span className="modalTableTitle">
Booking Table {selectedTable?.number}
</span>

<span className="modalPrice">
For ${selectedTable?.amount?.toLocaleString()}
</span>

</div>

<p className="modalSeats">
Seats: {selectedTable?.seats}
</p>

<p className="modalDescription">
{selectedTable?.description}
</p>


<label className="modalLabel">Full Name</label>
<input
placeholder="Enter your full name"
value={fullName}
onChange={(e)=>setFullName(e.target.value)}
/>

<label className="modalLabel">Email</label>
<input
placeholder="Enter your email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<label className="modalLabel">Phone</label>
<PhoneInput
  international
  defaultCountry="NG"
  value={phone}
  onChange={setPhone}
  placeholder="Enter phone number"
  className="phone-input"
/>

<label className="modalLabel">Reservation Date & Time</label>
<input
type="datetime-local"
placeholder="Select reservation date and time"
onChange={(e)=>setBookingDate(new Date(e.target.value))}
/>

<button
className="submitBtn"
onClick={handleBookingSubmit}
>

Submit Booking

</button>

<button
className="cancelBtn"
onClick={()=>setModalVisible(false)}
>

Cancel

</button>

</>

)}

</div>

</div>

)}


</div>

);

}
