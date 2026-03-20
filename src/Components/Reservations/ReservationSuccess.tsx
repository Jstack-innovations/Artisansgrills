import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { API_BASE } from "../../Config/api";

export default function ReservationSuccess(){

const navigate = useNavigate();
const [searchParams] = useSearchParams();

const reservationId = searchParams.get("reservation_id");

const [reservation,setReservation] = useState(null);
const [table,setTable] = useState(null);
const [loading,setLoading] = useState(true);

useEffect(()=>{

if(!reservationId){
navigate("/");
return;
}

const fetchData = async () => {

try{

/* ⭐ Reservation Data */
const res = await fetch(    `${API_BASE}/reservationSuccess?id=${reservationId}`
);

const data = await res.json();

if(!data.success){
navigate("/");
return;
}

const reservationData = data.reservation;
setReservation(reservationData);

/* ⭐ Table Data */
const tableRes = await fetch(
    `${API_BASE}/table`
);

const tableJson = await tableRes.json();

/* ⭐ Find Table */
let foundTable = null;

Object.values(tableJson.floors).forEach(floor=>{
floor.forEach(t=>{
if(t.id === reservationData.tableId){
foundTable = t;
}
});
});

setTable(foundTable);

}catch(err){
console.error(err);
navigate("/");
}

setLoading(false);

};

fetchData();

},[]);

if(loading){
return(
<div style={{
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#000"
}}>
<div className="spinner"></div>
</div>
);
}

if(!reservation) return null;

const qrValue =
`Reservation Code: ${reservation.reservation_code}
Transaction: ${reservation.transaction_id}`;

return(

<div style={{
minHeight:"100vh",
color:"#fff",
position:"relative",
display:"flex",
justifyContent:"center",
alignItems:"center"
}}>

{/* ⭐ GLOBAL FONT STYLE */}
<style>
{`
*{
font-family: 'Segoe UI', 'Poppins', sans-serif;
}

.sacramentoText{
font-family: 'Sacramento', cursive;
}
`}
</style>

{/* Background */}
<img
src="https://jstack-sigma.vercel.app/artisangrill/reciept.jpeg"
style={{
position:"fixed",
width:"100%",
height:"100%",
objectFit:"cover",
zIndex:-2
}}
/>

<div style={{
position:"fixed",
inset:0,
background:"rgba(0,0,0,.55)",
zIndex:-1
}}/>

<div style={{
width:"100%",
maxWidth:600,
padding:20
}}>

<h1 style={{
textAlign:"center",
color:"beige"
}}>
Reservation Successful
</h1>

<img
src="https://i.gifer.com/7efs.gif"
style={{
width:80,
display:"block",
margin:"auto"
}}
/>

<p style={{
textAlign:"center",
marginBottom:25
}}>
Thank you, {reservation.name}
</p>

{/* ⭐ Table Card Overlay */}
{table && (
<div style={{
position:"relative",
borderRadius:20,
overflow:"hidden",
marginBottom:30
}}>

<img
src={table.image}
style={{
width:"100%",
height:230,
objectFit:"cover"
}}
/>

<div style={{
position:"absolute",
inset:0,
background:"linear-gradient(to top, rgba(0,0,0,.95), transparent)",
display:"flex",
flexDirection:"column",
justifyContent:"flex-end",
padding:20
}}>

<h2 className="sacramentoText"
style={{
fontSize:36,
marginBottom:5
}}>
Table {table.number}
</h2>

<p>Seats: {table.seats}</p>
<p>Price: ₦{table.amount}</p>
<p>{table.description}</p>

</div>

</div>
)}

{/* Reservation Info */}
<div style={{
background:"rgba(0,0,0,.6)",
padding:20,
borderRadius:15
}}>

<p>Reservation Code: {reservation.reservation_code}</p>
<p>Transaction ID: {reservation.transaction_id}</p>
<p>Amount: ₦{reservation.amount}</p>
<p>Booking Date: {reservation.bookingDate}</p>

</div>

{/* QR Code */}
<div style={{
textAlign:"center",
marginTop:30
}}>

<QRCodeCanvas
value={qrValue}
size={120}
bgColor="transparent"
fgColor="#fff"
/>

</div>

<button
onClick={()=>window.print()}
style={{
marginTop:25,
width:"100%",
padding:15,
background:"peru",
border:"none",
borderRadius:10,
fontWeight:"bold"
}}>
Print Receipt
</button>

</div>

</div>
);
}
