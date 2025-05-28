import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/convert", async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res
      .status(400)
      .json({ error: "Se requieren los parametros from, to y amount" });
  }
  try {
    const resp = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await resp.json();
    const rate = data.rates[to];

    if (!rate) {
      return res.status(400).json({ error: `Moneda no soportada: ${to}` });
    }

    const converted = (parseFloat(amount) * rate).toFixed(2);
    
    return res.json({
      from: { amount: parseFloat(amount), currency: from },
      to: { amount: converted, currency: to },
      rate,
      timestamp: data.time_next_update_utc || data.time_last_update_utc,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al consultar el API" });
  }
});

app.listen(4000, () => {
  console.log("El bff se esta escuchando en el puerto 4000");
});
