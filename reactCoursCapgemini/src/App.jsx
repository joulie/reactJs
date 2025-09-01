

import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/data')
      .then((res) => res.json())
      .then((data) => {
        // Si data est un tableau, on l'utilise directement
        if (Array.isArray(data)) {
          setRows(data);
        } else if (Array.isArray(data.rows)) {
          setRows(data.rows);
        } else {
          setRows([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Erreur lors du chargement des données');
        setLoading(false);
      });
  }, []);

  return (
    <div className="main-container">
    <h1 className="main-title">Available Properties</h1>
    <p className="description">Find below the list of available properties with their address, country, and asking price.</p>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Address</th>
              <th>Country</th>
              <th>Asking price</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td>{row.address}</td>
                <td>{row.country}</td>
                <td>{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
