import React, { useState } from 'react';

import { bus } from 'common-utils';

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
}

const LoanCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    amount: '',
    months: '',
    annualRate: '',
  });
  const [result, setResult] = useState<LoanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateLoan = async () => {
    if (!formData.amount || !formData.months || !formData.annualRate) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4001/api/loan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          months: parseInt(formData.months),
          annualRate: parseFloat(formData.annualRate),
        }),
      });

      if (!response.ok) {
        throw new Error('Error en el servicio');
      }

      const data = await response.json();
      setResult(data);

      const loanData = {
        id: Date.now(),
        amount: parseFloat(formData.amount),
        months: parseInt(formData.months),
        annualRate: parseFloat(formData.annualRate),
        monthlyPayment: data.monthlyPayment,
        totalPayment: data.totalPayment,
        calculatedAt: new Date().toISOString(),
      };

      bus.next({
        topic: 'prestamoCalculado',
        payload: loanData,
      });
    } catch (error) {
      setError(
        'Error al calcular el préstamo. Verifica que el servicio esté ejecutándose en puerto 4001.'
      );
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ amount: '', months: '', annualRate: '' });
    setResult(null);
    setError('');
  };

  const styles = {
    container: {
      maxWidth: '448px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#1f2937',
    },
    formGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '4px',
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box' as const,
    },
    inputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    buttonContainer: {
      display: 'flex',
      gap: '8px',
      marginTop: '16px',
    },
    primaryButton: {
      flex: 1,
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    primaryButtonHover: {
      backgroundColor: '#2563eb',
    },
    primaryButtonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
    },
    secondaryButton: {
      padding: '12px 16px',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      borderRadius: '6px',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    errorMessage: {
      padding: '12px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      borderRadius: '6px',
      marginBottom: '16px',
      fontSize: '14px',
    },
    resultContainer: {
      marginTop: '24px',
      padding: '16px',
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '8px',
    },
    resultTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#166534',
      marginBottom: '12px',
    },
    resultItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid #dcfce7',
    },
    resultLabel: {
      color: '#374151',
      fontWeight: '500',
    },
    resultValue: {
      color: '#166534',
      fontWeight: 'bold',
      fontSize: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Calculadora de Préstamos</h2>

      <div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Monto del Préstamo ($)</label>
          <input
            type="number"
            placeholder="10000"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Plazo (meses)</label>
          <input
            type="number"
            placeholder="24"
            value={formData.months}
            onChange={(e) =>
              setFormData({ ...formData, months: e.target.value })
            }
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tasa Anual (%)</label>
          <input
            type="number"
            placeholder="12.5"
            step="0.01"
            value={formData.annualRate}
            onChange={(e) =>
              setFormData({ ...formData, annualRate: e.target.value })
            }
            style={styles.input}
          />
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <div style={styles.buttonContainer}>
          <button
            onClick={calculateLoan}
            disabled={loading}
            style={{
              ...styles.primaryButton,
              ...(loading ? styles.primaryButtonDisabled : {}),
            }}
          >
            {loading ? 'Calculando...' : 'Calcular'}
          </button>

          <button onClick={resetForm} style={styles.secondaryButton}>
            Limpiar
          </button>
        </div>
      </div>

      {result && (
        <div style={styles.resultContainer}>
          <h3 style={styles.resultTitle}>Resultado:</h3>
          <div>
            <div style={styles.resultItem}>
              <span style={styles.resultLabel}>Cuota Mensual:</span>
              <span style={styles.resultValue}>
                ${result.monthlyPayment.toLocaleString()}
              </span>
            </div>
            <div style={styles.resultItem}>
              <span style={styles.resultLabel}>Total a Pagar:</span>
              <span style={styles.resultValue}>
                ${result.totalPayment.toLocaleString()}
              </span>
            </div>
            <div style={{ ...styles.resultItem, borderBottom: 'none' }}>
              <span style={styles.resultLabel}>Intereses:</span>
              <span style={styles.resultValue}>
                $
                {(
                  result.totalPayment - parseFloat(formData.amount)
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
