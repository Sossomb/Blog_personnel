import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Alert, Paper,
  InputAdornment, CircularProgress, Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { API_BASE_URL } from '../apiConfig';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user?.username || form.username);
        setSuccess('Connexion réussie ! Redirection…');
        setTimeout(() => navigate('/dashboard'), 600);
      } else {
        setError(data.message || 'Identifiants incorrects');
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
            background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
            py: 4, px: 3, textAlign: 'center',
          }}
        >
          <EditNoteIcon sx={{ fontSize: 44, color: '#fff', mb: 1 }} />
          <Typography variant="h5" color="white" fontWeight={800}>
            Bon retour !
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
            Connectez-vous à votre blog
          </Typography>
        </Box>

        {/* Form */}
        <Box sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
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

            {error   && <Alert severity="error"   sx={{ mt: 2, borderRadius: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2, borderRadius: 3 }}>{success}</Alert>}

            <Button
              type="submit" variant="contained" color="primary"
              fullWidth disabled={loading}
              sx={{ mt: 3, py: 1.4, fontSize: '1rem' }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Se connecter'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">ou</Typography>
          </Divider>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Pas encore de compte ?{' '}
              <Typography
                component={Link} to="/register" variant="body2"
                sx={{ color: 'primary.main', fontWeight: 700, textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' } }}
              >
                S'inscrire
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
