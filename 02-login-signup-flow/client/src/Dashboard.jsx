import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./App.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:5202/api";

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get(`${API}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({data}) => setProfile(data))
      .catch(logout);
  }, [token]);

  return (
    <main className="container">
      <section className="card dashboard">
        <p className="eyebrow">Protected Route</p>
        <h1>Welcome {profile?.name || "User"}</h1>
        <p>{profile?.email}</p>
        <button onClick={logout}>Logout</button>
      </section>
    </main>
  );
}
