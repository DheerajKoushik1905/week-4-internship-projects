import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "../App.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:5204/api";

export default function Admin() {
  const {token} = useStore();
  const [products,setProducts] = useState([]);
  const [form,setForm] = useState({name:"",description:"",price:"",category:"General"});

  const load=()=>axios.get(`${API}/products`).then(({data})=>setProducts(data));
  useEffect(()=>{load();},[]);

  const add=async e=>{
    e.preventDefault();
    await axios.post(`${API}/products`, {...form,price:Number(form.price)}, {headers:{Authorization:`Bearer ${token}`}});
    setForm({name:"",description:"",price:"",category:"General"});
    load();
  };

  const remove=async id=>{
    await axios.delete(`${API}/products/${id}`, {headers:{Authorization:`Bearer ${token}`}});
    load();
  };

  return (
    <main className="container">
      <h1>Admin Dashboard</h1>
      <form className="card adminform" onSubmit={add}>
        <input placeholder="Product name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
        <input placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required />
        <input type="number" min="0" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required />
        <input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} required />
        <button>Add Product</button>
      </form>

      <div className="grid admin-grid">
        {products.map(p=>(
          <article className="card product admin-product" key={p._id}>
            <h3>{p.name}</h3>
            <p>₹{p.price.toLocaleString("en-IN")}</p>
            <button className="danger" onClick={()=>remove(p._id)}>Delete</button>
          </article>
        ))}
      </div>
    </main>
  );
}
