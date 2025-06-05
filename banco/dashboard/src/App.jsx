import React, { lazy, Suspense, useState, useEffect, useContext } from "react";
import { Button } from "common-components-react";
import { bus } from "common-utils";
import { AppContext } from "./contexts/AppContext";
import AngularLoginWrapper from "./components/AngularLoginWrapper";

const ExchangeTool = lazy(() => import("moneyExchange/ExchangeTool"));
const Payment = lazy(() => import("payment/Payment"));
const LoanCalculator = lazy(() => import("loan/LoanCalculator"));

const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [transacciones, setTransacciones] = useState([]);
  const { user, theme, setTheme, setUser } = useContext(AppContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
    },
    header: {
      backgroundColor: "#0047b3",
      color: "white",
      padding: "15px 20px",
      borderRadius: "8px 8px 0 0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    logo: {
      fontSize: "24px",
      fontWeight: "bold",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#003380",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
    },
    navigation: {
      display: "flex",
      borderBottom: "1px solid #ddd",
      marginBottom: "20px",
      backgroundColor: "white",
    },
    navItem: {
      padding: "10px 20px",
      cursor: "pointer",
      borderBottom: "3px solid transparent",
      transition: "all 0.3s",
    },
    activeNavItem: {
      borderBottom: "3px solid #0047b3",
      fontWeight: "bold",
      color: "#0047b3",
    },
    content: {
      padding: "20px",
      backgroundColor: "white",
      borderRadius: "0 0 8px 8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    dashboard: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "20px",
    },
    mainSection: {
      backgroundColor: "#f9f9f9",
      padding: "20px",
      borderRadius: "8px",
    },
    sideSection: {
      backgroundColor: "#f9f9f9",
      padding: "20px",
      borderRadius: "8px",
    },
    accountSummary: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px",
    },
    accountCard: {
      backgroundColor: "white",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      width: "48%",
    },
    accountNumber: {
      color: "#666",
      fontSize: "14px",
    },
    accountBalance: {
      fontSize: "24px",
      fontWeight: "bold",
      margin: "10px 0",
      color: "#0047b3",
    },
    recentTransactions: {
      marginTop: "20px",
    },
    transaction: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px solid #eee",
    },
    conversionToolContainer: {
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#f0f7ff",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    },
    toolTitle: {
      fontSize: "18px",
      color: "#0047b3",
      marginBottom: "15px",
      fontWeight: "bold",
    },
  };

  useEffect(() => {
    const subscription = bus.subscribe((msg) => {
      if (msg.topic === "transaccionCambio") {
        setTransacciones((prev) => [msg.payload, ...prev]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = theme === "light" ? "white" : "black";
  }, [theme]);

  return (
    <div style={styles.container}>
      {!isLoggedIn ? (
        <AngularLoginWrapper
          onLoginSuccess={(user) => {
            setUser(user);
            setIsLoggedIn(true);
          }}
        />
      ) : (
        <>
          <header style={styles.header}>
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              style={{
                background: "none",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              {theme === "light" ? "🌑" : "☀️"}
            </button>
            <div style={styles.logo}>Banco Nacional</div>
            <div style={styles.userInfo}>
              <span>Bienvenido, {user.name}</span>
              <div style={styles.avatar}>
                <Button onClick={() => alert("Hola")}>C</Button>
              </div>
            </div>
          </header>

          <nav style={styles.navigation}>
            <div
              style={{
                ...styles.navItem,
                ...(activeTab === "dashboard" ? styles.activeNavItem : {}),
              }}
              onClick={() => setActiveTab("dashboard")}
            >
              Panel Principal
            </div>
            <div
              style={{
                ...styles.navItem,
                ...(activeTab === "exchange" ? styles.activeNavItem : {}),
              }}
              onClick={() => setActiveTab("exchange")}
            >
              Cambio de Divisas
            </div>
            <div
              style={{
                ...styles.navItem,
                ...(activeTab === "transfers" ? styles.activeNavItem : {}),
              }}
              onClick={() => setActiveTab("transfers")}
            >
              Transferencias
            </div>
            <div
              style={{
                ...styles.navItem,
                ...(activeTab === "payments" ? styles.activeNavItem : {}),
              }}
              onClick={() => setActiveTab("payments")}
            >
              Pagos
            </div>
            <div
              style={{
                ...styles.navItem,
                ...(activeTab === "loans" ? styles.activeNavItem : {}),
              }}
              onClick={() => setActiveTab("loans")}
            >
              Préstamos
            </div>
          </nav>

          <main style={styles.content}>
            {activeTab === "dashboard" && (
              <div style={styles.dashboard}>
                <div style={styles.mainSection}>
                  <h2>Resumen de Cuentas</h2>
                  <div style={styles.accountSummary}>
                    <div style={styles.accountCard}>
                      <div style={styles.accountNumber}>
                        Cuenta Corriente - xxx1234
                      </div>
                      <div style={styles.accountBalance}>S/ 12,345.67</div>
                      <div>Disponible</div>
                    </div>
                    <div style={styles.accountCard}>
                      <div style={styles.accountNumber}>
                        Cuenta de Ahorros - xxx5678
                      </div>
                      <div style={styles.accountBalance}>$ 5,432.10</div>
                      <div>Disponible</div>
                    </div>
                  </div>

                  <div style={styles.recentTransactions}>
                    <h3>Transacciones Recientes</h3>
                    {transacciones.length === 0 ? (
                      <p>No hay transacciones de tipo de cambio</p>
                    ) : (
                      transacciones.map((tx) => (
                        <div key={tx.id} style={styles.transaction}>
                          <div>
                            Tipo de cambio {tx.from.currency} a {tx.to.currency}{" "}
                            ({new Date(tx.timestamp).toLocaleTimeString()})
                          </div>
                          <div>
                            {tx.from.amount}
                            {tx.from.currency} a {tx.to.amount}
                            {tx.to.currency}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div style={styles.conversionToolContainer}>
                    <div style={styles.toolTitle}>
                      Convertidor Rápido de Divisas
                    </div>
                    <Suspense
                      fallback={<div>Cargando convertidor de divisas...</div>}
                    >
                      <ExchangeTool />
                    </Suspense>
                  </div>
                </div>

                <div style={styles.sideSection}>
                  <h2>Resumen Financiero</h2>
                  <div style={{ marginTop: "15px" }}>
                    <h3>Tipo de Cambio Actual</h3>
                    <div style={{ margin: "10px 0" }}>
                      <div>USD a PEN: 3.70</div>
                      <div>PEN a USD: 0.27</div>
                    </div>
                    <h3>Próximos Pagos</h3>
                    <div style={{ margin: "10px 0" }}>
                      <div>Préstamo Personal: S/ 350.00</div>
                      <div>Fecha: 28/05/2023</div>
                    </div>

                    <div style={{...styles.conversionToolContainer, marginTop: "20px"}}>
                      <div style={styles.toolTitle}>
                        Calculadora de Préstamos
                      </div>
                      <Suspense fallback={<div>Cargando calculadora...</div>}>
                        <LoanCalculator />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "exchange" && (
              <div>
                <h2>Cambio de Divisas</h2>
                <p>
                  Realiza tus operaciones de cambio de manera rápida y segura.
                </p>
                <Suspense
                  fallback={<div>Cargando convertidor de divisas...</div>}
                >
                  <ExchangeTool />
                </Suspense>
              </div>
            )}

            {activeTab === "transfers" && (
              <div>
                <h2>Transferencias</h2>
                <p>Esta funcionalidad está en desarrollo.</p>
              </div>
            )}

            {activeTab === "payments" && (
              <div>
                <Suspense fallback={<div>Cargando modulo de pagos...</div>}>
                  <Payment />
                </Suspense>
              </div>
            )}

            {activeTab === "loans" && (
              <div>
                <h2>Calculadora de Préstamos</h2>
                <p>Calcula las cuotas y el total de tu préstamo de manera sencilla.</p>
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px"
                }}>
                  <Suspense fallback={<div>Cargando calculadora de préstamos...</div>}>
                    <LoanCalculator />
                  </Suspense>
                </div>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default App;