import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./App.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:5202/api";

export default function AuthPage() {
  const [signup, setSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (signup) {
        await axios.post(`${API}/auth/signup`, form);
        setSignup(false);
        setMessage("Account created. Please log in.");
      } else {
        const { data } = await axios.post(`${API}/auth/login`, {
          email: form.email,
          password: form.password
        });
        login(data.token);
        navigate("/");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Request failed");
    }
  };

  return (
    <main className="center">
      <form className="card form" onSubmit={submit}>
        <p className="eyebrow">Authentication</p>
        <h1>{signup ? "Create account" : "Login"}</h1>
        {signup && <input placeholder="Name" value={form.name} onChange={e => setForm({...form,name:e.target.value})} required />}
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} required />
        <input type="password" placeholder="Password" minLength="6" value={form.password} onChange={e => setForm({...form,password:e.target.value})} required />
        <button>{signup ? "Sign up" : "Login"}</button>
        {message && <p>{message}</p>}
        <button type="button" className="secondary" onClick={() => setSignup(!signup)}>
          {signup ? "Already have an account?" : "Create an account"}
        </button>
      </form>
    </main>
  );
}
