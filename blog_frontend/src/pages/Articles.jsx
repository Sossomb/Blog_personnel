
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper, TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, List, ListItem, ListItemText } from '@mui/material';
import { API_BASE_URL } from '../apiConfig';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ titre: '', contenu: '', visibilite: 'public', commentaire_actives: false });
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem('token');

  const fetchArticles = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/articles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setArticles(data);
      } else {
        setError(data.message || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError('Erreur réseau');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('Vous devez être connecté pour gérer vos articles.');
      return;
    }
    fetchArticles();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/articles${editId ? `/${editId}` : ''}`, {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setForm({ titre: '', contenu: '', visibilite: 'public', commentaire_actives: false });
        setEditId(null);
        fetchArticles();
      } else {
        setError(data.message || 'Erreur lors de l\'enregistrement');
      }
    } catch (err) {
      setError('Erreur réseau');
    }
  };

  const handleEdit = (article) => {
    setForm({
      titre: article.titre,
      contenu: article.contenu,
      visibilite: article.visibilite,
      commentaire_actives: !!article.commentaire_actives
    });
    setEditId(article.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchArticles();
    } catch {}
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Typography variant="h5" mb={2}>Mes articles</Typography>
      <Paper elevation={3} sx={{ p: 3, minWidth: 350, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            name="titre"
            label="Titre"
            value={form.titre}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="contenu"
            label="Contenu"
            value={form.contenu}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            minRows={3}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="visibilite-label">Visibilité</InputLabel>
            <Select
              labelId="visibilite-label"
              name="visibilite"
              value={form.visibilite}
              label="Visibilité"
              onChange={handleChange}
            >
              <MenuItem value="prive">Privé</MenuItem>
              <MenuItem value="public">Public</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Checkbox name="commentaire_actives" checked={form.commentaire_actives} onChange={handleChange} />}
            label="Autoriser les commentaires"
          />
          <Box display="flex" gap={2} mt={2}>
            <Button type="submit" variant="contained" color="primary">{editId ? 'Modifier' : 'Créer'}</Button>
            {editId && <Button type="button" variant="outlined" color="secondary" onClick={()=>{setEditId(null);setForm({ titre: '', contenu: '', visibilite: 'public', commentaire_actives: false });}}>Annuler</Button>}
          </Box>
        </form>
      </Paper>
      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper elevation={2} sx={{ p: 2, minWidth: 350 }}>
        <List>
          {articles.map((a) => (
            <ListItem key={a.id} alignItems="flex-start" sx={{ mb: 2, borderBottom: '1px solid #eee' }}>
              <ListItemText
                primary={<><b>{a.titre}</b> <Typography variant="caption">({a.visibilite})</Typography></>}
                secondaryTypographyProps={{ component: 'div' }}
                secondary={<>
                  <div>{a.contenu}</div>
                  <div>Commentaires: {a.commentaire_actives ? 'Oui' : 'Non'}</div>
                  <Button size="small" onClick={()=>handleEdit(a)} sx={{mr:1}}>Modifier</Button>
                  <Button size="small" color="error" onClick={()=>handleDelete(a.id)}>Supprimer</Button>
                </>}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
