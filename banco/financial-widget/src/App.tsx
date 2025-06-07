import React, { useState, useEffect } from 'react';
import './App.css';
import type { NewsItem, PostMessageData } from './interfaces/types';

const App: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentTheme, setCurrentTheme] = useState<string>('light');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [news, setNews] = useState<NewsItem[]>([]);

  // Datos mock de noticias financieras peruanas
  const mockNews: NewsItem[] = [
    {
      id: 1,
      bank: 'bcp',
      title:
        'BCP anuncia nueva línea de créditos hipotecarios con tasa preferencial',
      summary:
        'El Banco de Crédito del Perú lanza productos hipotecarios con tasas desde 6.9% anual para clientes preferenciales.',
      impact: 'positive',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      readTime: '2 min',
    },
    {
      id: 2,
      bank: 'bbva',
      title: 'BBVA Perú implementa nueva tecnología de pagos contactless',
      summary:
        'El banco español introduce sistema de pagos sin contacto en todas sus tarjetas, mejorando la experiencia del cliente.',
      impact: 'positive',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      readTime: '3 min',
    },
    {
      id: 3,
      bank: 'interbank',
      title: 'Interbank reporta crecimiento del 12% en banca digital',
      summary:
        'El banco peruano registra un incremento significativo en usuarios de su plataforma digital durante el último trimestre.',
      impact: 'positive',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      readTime: '2 min',
    },
    {
      id: 4,
      bank: 'scotiabank',
      title: 'Scotiabank Perú ajusta tasas de interés para depósitos a plazo',
      summary:
        'El banco canadiense modifica sus tasas de captación siguiendo las tendencias del mercado financiero local.',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      readTime: '3 min',
    },
    {
      id: 5,
      bank: 'banbif',
      title: 'BanBif expande su red de cajeros automáticos a nivel nacional',
      summary:
        'La institución financiera instala 50 nuevos cajeros en provincias, fortaleciendo su presencia regional.',
      impact: 'positive',
      timestamp: new Date(Date.now() - 120 * 60 * 1000),
      readTime: '2 min',
    },
    {
      id: 6,
      bank: 'general',
      title: 'BCR mantiene tasa de referencia en 7.75% para diciembre',
      summary:
        'El Banco Central de Reserva del Perú decide mantener la tasa de política monetaria, evaluando indicadores económicos.',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 150 * 60 * 1000),
      readTime: '4 min',
    },
  ];

  // Función para formatear tiempo relativo
  const getTimeAgo = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const getBankName = (bankCode: string): string => {
    const names: Record<string, string> = {
      bcp: 'BCP',
      bbva: 'BBVA',
      interbank: 'Interbank',
      scotiabank: 'Scotiabank',
      banbif: 'BanBif',
      general: 'BCR',
    };
    return names[bankCode] || bankCode.toUpperCase();
  };

  // Función para seleccionar noticia y comunicar con parent
  const selectNews = (newsItem: NewsItem) => {
    if (window.parent !== window) {
      const message: PostMessageData = {
        type: 'NEWS_SELECTED',
        data: {
          id: newsItem.id,
          title: newsItem.title,
          bank: getBankName(newsItem.bank),
          impact: newsItem.impact,
          timestamp: newsItem.timestamp,
        },
      };
      window.parent.postMessage(message, '*');
    }
  };

  const refreshNews = () => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedNews = mockNews.map((newsItem) => ({
        ...newsItem,
        timestamp: new Date(Date.now() - Math.random() * 300 * 60 * 1000),
      }));
      setNews(updatedNews);
      setIsLoading(false);
      if (window.parent !== window) {
        const message: PostMessageData = {
          type: 'NEWS_REFRESHED',
          data: {
            count: updatedNews.length,
            timestamp: new Date(),
          },
        };
        window.parent.postMessage(message, '*');
      }
    }, 1000);
  };

  // Filtrar noticias según el filtro activo
  const filteredNews =
    activeFilter === 'all'
      ? news
      : news.filter((newsItem) => newsItem.bank === activeFilter);

  // Configurar listener de mensajes del parent
  useEffect(() => {
    const handleMessage = (event: MessageEvent<PostMessageData>) => {
      switch (event.data.type) {
        case 'THEME_CHANGE':
          setCurrentTheme(event.data.theme);
          break;
        case 'USER_INFO':
          console.log('Usuario recibido:', event.data.user);
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Cargar noticias iniciales
  useEffect(() => {
    setTimeout(() => {
      setNews(mockNews);
      setIsLoading(false);

      // Notificar al parent que el iframe está listo
      if (window.parent !== window) {
        const message: PostMessageData = {
          type: 'IFRAME_READY',
          data: {
            width: document.body.scrollWidth,
            height: document.body.scrollHeight,
          },
        };
        window.parent.postMessage(message, '*');
      }
    }, 1000);
  }, []);

  // Aplicar tema
  useEffect(() => {
    document.body.className = currentTheme === 'dark' ? 'dark-theme' : '';
  }, [currentTheme]);

  return (
    <div className={`news-container ${currentTheme === 'dark' ? 'dark' : ''}`}>
      <div className="news-header">
        <h2>📈 Noticias Financieras</h2>
        <div className="subtitle">Sector Bancario Peruano</div>
      </div>

      <div className="news-controls">
        <div className="bank-filter">
          {['all', 'bcp', 'bbva', 'interbank', 'scotiabank', 'banbif'].map(
            (filter) => (
              <button
                key={filter}
                className={`filter-btn ${
                  activeFilter === filter ? 'active' : ''
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === 'all' ? 'Todas' : getBankName(filter)}
              </button>
            )
          )}
        </div>
        <button className="refresh-btn" onClick={refreshNews}>
          🔄 Actualizar
        </button>
      </div>

      <div className="news-list">
        {isLoading ? (
          <div className="loading">Cargando noticias financieras...</div>
        ) : filteredNews.length === 0 ? (
          <div className="loading">No hay noticias para este filtro</div>
        ) : (
          filteredNews.map((newsItem) => (
            <div
              key={newsItem.id}
              className="news-item"
              onClick={() => selectNews(newsItem)}
            >
              <div className={`news-icon ${newsItem.bank}`}>
                {getBankName(newsItem.bank)}
              </div>
              <div className="news-content">
                <div className="news-title">{newsItem.title}</div>
                <div className="news-summary">{newsItem.summary}</div>
                <div className="news-meta">
                  <span>⏱️ {newsItem.readTime} lectura</span>
                  <span>{getTimeAgo(newsItem.timestamp)}</span>
                  <span className={`news-impact impact-${newsItem.impact}`}>
                    {newsItem.impact === 'positive'
                      ? '📈 Positivo'
                      : newsItem.impact === 'negative'
                      ? '📉 Negativo'
                      : '⚖️ Neutral'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
