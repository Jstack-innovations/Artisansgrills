import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "../../Config/api";

export default function FlutterwavePage(){

const location = useLocation();
const navigate = useNavigate();

const booking = location.state;



const hasRun = useRef(false);

useEffect(()=>{

if(hasRun.current) return;
hasRun.current = true;

if(!booking){
navigate("/");
return;
}




const initPayment = async () => {

const res = await fetch(
        `${API_BASE}/flutterwave`
);

const key = await res.json();

/* Create flutterwave script */
const script = document.createElement("script");
script.src = "https://checkout.flutterwave.com/v3.js";
script.async = true;

script.onload = () => {

/* Start Flutterwave checkout */
window.FlutterwaveCheckout({

public_key: key.publicKey,

tx_ref: "TABLE_" + Date.now(),

amount: Number(booking.amount),

currency: "NGN",

customer:{
email: booking.email,
phone_number: booking.phone,
name: booking.name
},

callback: async function(data){

if(data.status === "successful"){

const res = await fetch(
        `${API_BASE}/bookTable`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({
...booking,
transaction_id:data.transaction_id
})
}
);

const result = await res.json();

if(result.success){

/* FULL redirect (URL + UI) */
window.location.replace(
"/reservation-success?reservation_id=" + result.reservation_id
);

}else{
alert("Booking failed");
}

}

},

onclose: function(){
navigate("/reservations");
}

});

};

document.body.appendChild(script);

};

initPayment();

},[]);

return (
<div style={{
position:"fixed",
inset:0,
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#000",
flexDirection:"column",
zIndex:9999
}}>
<div className="spinner"></div>
</div>
);

}
