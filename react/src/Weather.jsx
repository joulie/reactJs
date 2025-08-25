import React, { useEffect, useState } from 'react';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; // Clé OpenWeatherMap depuis .env

export default function Weather() {
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer la météo 5 jours à partir de coordonnées
  const fetchForecast = (lat, lon, cityName = '') => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
    )
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors de la récupération des prévisions météo');
        return res.json();
      })
      .then((data) => {
        console.log('Prévisions météo reçues:', data);
        // Regrouper les prévisions par jour (prendre la prévision de midi si possible)
        const days = {};
        data.list.forEach((item) => {
          const date = item.dt_txt.split(' ')[0];
          if (!days[date] || item.dt_txt.includes('12:00:00')) {
            days[date] = item;
          }
        });
        setForecast(Object.values(days).slice(0, 5));
        setCity(data.city.name);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchForecast(latitude, longitude);
        },
        (geoError) => {
          // Si refus, Paris par défaut
          const lat = 48.8566;
          const lon = 2.3522;
          fetchForecast(lat, lon, 'Paris');
        }
      );
    } else {
      // Si pas supporté, Paris par défaut
      const lat = 48.8566;
      const lon = 2.3522;
      fetchForecast(lat, lon, 'Paris');
    }
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;
  if (!forecast.length) return null;

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Météo à {city}</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
        {forecast.map((item, idx) => (
          <div key={idx} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, minWidth: 120 }}>
            <div>{new Date(item.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={item.weather[0].description}
            />
            <div>{item.weather[0].description}</div>
            <div>Temp : {Math.round(item.main.temp)}°C</div>
          </div>
        ))}
      </div>
    </div>
  );
}
