import { useState } from "react";

const partidosData = [
  ["🇧🇷 Brazil", "🇲🇦 Marruecos"],
  ["🇭🇹 Haiti", "🏴 Escocia"],
  ["🇩🇪 Alemania", "🇨🇼 Curacao"],
  ["🇳🇱 Holanda", "🇯🇵 Japón"],
  ["🇨🇮 Costa de Marfil", "🇪🇨 Ecuador"],
  ["🇸🇪 Suecia", "🇹🇳 Túnez"],
  ["🇪🇸 España", "🇨🇻 Cabo Verde"],
  ["🇧🇪 Bélgica", "🇪🇬 Egipto"],
  ["🇸🇦 Arabia Saudita", "🇺🇾 Uruguay"],
  ["🇫🇷 Francia", "🇸🇳 Senegal"],
  ["🇮🇶 Iraq", "🇳🇴 Noruega"],
  ["🇦🇷 Argentina", "🇩🇿 Argelia"],
  ["🇵🇹 Portugal", "🇨🇬 Congo"],
  ["🏴 Inglaterra", "🇭🇷 Croacia"],
];

export default function App() {
  const [picks, setPicks] = useState({});

  const select = (matchIndex, value) => {
    setPicks({
      ...picks,
      [matchIndex]: value,
    });
  };

  const totalSelected = Object.keys(picks).length;

  const totalDoubles = Object.values(picks).filter(
    (v) => v === "1X" || v === "X2"
  ).length;

  const isValid = totalSelected === 14 && totalDoubles === 2;

  const btnStyle = {
    padding: 10,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "#334155",
    color: "white",
  };

  const btnStyleYellow = {
    padding: 10,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "#facc15",
    color: "black",
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial",
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* HEADER */}
      <h2 style={{ textAlign: "center" }}>
        🏆 PROMOCIÓN MUNDIAL
      </h2>

      <h3 style={{ textAlign: "center", color: "#38bdf8" }}>
        💰 Premio: $100,000
      </h3>

      <hr style={{ opacity: 0.2 }} />

      {/* CONTADORES */}
      <h3>📊 Progreso del boleto</h3>

      <h4>✔ Seleccionados: {totalSelected} / 14</h4>
      <h4>🔄 Dobles: {totalDoubles} / 2</h4>

      <hr style={{ opacity: 0.2 }} />

      {/* PARTIDOS */}
      {partidosData.map((p, i) => (
        <div
          key={i}
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            padding: 12,
            marginBottom: 12,
            borderRadius: 12,
          }}
        >
          {/* PARTIDO */}
          <h3 style={{ textAlign: "center" }}>
            {p[0]} 🆚 {p[1]}
          </h3>

          {/* SELECCIÓN NORMAL */}
          <h4 style={{ color: "#38bdf8" }}>🎯 Selección normal</h4>

          <button
            onClick={() => select(i, "1")}
            style={btnStyle}
          >
            {p[0]} (1)
          </button>

          <button
            onClick={() => select(i, "2")}
            style={{ ...btnStyle, marginLeft: 10 }}
          >
            {p[1]} (2)
          </button>

          {/* DOBLE OPORTUNIDAD */}
          <h4 style={{ marginTop: 10, color: "#facc15" }}>
            🔄 Doble oportunidad
          </h4>

          <button
            onClick={() => select(i, "1X")}
            style={btnStyleYellow}
          >
            1X
          </button>

          <button
            onClick={() => select(i, "X2")}
            style={{ ...btnStyleYellow, marginLeft: 10 }}
          >
            X2
          </button>

          {/* SELECCIÓN ACTUAL */}
          <p style={{ marginTop: 10, color: "#94a3b8" }}>
            Selección:{" "}
            <b style={{ color: "white" }}>
              {picks[i] || "Ninguna"}
            </b>
          </p>
        </div>
      ))}

      {/* BOTÓN CONFIRMAR */}
      <button
        disabled={!isValid}
        style={{
          marginTop: 20,
          padding: 15,
          width: "100%",
          backgroundColor: isValid ? "#22c55e" : "#64748b",
          color: "white",
          fontSize: 18,
          border: "none",
          borderRadius: 10,
          cursor: isValid ? "pointer" : "not-allowed",
        }}
      >
        CONFIRMAR BOLETO
      </button>

      {/* MENSAJE ERROR */}
      {!isValid && (
        <p style={{ color: "#f87171", textAlign: "center" }}>
          ⚠ Debes completar 14 partidos y exactamente 2 dobles oportunidades
        </p>
      )}
    </div>
  );
}