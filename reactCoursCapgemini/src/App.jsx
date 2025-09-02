

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
            {rows.map((h, idx) => (
              <HouseRow key={idx} house={h} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function HouseRow({ house }) {
  return (
    <tr>
      <td>{house.address}</td>
      <td>{house.country}</td>
      <td>{house.price}</td>
    </tr>
  );
}

export default App;
