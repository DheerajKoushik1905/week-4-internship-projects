import { createContext, useContext, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import Cart from "./pages/Cart.jsx";
import Orders from "./pages/Orders.jsx";
import Admin from "./pages/Admin.jsx";

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

function StoreProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("shop_token") || "");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("shop_user") || "null"));
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("shop_cart") || "[]"));

  const saveCart = (next) => { setCart(next); localStorage.setItem("shop_cart", JSON.stringify(next)); };
  const addToCart = (product) => {
    const found = cart.find(item => item._id === product._id);
    saveCart(found
      ? cart.map(item => item._id === product._id ? {...item, qty:item.qty+1} : item)
      : [...cart, {...product, qty:1}]
    );
  };
  const removeFromCart = (id) => saveCart(cart.filter(item => item._id !== id));
  const clearCart = () => saveCart([]);
  const login = (data) => {
    setToken(data.token); setUser(data.user);
    localStorage.setItem("shop_token", data.token);
    localStorage.setItem("shop_user", JSON.stringify(data.user));
  };
  const logout = () => {
    setToken(""); setUser(null);
    localStorage.removeItem("shop_token");
    localStorage.removeItem("shop_user");
  };

  const value = useMemo(() => ({token,user,cart,addToCart,removeFromCart,clearCart,login,logout}), [token,user,cart]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

function Layout() {
  const { user, cart, logout } = useStore();
  return (
    <>
      <nav className="nav">
        <Link to="/" className="brand">Koushik Store</Link>
        <div className="navlinks">
          <Link to="/">Products</Link>
          <Link to="/cart">Cart ({cart.reduce((n,i)=>n+i.qty,0)})</Link>
          {user && <Link to="/orders">Orders</Link>}
          {user?.role === "admin" && <Link to="/admin">Admin</Link>}
          {user ? <button className="linkbtn" onClick={logout}>Logout</button> : <Link to="/auth">Login</Link>}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={user ? <Orders /> : <Navigate to="/auth" replace />} />
        <Route path="/admin" element={user?.role === "admin" ? <Admin /> : <Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <StoreProvider><Layout /></StoreProvider>;
}
