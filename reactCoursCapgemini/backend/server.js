import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


const dataPath = path.join(process.cwd(), 'backend', 'data.json');

app.get('/api/data', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lecture fichier JSON' });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/data', (req, res) => {
  const newHouse = req.body;
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lecture fichier JSON' });
    }
    let houses = [];
    try {
      houses = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ error: 'Erreur parsing JSON' });
    }
    houses.push(newHouse);
    fs.writeFile(dataPath, JSON.stringify(houses, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur écriture fichier JSON' });
      }
      res.json(newHouse);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
