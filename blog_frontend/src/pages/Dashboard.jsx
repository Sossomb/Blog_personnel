
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper, List, ListItem, ListItemText } from '@mui/material';
import { API_BASE_URL } from '../apiConfig';

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vous devez être connecté pour voir le tableau de bord.');
          setLoading(false);
          return;
        }
        const res = await fetch(`${API_BASE_URL}/api/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setArticles(data.articles || []);
        } else {
          setError(data.message || 'Erreur lors du chargement');
        }
      } catch (err) {
        setError('Erreur réseau');
      }
      setLoading(false);
    };
    fetchArticles();
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Typography variant="h5" mb={2}>Tableau de bord</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper elevation={2} sx={{ p: 2, minWidth: 350 }}>
        {(!loading && !error && articles.length === 0) ? (
          <Typography variant="body1" color="text.secondary">
            Aucun article à afficher pour le moment.
          </Typography>
        ) : (
          <List>
            {articles.map((a) => (
              <ListItem key={a.id} alignItems="flex-start" sx={{ mb: 2, borderBottom: '1px solid #eee' }}>
                <ListItemText
                  primary={<><b>{a.titre}</b> <Typography variant="caption">par {a.auteur} ({a.visibilite})</Typography></>}
                  secondary={a.contenu}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
