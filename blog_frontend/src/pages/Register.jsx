import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Alert, Paper,
  InputAdornment, CircularProgress, Divider, LinearProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { API_BASE_URL } from '../apiConfig';

function getPasswordStrength(pwd) {
  if (pwd.length === 0) return { value: 0, label: '', color: 'inherit' };
  if (pwd.length < 6)   return { value: 25, label: 'Trop court', color: 'error' };
  if (pwd.length < 8)   return { value: 50, label: 'Faible', color: 'warning' };
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return { value: 100, label: 'Fort', color: 'success' };
  return { value: 75, label: 'Moyen', color: 'info' };
}

export default function Register() {
  const [form, setForm] = useState({ fullname: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const strength = getPasswordStrength(form.password);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ nom_complet: form.fullname, username: form.username, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Inscription réussie ! Redirection vers la connexion…');
        setForm({ fullname: '', username: '', password: '' });
        setTimeout(() => navigate('/login'), 1200);
      } else {
        setError(data.message || "Erreur lors de l'inscription");
      }
    } catch {
      setError('Erreur réseau');
    }
    setLoading(false);
  };

  return (
    <Box
      display="flex" justifyContent="center" alignItems="center"
      minHeight="calc(100vh - 64px)"
      sx={{ px: 2 }}
    >
      <Paper
        elevation={3}
        className="fade-in-up"
        sx={{ width: '100%', maxWidth: 420, overflow: 'hidden', borderRadius: 4 }}
      >
        {/* Header gradient */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #EC4899 0%, #7C3AED 100%)',
            py: 4, px: 3, textAlign: 'center',
          }}
        >
          <EditNoteIcon sx={{ fontSize: 44, color: '#fff', mb: 1 }} />
          <Typography variant="h5" color="white" fontWeight={800}>
            Créer un compte
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
            Rejoignez la communauté
          </Typography>
        </Box>

        {/* Form */}
        <Box sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nom complet"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              fullWidth margin="normal" required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Nom d'utilisateur"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth margin="normal" required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Mot de passe"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth margin="normal" required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
            />
            {form.password.length > 0 && (
              <Box mt={1} mb={0.5}>
                <LinearProgress
                  variant="determinate"
                  value={strength.value}
                  color={strength.color}
                  sx={{ borderRadius: 999, height: 6 }}
                />
                <Typography variant="caption" color={`${strength.color}.main`} fontWeight={600}>
                  {strength.label}
                </Typography>
              </Box>
            )}

            {error   && <Alert severity="error"   sx={{ mt: 2, borderRadius: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2, borderRadius: 3 }}>{success}</Alert>}

            <Button
              type="submit" variant="contained" color="primary"
              fullWidth disabled={loading}
              sx={{ mt: 3, py: 1.4, fontSize: '1rem' }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "S'inscrire"}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">ou</Typography>
          </Divider>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Déjà un compte ?{' '}
              <Typography
                component={Link} to="/login" variant="body2"
                sx={{ color: 'primary.main', fontWeight: 700, textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' } }}
              >
                Se connecter
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
