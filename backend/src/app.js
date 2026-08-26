import cors from 'cors';
import express from 'express';
import { feetToMeters } from './conversion.js';

export const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.post('/api/convert', (request, response) => {
  const feet = request.body?.feet;

  if (typeof feet !== 'number' || !Number.isFinite(feet)) {
    return response.status(400).json({
      error: 'Veuillez fournir une valeur numérique valide dans le champ « feet ».',
    });
  }

  const meters = feetToMeters(feet);

  return response.json({
    feet,
    meters,
    formula: '1 pied = 0,3048 mètre',
  });
});

app.use((_request, response) => {
  response.status(404).json({ error: 'Route introuvable.' });
});

