import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/loan", (req, res) => {
  const { amount, months, annualRate } = req.body;
  const r = (annualRate / 100) / 12;
  const n = months;
  const P = amount;

  const monthlyPayment = (P * r) / (1 - Math.pow(1 + r, -n));
  const totalPayment = monthlyPayment * n;

  res.json({
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    totalPayment:   parseFloat(totalPayment.toFixed(2))
  });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Mock Loan Service running at http://localhost:${PORT}`);
});
