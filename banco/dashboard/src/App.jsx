import React, {
  lazy,
  Suspense,
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import { Button } from 'common-components-react';
import { bus } from 'common-utils';
import { AppContext } from './contexts/AppContext';
import AngularLoginWrapper from './components/AngularLoginWrapper';

const ExchangeTool = lazy(() => import('moneyExchange/ExchangeTool'));
const Payment = lazy(() => import('payment/Payment'));
const LoanCalculator = lazy(() => import('loan/LoanCalculator'));

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transacciones, setTransacciones] = useState([]);
  const { user, theme, setTheme, setUser } = useContext(AppContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loanHistory, setLoanHistory] = useState([]);

  // Estados específicos para el iframe
  const iframeRef = useRef(null);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [newsCount, setNewsCount] = useState(0);

  //URL del iframe
  const getIframeUrl = () => {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3005'; // URL del iframe
    }
    return process.env.FINANCIAL_NEWS_URL || 'http://financial-news:3005';
  };

  //Manejar comunicación PostMessage con el iframe
  const handleIframeMessage = useCallback(
    (event) => {
      const allowedOrigins = [
        'http://localhost:3005',
        'http://financial-news:3005',
      ];
      if (!allowedOrigins.includes(event.origin)) return;
      switch (event.data.type) {
        case 'IFRAME_READY':
          setIframeLoading(false);
          if (iframeRef.current && user) {
            iframeRef.current.contentWindow.postMessage(
              {
                type: 'USER_INFO',
                user: { id: user.id, name: user.name },
              },
              event.origin
            );
          }
          break;

        case 'NEWS_SELECTED':
          setSelectedNews(event.data.data);
          console.log('📰 Noticia seleccionada desde iframe:', event.data.data);
          break;

        case 'NEWS_REFRESHED':
          setNewsCount(event.data.data.count);
          console.log(
            '🔄 Noticias actualizadas en iframe:',
            event.data.data.count
          );
          break;
      }
    },
    [user]
  );

  useEffect(() => {
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [handleIframeMessage]);

  useEffect(() => {
    const sub = bus.subscribe((msg) => {
      if (msg.topic === 'prestamoCalculado') {
        setLoanHistory((prev) => [msg.payload, ...prev]);
        return;
      }
      if (msg.topic === 'transaccionCambio') {
        setTransacciones((prev) => [msg.payload, ...prev]);
      }
    });

    return () => sub.unsubscribe();
  }, []);

  // Enviar cambios de tema al iframe
  useEffect(() => {
    if (iframeRef.current && !iframeLoading) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'THEME_CHANGE',
          theme: theme,
        },
        getIframeUrl()
      );
    }
  }, [theme, iframeLoading]);

  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
    },
    header: {
      backgroundColor: '#0047b3',
      color: 'white',
      padding: '15px 20px',
      borderRadius: '8px 8px 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#003380',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
    },
    navigation: {
      display: 'flex',
      borderBottom: '1px solid #ddd',
      marginBottom: '20px',
      backgroundColor: 'white',
    },
    navItem: {
      padding: '10px 20px',
      cursor: 'pointer',
      borderBottom: '3px solid transparent',
      transition: 'all 0.3s',
    },
    activeNavItem: {
      borderBottom: '3px solid #0047b3',
      fontWeight: 'bold',
      color: '#0047b3',
    },
    content: {
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '0 0 8px 8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    dashboard: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '20px',
    },
    mainSection: {
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
    },
    sideSection: {
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
    },
    accountSummary: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    accountCard: {
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      width: '48%',
    },
    accountNumber: {
      color: '#666',
      fontSize: '14px',
    },
    accountBalance: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '10px 0',
      color: '#0047b3',
    },
    recentTransactions: {
      marginTop: '20px',
    },
    transaction: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid #eee',
    },
    conversionToolContainer: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#f0f7ff',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    },
    toolTitle: {
      fontSize: '18px',
      color: '#0047b3',
      marginBottom: '15px',
      fontWeight: 'bold',
    },
    iframeContainer: {
      width: '100%',
      height: '500px',
      border: '2px solid #0047b3',
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: 'white',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none',
      display: 'block',
    },
    iframeHeader: {
      padding: '10px 15px',
      backgroundColor: '#0047b3',
      color: 'white',
      fontSize: '14px',
      fontWeight: 'bold',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    iframeLoading: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#0047b3',
      fontSize: '16px',
      zIndex: 10,
    },
    newsInfo: {
      padding: '8px 15px',
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #ddd',
      fontSize: '12px',
      color: '#666',
    },
    sidebarIframe: {
      width: '100%',
      height: '300px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
    },
  };

  useEffect(() => {
    const subscription = bus.subscribe((msg) => {
      if (msg.topic === 'transaccionCambio') {
        setTransacciones((prev) => [msg.payload, ...prev]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = theme === 'light' ? 'white' : 'black';
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
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer',
              }}
            >
              {theme === 'light' ? '🌑' : '☀️'}
            </button>
            <div style={styles.logo}>Banco Nacional</div>
            <div style={styles.userInfo}>
              <span>Bienvenido, {user.name}</span>
              <div style={styles.avatar}>
                <Button onClick={() => alert('Hola')}>C</Button>
              </div>
            </div>
          </header>

          <nav style={styles.navigation}>
            <div
              style={{
                ...styles.navItem,
                ...(activeTab === 'dashboard' ? styles.activeNavItem : {}),
              }}
              onClick={() => setActiveTab('dashboard')}
            >
              Panel Principal
            </div>
            <div
              style={{
                ...styles.navItem,
                ...(activeTab === 'exchange' ? styles.activeNavItem : {}),
              }}
              onClick={() => setActiveTab('exchange')}
            >
              Cambio de Divisas
            </div>
            <div
              style={{
                ...styles.navItem,
                ...(activeTab === 'transfers' ? styles.activeNavItem : {}),
              }}
              onClick={() => setActiveTab('transfers')}
            >
              Transferencias
            </div>
            <div
              style={{
                ...styles.navItem,
                ...(activeTab === 'payments' ? styles.activeNavItem : {}),
              }}
              onClick={() => setActiveTab('payments')}
            >
              Pagos
            </div>
            <div
              style={{
                ...styles.navItem,
                ...(activeTab === 'loans' ? styles.activeNavItem : {}),
              }}
              onClick={() => setActiveTab('loans')}
            >
              Préstamos
            </div>
            {/* IFRAME */}
            <div
              style={{
                ...styles.navItem,
                ...(activeTab === 'news' ? styles.activeNavItem : {}),
              }}
              onClick={() => setActiveTab('news')}
            >
              📰 Noticias (Iframe)
            </div>
          </nav>

          <main style={styles.content}>
            {activeTab === 'dashboard' && (
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
                            Tipo de cambio {tx.from.currency} a {tx.to.currency}{' '}
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
                      <div
                        style={{
                          ...styles.conversionToolContainer,
                          marginTop: 20,
                        }}
                      >
                        <div style={styles.toolTitle}>
                          Historial de Préstamos
                        </div>

                        {loanHistory.length === 0 && (
                          <p>No hay cálculos de préstamos.</p>
                        )}

                        {loanHistory.map((loan) => (
                          <div
                            key={loan.id}
                            style={{ marginBottom: 8, fontSize: 14 }}
                          >
                            <strong>${loan.amount.toLocaleString()}</strong> ·{' '}
                            {loan.months} mes&nbsp; · {loan.annualRate}% TNA →
                            <span style={{ color: '#166534' }}>
                              ${loan.monthlyPayment.toLocaleString()} / mes
                            </span>{' '}
                            (total ${loan.totalPayment.toLocaleString()})
                          </div>
                        ))}
                      </div>
                    </Suspense>
                  </div>
                </div>

                <div style={styles.sideSection}>
                  <h2>Resumen Financiero</h2>
                  <div style={{ marginTop: '15px' }}>
                    <h3>Tipo de Cambio Actual</h3>
                    <div style={{ margin: '10px 0' }}>
                      <div>USD a PEN: 3.70</div>
                      <div>PEN a USD: 0.27</div>
                    </div>
                    <h3>Próximos Pagos</h3>
                    <div style={{ margin: '10px 0' }}>
                      <div>Préstamo Personal: S/ 350.00</div>
                      <div>Fecha: 28/05/2023</div>
                    </div>

                    <div
                      style={{
                        ...styles.conversionToolContainer,
                        marginTop: '20px',
                      }}
                    >
                      <div style={styles.toolTitle}>
                        Calculadora de Préstamos
                      </div>
                      <Suspense fallback={<div>Cargando calculadora...</div>}>
                        <LoanCalculator />
                      </Suspense>
                    </div>

                    {/*  IFRAME  */}
                    <div style={{ marginTop: '20px' }}>
                      <h3>📰 Noticias Rápidas</h3>
                      <div style={styles.sidebarIframe}>
                        <iframe
                          src={getIframeUrl()}
                          style={{ ...styles.iframe, height: '100%' }}
                          title="Noticias Financieras - Vista Rápida"
                          sandbox="allow-scripts allow-same-origin"
                          loading="lazy"
                        />
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          color: '#999',
                          marginTop: '5px',
                        }}
                      >
                        Iframe independiente en sidebar
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'exchange' && (
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

            {activeTab === 'transfers' && (
              <div>
                <h2>Transferencias</h2>
                <p>Esta funcionalidad está en desarrollo.</p>
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <Suspense fallback={<div>Cargando modulo de pagos...</div>}>
                  <Payment />
                </Suspense>
              </div>
            )}

            {activeTab === 'loans' && (
              <div>
                <h2>Calculadora de Préstamos</h2>
                <p>
                  Calcula las cuotas y el total de tu préstamo de manera
                  sencilla.
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px',
                  }}
                >
                  <Suspense
                    fallback={<div>Cargando calculadora de préstamos...</div>}
                  >
                    <LoanCalculator />
                  </Suspense>
                </div>
              </div>
            )}

            {/* IFRAME PATTERN */}
            {activeTab === 'news' && (
              <div>
                <h2>📰 Centro de Noticias Financieras</h2>
                <p style={{ marginBottom: '20px', color: '#666' }}>
                  <strong>💡 Patrón Iframe Based:</strong> Esta sección carga
                  una aplicación React completamente independiente desde un
                  contenedor Docker separado. (#10 cubre la rubrica con el punto
                  10)
                </p>

                {/* Header del iframe con información */}
                <div style={styles.iframeHeader}>
                  <span>🌐 Aplicación Externa: {getIframeUrl()}</span>
                  <div style={{ fontSize: '12px' }}>
                    {iframeLoading
                      ? '⏳ Cargando...'
                      : `✅ Conectado • ${newsCount || 0} noticias`}
                    {selectedNews && ` • Última: ${selectedNews.bank}`}
                  </div>
                </div>

                <div style={styles.iframeContainer}>
                  {iframeLoading && (
                    <div style={styles.iframeLoading}>
                      🔄 Cargando aplicación independiente...
                    </div>
                  )}

                  <iframe
                    ref={iframeRef}
                    src={getIframeUrl()}
                    style={styles.iframe}
                    title="Noticias Financieras - Aplicación Independiente"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    loading="lazy"
                    onLoad={() => {
                      console.log('📺 Iframe cargado desde:', getIframeUrl());
                    }}
                  />
                </div>

                {/* Información técnica */}
                <div style={styles.newsInfo}>
                  <strong>🔧 Tecnología:</strong> React 19 + TypeScript + Vite +
                  Docker independiente
                  <strong style={{ marginLeft: '20px' }}>
                    🚀 Comunicación:
                  </strong>{' '}
                  PostMessage API bidireccional
                  {selectedNews && (
                    <span style={{ marginLeft: '20px' }}>
                      <strong>📰 Última noticia:</strong>{' '}
                      {selectedNews.title.substring(0, 50)}...
                    </span>
                  )}
                </div>

                {/* Prueba de comunicación */}
                <div
                  style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#f0f7ff',
                    borderRadius: '8px',
                  }}
                >
                  <strong>🧪 Prueba de comunicación PostMessage:</strong>
                  <button
                    style={{
                      marginLeft: '10px',
                      padding: '5px 10px',
                      fontSize: '12px',
                    }}
                    onClick={() => {
                      if (iframeRef.current) {
                        iframeRef.current.contentWindow.postMessage(
                          {
                            type: 'THEME_CHANGE',
                            theme: theme === 'light' ? 'dark' : 'light',
                          },
                          getIframeUrl()
                        );
                      }
                    }}
                  >
                    🎨 Cambiar tema del iframe
                  </button>
                  <button
                    style={{
                      marginLeft: '10px',
                      padding: '5px 10px',
                      fontSize: '12px',
                    }}
                    onClick={() => {
                      if (iframeRef.current) {
                        iframeRef.current.contentWindow.postMessage(
                          {
                            type: 'USER_INFO',
                            user: { name: user.name, id: 'demo-123' },
                          },
                          getIframeUrl()
                        );
                      }
                    }}
                  >
                    👤 Enviar datos usuario
                  </button>
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
