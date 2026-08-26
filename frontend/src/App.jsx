import { useState } from 'react';
import StraightenRoundedIcon from '@mui/icons-material/StraightenRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const examples = [1, 3, 10, 100];
const numberFormatter = new Intl.NumberFormat('fr-CA', {
  maximumFractionDigits: 6,
});

const comparisonFormatter = new Intl.NumberFormat('fr-CA', {
  maximumFractionDigits: 2,
});

const sizeReferences = [
  { name: 'un grain de riz', meters: 0.007, emoji: '🍚', dimension: 'longueur' },
  { name: 'une carte bancaire', meters: 0.086, emoji: '💳', dimension: 'longueur' },
  { name: 'un téléphone intelligent', meters: 0.15, emoji: '📱', dimension: 'hauteur' },
  { name: "une bouteille d'eau", meters: 0.25, emoji: '🧴', dimension: 'hauteur' },
  { name: 'un chat domestique', meters: 0.46, emoji: '🐈', dimension: 'hauteur' },
  { name: 'une chaise', meters: 0.9, emoji: '🪑', dimension: 'hauteur' },
  { name: 'une porte standard', meters: 2.03, emoji: '🚪', dimension: 'hauteur' },
  { name: 'une voiture', meters: 4.5, emoji: '🚗', dimension: 'longueur' },
  { name: 'une girafe adulte', meters: 5.5, emoji: '🦒', dimension: 'hauteur' },
  { name: 'un autobus urbain', meters: 12, emoji: '🚌', dimension: 'longueur' },
  { name: 'une piscine semi-olympique', meters: 25, emoji: '🏊', dimension: 'longueur' },
  { name: 'un avion de ligne', meters: 73, emoji: '✈️', dimension: 'longueur' },
  { name: 'la statue de la Liberté', meters: 93, emoji: '🗽', dimension: 'hauteur' },
  { name: 'la tour Eiffel', meters: 330, emoji: '🗼', dimension: 'hauteur' },
];

function findClosestObject(meters) {
  if (meters <= 0) return null;

  return sizeReferences.reduce((closest, reference) => {
    const distance = Math.abs(Math.log(meters / reference.meters));
    const closestDistance = Math.abs(Math.log(meters / closest.meters));
    return distance < closestDistance ? reference : closest;
  });
}

export default function App() {
  const [feet, setFeet] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const closestObject = result ? findClosestObject(result.meters) : null;

  async function convert(value = feet) {
    const normalizedValue = String(value).trim().replace(',', '.');

    if (normalizedValue === '' || !Number.isFinite(Number(normalizedValue))) {
      setError('Saisissez une valeur numérique valide.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feet: Number(normalizedValue) }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'La conversion a échoué.');
      }

      setResult(data);
    } catch (requestError) {
      setResult(null);
      setError(
        requestError instanceof TypeError
          ? 'Impossible de joindre le serveur. Vérifiez que le backend est démarré.'
          : requestError.message,
      );
    } finally {
      setLoading(false);
    }
  }

  function submit(event) {
    event.preventDefault();
    convert();
  }

  function useExample(value) {
    setFeet(String(value));
    convert(value);
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        py: 5,
        background:
          'radial-gradient(circle at 10% 10%, rgba(49,85,217,.16), transparent 32%), radial-gradient(circle at 90% 85%, rgba(0,165,142,.14), transparent 30%)',
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3} alignItems="center">
          <Box
            sx={{
              width: 64,
              height: 64,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 4,
              color: 'common.white',
              bgcolor: 'primary.main',
              boxShadow: '0 14px 32px rgba(49, 85, 217, .28)',
            }}
          >
            <StraightenRoundedIcon fontSize="large" />
          </Box>

          <Box textAlign="center">
            <Typography component="h1" variant="h3" gutterBottom>
              Pieds en mètres
            </Typography>
            <Typography color="text.secondary">
              Une conversion précise, simple et instantanée.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              width: '100%',
              p: { xs: 3, sm: 4 },
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 24px 64px rgba(28, 39, 76, .10)',
            }}
          >
            <Stack component="form" onSubmit={submit} spacing={2.5}>
              <TextField
                autoFocus
                fullWidth
                label="Longueur en pieds"
                value={feet}
                onChange={(event) => {
                  setFeet(event.target.value);
                  setError('');
                }}
                placeholder="Ex. 12,5"
                inputMode="decimal"
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">pi</InputAdornment>,
                  },
                  htmlInput: {
                    'aria-label': 'Longueur en pieds',
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SwapHorizRoundedIcon />}
              >
                {loading ? 'Conversion…' : 'Convertir en mètres'}
              </Button>

              {error && <Alert severity="error">{error}</Alert>}

              {result && (
                <Box
                  role="status"
                  aria-live="polite"
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    bgcolor: 'rgba(49, 85, 217, .06)',
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {numberFormatter.format(result.feet)} pi correspondent à
                  </Typography>
                  <Typography variant="h3" fontWeight={800} color="primary.main">
                    {numberFormatter.format(result.meters)} m
                  </Typography>

                  {closestObject && (
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      alignItems="center"
                      textAlign={{ xs: 'center', sm: 'left' }}
                      sx={{
                        mt: 3,
                        pt: 3,
                        borderTop: '1px solid',
                        borderColor: 'rgba(49, 85, 217, .16)',
                      }}
                    >
                      <Box
                        aria-hidden="true"
                        sx={{
                          width: 72,
                          height: 72,
                          flexShrink: 0,
                          display: 'grid',
                          placeItems: 'center',
                          borderRadius: 3,
                          bgcolor: 'background.paper',
                          fontSize: 42,
                          boxShadow: '0 8px 24px rgba(28, 39, 76, .08)',
                        }}
                      >
                        {closestObject.emoji}
                      </Box>
                      <Box>
                        <Typography variant="overline" color="secondary.main" fontWeight={800}>
                          Objet de taille similaire
                        </Typography>
                        <Typography variant="h6" fontWeight={800}>
                          {closestObject.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Sa {closestObject.dimension} est d’environ{' '}
                          {comparisonFormatter.format(closestObject.meters)} m. Votre mesure équivaut à{' '}
                          {comparisonFormatter.format(result.meters / closestObject.meters)} fois cette taille.
                        </Typography>
                      </Box>
                    </Stack>
                  )}
                </Box>
              )}

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Exemples rapides
                </Typography>
                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" useFlexGap>
                  {examples.map((value) => (
                    <Chip
                      key={value}
                      label={`${value} pi`}
                      onClick={() => useExample(value)}
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Paper>

          <Typography variant="body2" color="text.secondary">
            1 pied = 0,3048 mètre exactement
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
