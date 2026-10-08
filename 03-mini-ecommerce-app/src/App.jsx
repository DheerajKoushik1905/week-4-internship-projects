import { useMemo, useState } from "react";

const products = [
  { id: 1, name: "Wireless Headphones", price: 2499, category: "Audio" },
  { id: 2, name: "Mechanical Keyboard", price: 3299, category: "Accessories" },
  { id: 3, name: "Smart Watch", price: 4999, category: "Wearables" },
  { id: 4, name: "USB-C Hub", price: 1799, category: "Accessories" }
];

export default function App() {
  const [cart, setCart] = useState([]);

  const add = (product) => {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      return found
        ? prev.map(item => item.id === product.id ? {...item, qty:item.qty+1} : item)
        : [...prev, {...product, qty:1}];
    });
  };

  const remove = (id) => setCart(prev => prev.filter(item => item.id !== id));

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);

  return (
    <main className="container">
      <header className="topbar">
        <div>
          <p className="eyebrow">Week 4 Practice</p>
          <h1>Mini E-Commerce</h1>
        </div>
        <strong>Cart: {cart.reduce((n, item) => n + item.qty, 0)} items</strong>
      </header>

      <section className="grid products">
        {products.map(product => (
          <article className="card product" key={product.id}>
            <div className="placeholder">{product.name[0]}</div>
            <p className="muted">{product.category}</p>
            <h3>{product.name}</h3>
            <strong>₹{product.price.toLocaleString("en-IN")}</strong>
            <button onClick={() => add(product)}>Add to Cart</button>
          </article>
        ))}
      </section>

      <section className="card cart">
        <h2>Your Cart</h2>
        {cart.length === 0 ? <p>Your cart is empty.</p> : cart.map(item => (
          <div className="cart-row" key={item.id}>
            <span>{item.name} × {item.qty}</span>
            <span>₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
            <button className="danger" onClick={() => remove(item.id)}>Remove</button>
          </div>
        ))}
        <h3>Total: ₹{total.toLocaleString("en-IN")}</h3>
      </section>
    </main>
  );
}
