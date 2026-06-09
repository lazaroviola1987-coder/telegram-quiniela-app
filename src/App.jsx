import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const API_URL = "https://telegram-quiniela-app-production.up.railway.app";

function UserApp() {
  return <div>Tu app de usuario queda aquí. No borres tu código anterior todavía.</div>;
}

function AdminPanel() {
  const [tickets, setTickets] = useState([]);

  const loadTickets = async () => {
    const res = await axios.get(`${API_URL}/api/tickets`);
    setTickets(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`${API_URL}/api/tickets/${id}/status`, { status });
    loadTickets();
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <div style={pageStyle}>
      <h1>👨‍💼 Panel Admin</h1>
      <p>Boletos recibidos: {tickets.length}</p>

      {tickets.map((ticket) => (
        <div key={ticket.id} style={cardStyle}>
          <h3>🎟️ {ticket.id}</h3>
          <p><b>Usuario:</b> {ticket.user}</p>
          <p><b>Referencia:</b> {ticket.reference}</p>
          <p><b>Estado:</b> {ticket.status}</p>
          <p><b>Fecha:</b> {ticket.createdAt}</p>

          {ticket.receipt && (
            <a
              href={`${API_URL}/uploads/${ticket.receipt}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#38bdf8" }}
            >
              📷 Ver comprobante
            </a>
          )}

          <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
            <button
              style={approveBtn}
              onClick={() => updateStatus(ticket.id, "approved")}
            >
              ✅ Aprobar
            </button>

            <button
              style={rejectBtn}
              onClick={() => updateStatus(ticket.id, "rejected")}
            >
              ❌ Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserApp />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#020617",
  color: "white",
  fontFamily: "Arial",
  padding: 16,
};

const cardStyle = {
  background: "#111827",
  border: "1px solid #334155",
  borderRadius: 14,
  padding: 14,
  marginBottom: 14,
};

const approveBtn = {
  flex: 1,
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: "#22c55e",
  color: "white",
  fontWeight: "bold",
};

const rejectBtn = {
  flex: 1,
  padding: 12,
  borderRadius: 10,
  border: "none",
  background: "#ef4444",
  color: "white",
  fontWeight: "bold",
};