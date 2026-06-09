import { useState } from "react";
import axios from "axios";

const partidosData = [
  ["🇧🇷", "Brazil", "🇲🇦", "Marruecos"],
  ["🇭🇹", "Haiti", "🏴", "Escocia"],
  ["🇩🇪", "Alemania", "🇨🇼", "Curacao"],
  ["🇳🇱", "Holanda", "🇯🇵", "Japón"],
  ["🇨🇮", "Costa de Marfil", "🇪🇨", "Ecuador"],
  ["🇸🇪", "Suecia", "🇹🇳", "Túnez"],
  ["🇪🇸", "España", "🇨🇻", "Cabo Verde"],
  ["🇧🇪", "Bélgica", "🇪🇬", "Egipto"],
  ["🇸🇦", "Arabia Saudita", "🇺🇾", "Uruguay"],
  ["🇫🇷", "Francia", "🇸🇳", "Senegal"],
  ["🇮🇶", "Iraq", "🇳🇴", "Noruega"],
  ["🇦🇷", "Argentina", "🇩🇿", "Argelia"],
  ["🇵🇹", "Portugal", "🇨🇬", "Congo"],
  ["🏴", "Inglaterra", "🇭🇷", "Croacia"],
];

export default function App() {
  const [picks, setPicks] = useState({});
  const [screen, setScreen] = useState("ticket");
  const [reference, setReference] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [savedTicket, setSavedTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalSelected = Object.keys(picks).length;
  const totalDoubles = Object.values(picks).filter(
    (v) => v === "1X" || v === "X2"
  ).length;

  const isValid = totalSelected === 14 && totalDoubles === 2;
  const progress = Math.round((totalSelected / 14) * 100);

  const copyText = async (text, message) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(message);
    } catch {
      alert("No se pudo copiar. Copia manualmente.");
    }
  };

  const select = (index, value) => {
    const currentValue = picks[index];
    const isDouble = value === "1X" || value === "X2";
    const currentIsDouble = currentValue === "1X" || currentValue === "X2";

    if (isDouble && !currentIsDouble && totalDoubles >= 2) {
      alert("Solo puedes seleccionar 2 dobles oportunidades.");
      return;
    }

    setPicks({ ...picks, [index]: value });
  };

  const sendReceipt = async () => {
    if (!reference.trim() || !receipt) {
      alert("Debes escribir la referencia y subir la captura.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("user", "Invitado");
    formData.append("reference", reference);
    formData.append("picks", JSON.stringify(picks));
    formData.append("receipt", receipt);

    try {
      const response = await axios.post(
        "https://telegram-quiniela-app-production.up.railway.app/api/tickets"
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSavedTicket(response.data.ticket);
      setScreen("success");
    } catch (error) {
      console.error(error);
      alert("Error enviando el comprobante. Verifica que el backend esté funcionando.");
    } finally {
      setLoading(false);
    }
  };

  const optionStyle = (selected, type) => ({
    flex: 1,
    padding: "12px 0",
    borderRadius: 12,
    border: "1px solid #334155",
    fontWeight: "bold",
    fontSize: 15,
    cursor: "pointer",
    color: selected ? "#020617" : "white",
    background: selected
      ? type === "double"
        ? "#facc15"
        : "#22c55e"
      : "#1e293b",
  });

  if (screen === "success") {
    return (
      <div style={pageStyle}>
        <div style={headerCard}>
          <h2>🎟️ Boleto recibido</h2>
          <h1 style={{ color: "#facc15" }}>Pendiente de validación</h1>
          <p>Tu comprobante fue enviado correctamente.</p>
        </div>

        <div style={cardStyle}>
          <p>
            <b>Ticket:</b> {savedTicket?.id || "Pendiente"}
          </p>
          <p>
            <b>Estado:</b> 🟡 Pago pendiente de revisión
          </p>
          <p>
            <b>Referencia:</b> {reference}
          </p>
          <p>
            <b>Comprobante:</b> {receipt?.name}
          </p>
          <p>
            <b>Selecciones:</b> {totalSelected}/14
          </p>
          <p>
            <b>Dobles:</b> {totalDoubles}/2
          </p>

          <button style={mainButton} onClick={() => setScreen("ticket")}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (screen === "receipt") {
    const canSend = reference.trim().length >= 3 && receipt && !loading;

    return (
      <div style={pageStyle}>
        <div style={headerCard}>
          <h2>📤 Enviar comprobante</h2>
          <p>Sube la captura del pago y escribe tu referencia.</p>
        </div>

        <div style={cardStyle}>
          <label>
            <b>📝 Referencia de pago</b>
          </label>
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Escribe la referencia del pago"
            style={inputStyle}
          />

          <label>
            <b>📸 Captura del comprobante</b>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setReceipt(e.target.files[0])}
            style={fileInputStyle}
          />

          {receipt && (
            <p style={{ color: "#22c55e" }}>
              ✅ Archivo seleccionado: {receipt.name}
            </p>
          )}

          <button
            disabled={!canSend}
            style={{
              ...mainButton,
              background: canSend ? "#22c55e" : "#475569",
              cursor: canSend ? "pointer" : "not-allowed",
            }}
            onClick={sendReceipt}
          >
            {loading ? "Enviando..." : "✅ ENVIAR COMPROBANTE"}
          </button>

          <button style={secondaryButton} onClick={() => setScreen("payment")}>
            Volver al pago
          </button>
        </div>
      </div>
    );
  }

  if (screen === "payment") {
    return (
      <div style={pageStyle}>
        <div style={headerCard}>
          <h2>💳 Pago del boleto</h2>
          <h1 style={{ color: "#facc15" }}>$1,000</h1>
          <p>Realiza el pago para validar tu jugada.</p>
        </div>

        <div style={cardStyle}>
          <h3>📌 Instrucciones</h3>
          <p>1. Copia los datos de pago.</p>
          <p>2. Realiza el pago.</p>
          <p>3. Toma captura y envía el comprobante.</p>

          <div style={paymentBox}>
            <h3 style={{ color: "#facc15", marginTop: 0 }}>
              💳 Datos para el pago
            </h3>

            <p>
              <b>Importe:</b> $1,000
            </p>

            <div style={copyBox}>
              <b>Tarjeta:</b>
              <div style={copyRow}>
                <span style={copyTextStyle}>9205 1299 7241 1939</span>
                <button
                  onClick={() =>
                    copyText("9205129972411939", "Tarjeta copiada")
                  }
                  style={copyButton}
                >
                  📋 Copiar
                </button>
              </div>
            </div>

            <div style={copyBox}>
              <b>Número de confirmación:</b>
              <div style={copyRow}>
                <span style={copyTextStyle}>50156374</span>
                <button
                  onClick={() => copyText("50156374", "Número copiado")}
                  style={copyButton}
                >
                  📋 Copiar
                </button>
              </div>
            </div>

            <p style={{ color: "#facc15" }}>
              ⚠️ Conserva el comprobante para validar tu boleto.
            </p>

            <p>
              <b>Estado:</b> 🟡 Pendiente de pago
            </p>
          </div>

          <button style={mainButton} onClick={() => setScreen("receipt")}>
            ✅ YA REALICÉ EL PAGO
          </button>

          <button style={secondaryButton} onClick={() => setScreen("ticket")}>
            Volver al boleto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={headerCard}>
        <h2>🏆 PROMOCIÓN MUNDIAL</h2>
        <h1 style={{ color: "#facc15" }}>GANA $100,000</h1>
        <p>Selecciona 12 ganadores y 2 dobles oportunidades</p>

        <div style={progressOuter}>
          <div style={{ ...progressInner, width: `${progress}%` }} />
        </div>

        <div style={statsRow}>
          <span>✅ {totalSelected}/14</span>
          <span>🔄 {totalDoubles}/2</span>
        </div>
      </div>

      {partidosData.map((p, i) => {
        const selected = picks[i];

        return (
          <div key={i} style={cardStyle}>
            <div style={matchRow}>
              <div style={teamBox}>
                <div style={flagStyle}>{p[0]}</div>
                <b>{p[1]}</b>
              </div>

              <div style={{ color: "#facc15", fontWeight: "bold" }}>VS</div>

              <div style={teamBox}>
                <div style={flagStyle}>{p[2]}</div>
                <b>{p[3]}</b>
              </div>
            </div>

            <div style={optionsRow}>
              <button
                style={optionStyle(selected === "1", "normal")}
                onClick={() => select(i, "1")}
              >
                1
              </button>
              <button
                style={optionStyle(selected === "2", "normal")}
                onClick={() => select(i, "2")}
              >
                2
              </button>
              <button
                style={optionStyle(selected === "1X", "double")}
                onClick={() => select(i, "1X")}
              >
                1X
              </button>
              <button
                style={optionStyle(selected === "X2", "double")}
                onClick={() => select(i, "X2")}
              >
                X2
              </button>
            </div>

            <p style={{ color: "#94a3b8", marginBottom: 0 }}>
              Selección:{" "}
              <b style={{ color: "white" }}>{selected || "Ninguna"}</b>
            </p>
          </div>
        );
      })}

      <div style={{ height: 95 }} />

      <div style={bottomBar}>
        <button
          disabled={!isValid}
          style={{
            ...mainButton,
            background: isValid ? "#22c55e" : "#475569",
            cursor: isValid ? "pointer" : "not-allowed",
          }}
          onClick={() => setScreen("payment")}
        >
          🎟️ GUARDAR BOLETO Y PAGAR
        </button>

        {!isValid && (
          <small style={{ color: "#f87171" }}>
            Debes completar 14 partidos y exactamente 2 dobles
          </small>
        )}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #020617, #0f172a)",
  color: "white",
  fontFamily: "Arial, sans-serif",
  padding: 14,
};

const headerCard = {
  background: "linear-gradient(135deg, #064e3b, #0f172a)",
  border: "1px solid #22c55e",
  borderRadius: 18,
  padding: 18,
  textAlign: "center",
  marginBottom: 14,
};

const cardStyle = {
  background: "#111827",
  border: "1px solid #334155",
  borderRadius: 16,
  padding: 14,
  marginBottom: 12,
  boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
};

const matchRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  marginBottom: 14,
};

const teamBox = {
  width: "42%",
  textAlign: "center",
};

const flagStyle = {
  fontSize: 38,
  marginBottom: 4,
};

const optionsRow = {
  display: "flex",
  gap: 8,
};

const progressOuter = {
  width: "100%",
  height: 12,
  background: "#334155",
  borderRadius: 999,
  overflow: "hidden",
  marginTop: 14,
};

const progressInner = {
  height: "100%",
  background: "#22c55e",
};

const statsRow = {
  display: "flex",
  justifyContent: "space-around",
  marginTop: 12,
  fontWeight: "bold",
};

const bottomBar = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  background: "#020617",
  borderTop: "1px solid #334155",
  padding: 12,
  textAlign: "center",
};

const mainButton = {
  width: "100%",
  padding: 15,
  borderRadius: 14,
  border: "none",
  color: "white",
  fontSize: 17,
  fontWeight: "bold",
  background: "#22c55e",
};

const secondaryButton = {
  width: "100%",
  padding: 13,
  borderRadius: 14,
  border: "1px solid #334155",
  color: "white",
  fontSize: 15,
  fontWeight: "bold",
  background: "#1e293b",
  marginTop: 10,
};

const paymentBox = {
  background: "#020617",
  border: "1px solid #facc15",
  borderRadius: 14,
  padding: 14,
  margin: "16px 0",
  lineHeight: 1.8,
};

const copyBox = {
  background: "#111827",
  padding: 12,
  borderRadius: 10,
  marginBottom: 12,
};

const copyRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  marginTop: 8,
};

const copyTextStyle = {
  wordBreak: "break-word",
  fontWeight: "bold",
  color: "white",
};

const copyButton = {
  background: "#22c55e",
  border: "none",
  color: "white",
  padding: "7px 10px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: 14,
  marginTop: 8,
  marginBottom: 16,
  borderRadius: 12,
  border: "1px solid #334155",
  background: "#020617",
  color: "white",
  fontSize: 16,
};

const fileInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: 14,
  marginTop: 8,
  marginBottom: 16,
  borderRadius: 12,
  border: "1px solid #334155",
  background: "#020617",
  color: "white",
};