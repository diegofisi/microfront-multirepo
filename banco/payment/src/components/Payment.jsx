import React, { useState } from "react";

const Payment = () => {
  const [paymentType, setPaymentType] = useState("services");
  const [selectedService, setSelectedService] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const services = [
    { id: "elec", name: "Electricidad", companies: ["Luz del Sur", "Enel"] },
    { id: "water", name: "Agua", companies: ["Sedapal"] },
    {
      id: "phone",
      name: "Telefonía",
      companies: ["Movistar", "Claro", "Entel"],
    },
    {
      id: "internet",
      name: "Internet",
      companies: ["Movistar", "Claro", "Entel", "Bitel"],
    },
    {
      id: "tv",
      name: "Televisión",
      companies: ["DirecTV", "Movistar TV", "Claro TV"],
    },
  ];

  const banks = [
    "Banco de Crédito del Perú (BCP)",
    "BBVA",
    "Interbank",
    "Scotiabank",
    "Banco de la Nación",
    "Banco Pichincha",
  ];

  const handlePayment = () => {
    if (
      !accountNumber ||
      !amount ||
      (paymentType === "services" && !selectedService)
    ) {
      setAlertMessage("Por favor complete todos los campos requeridos");
      return;
    }

    setTimeout(() => {
      const randomId = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
      setTransactionId(`TRX-${randomId}`);
      setPaymentConfirmed(true);
    }, 1500);
  };

  const resetForm = () => {
    setPaymentType("services");
    setSelectedService("");
    setAccountNumber("");
    setAmount("");
    setPaymentConfirmed(false);
    setTransactionId("");
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    setAmount(rawValue ? parseFloat(rawValue) : "");
  };

  return (
    <div style={styles.container}>
      {alertMessage && <shared-alert>{alertMessage}</shared-alert>}
      {!paymentConfirmed ? (
        <>
          <h2 style={styles.title}>Pagos</h2>

          <div style={styles.tabContainer}>
            <div
              style={{
                ...styles.tab,
                ...(paymentType === "services" ? styles.activeTab : {}),
              }}
              onClick={() => setPaymentType("services")}
            >
              Servicios
            </div>
            <div
              style={{
                ...styles.tab,
                ...(paymentType === "transfers" ? styles.activeTab : {}),
              }}
              onClick={() => setPaymentType("transfers")}
            >
              Transferencias
            </div>
            <div
              style={{
                ...styles.tab,
                ...(paymentType === "creditcard" ? styles.activeTab : {}),
              }}
              onClick={() => setPaymentType("creditcard")}
            >
              Tarjetas de Crédito
            </div>
          </div>

          <div style={styles.formContainer}>
            {paymentType === "services" && (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tipo de Servicio</label>
                  <select
                    style={styles.select}
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="">Selecciona un servicio</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedService && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Empresa</label>
                    <select style={styles.select}>
                      <option value="">Selecciona una empresa</option>
                      {services
                        .find((s) => s.id === selectedService)
                        ?.companies.map((company) => (
                          <option key={company} value={company}>
                            {company}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {paymentType === "transfers" && (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Banco Destino</label>
                  <select style={styles.select}>
                    <option value="">Selecciona un banco</option>
                    {banks.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {paymentType === "creditcard" && (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Banco Emisor</label>
                  <select style={styles.select}>
                    <option value="">Selecciona un banco</option>
                    {banks.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>
                {paymentType === "services"
                  ? "Número de Suministro/Servicio"
                  : paymentType === "transfers"
                  ? "Número de Cuenta"
                  : "Número de Tarjeta"}
              </label>
              <input
                type="text"
                style={styles.input}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder={
                  paymentType === "services"
                    ? "Ingresa el número de suministro"
                    : paymentType === "transfers"
                    ? "Ingresa el número de cuenta"
                    : "Ingresa los 16 dígitos de la tarjeta"
                }
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Monto a Pagar</label>
              <input
                type="text"
                style={styles.input}
                value={amount ? `S/ ${amount}` : ""}
                onChange={handleAmountChange}
                placeholder="S/ 0.00"
              />
            </div>

            <button style={styles.button} onClick={handlePayment}>
              Realizar Pago
            </button>
          </div>
        </>
      ) : (
        <div style={styles.confirmationContainer}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.confirmationTitle}>¡Pago Exitoso!</h2>
          <p style={styles.confirmationText}>
            Tu pago de <strong>S/ {parseFloat(amount).toFixed(2)}</strong> ha
            sido procesado correctamente.
          </p>
          <div style={styles.transactionDetails}>
            <p>
              <strong>ID de Transacción:</strong> {transactionId}
            </p>
            <p>
              <strong>Fecha:</strong> {new Date().toLocaleDateString()}
            </p>
            <p>
              <strong>Hora:</strong> {new Date().toLocaleTimeString()}
            </p>
            <p>
              <strong>Servicio:</strong>{" "}
              {paymentType === "services"
                ? services.find((s) => s.id === selectedService)?.name
                : paymentType === "transfers"
                ? "Transferencia Bancaria"
                : "Pago de Tarjeta de Crédito"}
            </p>
          </div>
          <button
            style={{ ...styles.button, marginTop: "20px" }}
            onClick={resetForm}
          >
            Realizar Otro Pago
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  title: {
    color: "#0047b3",
    marginTop: "0",
    marginBottom: "20px",
    textAlign: "center",
  },
  tabContainer: {
    display: "flex",
    borderBottom: "1px solid #ddd",
    marginBottom: "20px",
  },
  tab: {
    padding: "10px 15px",
    cursor: "pointer",
    borderBottom: "3px solid transparent",
    transition: "all 0.3s",
  },
  activeTab: {
    borderBottom: "3px solid #0047b3",
    fontWeight: "bold",
    color: "#0047b3",
  },
  formContainer: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    color: "#555",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "14px",
    backgroundColor: "white",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#0047b3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  confirmationContainer: {
    textAlign: "center",
    padding: "30px 20px",
  },
  successIcon: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "40px",
    lineHeight: "70px",
    margin: "0 auto 20px",
  },
  confirmationTitle: {
    color: "#4CAF50",
    marginBottom: "15px",
  },
  confirmationText: {
    fontSize: "16px",
    marginBottom: "20px",
  },
  transactionDetails: {
    backgroundColor: "#f5f5f5",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "left",
    marginBottom: "20px",
  },
};

export default Payment;
