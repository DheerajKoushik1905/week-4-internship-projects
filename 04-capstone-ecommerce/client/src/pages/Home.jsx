import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "../App.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:5204/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const { addToCart } = useStore();

  useEffect(() => {
    axios.get(`${API}/products`).then(({data}) => setProducts(data));
  }, []);

  const visible = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="container">
      <section className="hero">
        <p className="eyebrow">Week 4 Capstone</p>
        <h1>Modern essentials for everyday work.</h1>
        <p>Full-stack MERN e-commerce application with authentication, cart, orders, and admin product control.</p>
        <input placeholder="Search products..." value={query} onChange={e=>setQuery(e.target.value)} />
      </section>

      <section className="grid product-grid">
        {visible.map(product => (
          <article className="card product" key={product._id}>
            <div className="product-image">{product.image || product.name[0]}</div>
            <p className="muted">{product.category}</p>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <strong>₹{product.price.toLocaleString("en-IN")}</strong>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </article>
        ))}
      </section>
    </main>
  );
}
