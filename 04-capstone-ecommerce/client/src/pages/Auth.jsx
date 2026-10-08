import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStore } from "../App.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:5204/api";

export default function Auth() {
  const [signup, setSignup] = useState(false);
  const [form, setForm] = useState({name:"",email:"",password:""});
  const [message, setMessage] = useState("");
  const { login } = useStore();
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setMessage("");
    try {
      if (signup) {
        await axios.post(`${API}/auth/signup`, form);
        setSignup(false);
        setMessage("Account created. Please log in.");
      } else {
        const {data} = await axios.post(`${API}/auth/login`, {email:form.email,password:form.password});
        login(data);
        navigate("/");
      }
    } catch(err) {
      setMessage(err.response?.data?.message || "Request failed");
    }
  };

  return (
    <main className="center">
      <form className="card authform" onSubmit={submit}>
        <p className="eyebrow">Account</p>
        <h1>{signup ? "Create account" : "Welcome back"}</h1>
        {signup && <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />}
        <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
        <input type="password" placeholder="Password" minLength="6" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
        <button>{signup ? "Sign Up" : "Login"}</button>
        {message && <p>{message}</p>}
        <button type="button" className="secondary" onClick={()=>setSignup(!signup)}>
          {signup ? "Already registered?" : "Create an account"}
        </button>
      </form>
    </main>
  );
}
