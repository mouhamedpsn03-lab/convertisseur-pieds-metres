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

export default function App() {
  const [feet, setFeet] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

