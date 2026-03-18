import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, List, ListItem, ListItemText, Divider, MenuItem } from '@mui/material';
import { API_BASE_URL } from '../apiConfig';

export default function Comments() {
  const [articleId, setArticleId] = useState('');
  const [articles, setArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchArticles = async () => {
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/articles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setArticles(Array.isArray(data) ? data : []);
      else setError(data.message || 'Erreur lors du chargement des articles');
    } catch {
      setError('Erreur réseau');
    }
  };

  const fetchComments = async (id) => {
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/articles/${id}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setComments(data);
      else setError(data.message || 'Erreur lors du chargement des commentaires');
    } catch {
      setError('Erreur réseau');
    }
  };

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line
  }, []);

  const handleArticleChange = (e) => {
    const value = e.target.value;
    setArticleId(value);
    if (value) fetchComments(value);
    else setComments([]);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contenu: content }),
      });
      if (res.ok) {
        setContent('');
        fetchComments(articleId);
      } else {
        const data = await res.json();
        setError(data.message || 'Erreur lors de l\'ajout du commentaire');
      }
    } catch {
      setError('Erreur réseau');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/articles/${articleId}/comments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments(articleId);
    } catch {
      // silencieux
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Typography variant="h5" mb={2}>
        Commentaires
      </Typography>
      <Paper elevation={3} sx={{ p: 3, minWidth: 350, mb: 3 }}>
        <TextField
          label="Article"
          value={articleId}
          onChange={handleArticleChange}
          fullWidth
          select
        >
          {articles.map((a) => (
            <MenuItem key={a.id} value={String(a.id)}>
              {a.titre} (ID: {a.id})
            </MenuItem>
          ))}
        </TextField>
        {articleId && (
          <Box component="form" onSubmit={handleAdd} mt={2} display="flex" gap={2}>
            <TextField
              label="Ajouter un commentaire"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Ajouter
            </Button>
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
      {articleId && (
        <Paper elevation={2} sx={{ p: 2, minWidth: 350 }}>
          <Typography variant="subtitle1" mb={1}>
            Liste des commentaires
          </Typography>
          <List>
            {comments.map((c, index) => (
              <React.Fragment key={c.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(c.id)}
                    >
                      Supprimer
                    </Button>
                  }
                >
                  <ListItemText
                    primary={c.contenu}
                    secondary={
                      <Typography variant="caption">
                        par {c.auteur}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < comments.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
            {comments.length === 0 && (
              <Typography variant="body2">Aucun commentaire pour cet article.</Typography>
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
}
