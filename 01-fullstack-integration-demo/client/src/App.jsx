import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5201";

export default function App() {
  const [message, setMessage] = useState("Connecting to backend...");
  const [serverTime, setServerTime] = useState("");

  useEffect(() => {
    axios.get(`${API}/api/status`)
      .then(({ data }) => {
        setMessage(data.message);
        setServerTime(data.serverTime);
      })
      .catch(() => setMessage("Could not connect to the backend."));
  }, []);

  return (
    <main className="container">
      <section className="card hero">
        <p className="eyebrow">Week 4</p>
        <h1>React + Node Integration</h1>
        <p>{message}</p>
        {serverTime && <small>Server time: {serverTime}</small>}
      </section>
    </main>
  );
}
