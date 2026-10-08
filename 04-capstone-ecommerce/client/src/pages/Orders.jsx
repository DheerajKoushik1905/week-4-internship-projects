import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "../App.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:5204/api";

export default function Orders() {
  const { token } = useStore();
  const [orders,setOrders] = useState([]);

  useEffect(()=>{
    axios.get(`${API}/orders`, {headers:{Authorization:`Bearer ${token}`}})
      .then(({data})=>setOrders(data));
  },[token]);

  return (
    <main className="container">
      <h1>My Orders</h1>
      <div className="grid">
        {orders.map(order=>(
          <article className="card order" key={order._id}>
            <strong>Order {order._id.slice(-6).toUpperCase()}</strong>
            <p>{order.items.length} item(s)</p>
            <p>Total: ₹{order.total.toLocaleString("en-IN")}</p>
            <small>{new Date(order.createdAt).toLocaleString()}</small>
          </article>
        ))}
      </div>
    </main>
  );
}
