import axios from "axios";
import { useMemo, useState } from "react";
import { useStore } from "../App.jsx";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5204/api";

export default function Cart() {
  const {cart,removeFromCart,clearCart,token,user} = useStore();
  const [message,setMessage] = useState("");
  const navigate = useNavigate();
  const total = useMemo(()=>cart.reduce((sum,i)=>sum+i.price*i.qty,0),[cart]);

  const checkout = async () => {
    if (!user) return navigate("/auth");
    try {
      await axios.post(`${API}/orders`, {
        items: cart.map(i=>({product:i._id,qty:i.qty})),
      }, {headers:{Authorization:`Bearer ${token}`}});
      clearCart();
      setMessage("Order placed successfully.");
    } catch(err) {
      setMessage(err.response?.data?.message || "Order failed");
    }
  };

  return (
    <main className="container">
      <h1>Your Cart</h1>
      <section className="card cartbox">
        {cart.length===0 ? <p>Your cart is empty.</p> : cart.map(item=>(
          <div className="cartrow" key={item._id}>
            <div><strong>{item.name}</strong><br/><small>Qty: {item.qty}</small></div>
            <span>₹{(item.price*item.qty).toLocaleString("en-IN")}</span>
            <button className="danger" onClick={()=>removeFromCart(item._id)}>Remove</button>
          </div>
        ))}
        <h2>Total: ₹{total.toLocaleString("en-IN")}</h2>
        {cart.length>0 && <button onClick={checkout}>Place Order</button>}
        {message && <p>{message}</p>}
      </section>
    </main>
  );
}
