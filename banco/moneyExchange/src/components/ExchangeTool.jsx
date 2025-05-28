import React, { useState } from "react";
import "common-resources/scss/main.scss";
import { bus } from "common-utils";

const ExchangeTool = () => {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("PEN");
  const [toCurrency, setToCurrency] = useState("USD");
  const [result, setResult] = useState(null);
  const API_BASE = "http://localhost:4000";

  const handleConvert = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Por favor ingresa un monto válido");
      return;
    }

    try {
      const resp = await fetch(`
        ${API_BASE}/api/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`);
      const transaccion = await resp.json();
      bus.next({ topic: "transaccionCambio", payload: transaccion });
      setResult(transaccion);
    } catch (err) {
      console.error(err);
      alert("Error al convertir");
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ color: "#2c3e50", textAlign: "center" }}>
        Convertidor de Divisas
      </h2>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Monto:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ingresa el monto"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <div style={{ width: "45%" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>De:</label>
          <select
            value={fromCurrency}
            onChange={(e) => {
              setFromCurrency(e.target.value);
              setResult(null);
            }}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <option value="PEN">Soles (PEN)</option>
            <option value="USD">Dólares (USD)</option>
          </select>
        </div>

        <button
          onClick={handleSwapCurrencies}
          style={{
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            padding: "0 10px",
          }}
        >
          ↔️
        </button>

        <div style={{ width: "45%" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>A:</label>
          <select
            value={toCurrency}
            onChange={(e) => {
              setToCurrency(e.target.value);
              setResult(null);
            }}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <option value="USD">Dólares (USD)</option>
            <option value="PEN">Soles (PEN)</option>
          </select>
        </div>
      </div>

      <button onClick={handleConvert} className="btn">
        Convertir
      </button>

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#e7f4fe",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          <p style={{ margin: "0", fontSize: "18px" }}>
            {result.from.amount}{" "}
            {result.from.currency} =
            <span style={{ fontWeight: "bold" }}>
              {" "}
              {result.to.amount}{" "}
              {result.to.currency}
            </span>
          </p>
          <p
            style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#7f8c8d" }}
          >
            Tasa de cambio:1 {result.from.currency} = {result.rate}
            {result.to.currency}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExchangeTool;
