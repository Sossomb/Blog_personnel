import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { API_BASE_URL } from '../apiConfig';

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const token = localStorage.getItem('token');

  const fetchFriends = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setFriends(data);
    } catch {
      // silencieux
    }
  };

  const fetchPending = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/friends/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPending(data);
    } catch {
      // silencieux
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchPending();
    // eslint-disable-next-line
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setHasSearched(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/friends/search?username=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setResults(Array.isArray(data) ? data : []);
      else setError(data.message || 'Erreur lors de la recherche');
    } catch {
      setError('Erreur réseau');
    }
  };

  const sendRequest = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/friends/send/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Impossible d'envoyer la demande.");
        return;
      }
      setInfo(data.message || 'Demande envoyée.');
      fetchPending();
    } catch {
      setError('Erreur réseau');
    }
  };

  const acceptRequest = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/friends/accept/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFriends();
      fetchPending();
    } catch {
      // silencieux
    }
  };

  const rejectRequest = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/friends/reject/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPending();
    } catch {
      // silencieux
    }
  };

  const blockFriend = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/friends/block/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFriends();
    } catch {
      // silencieux
    }
  };

  const deleteFriend = async (id) => {
    if (!window.confirm('Supprimer cet ami ?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/friends/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFriends();
    } catch {
      // silencieux
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Typography variant="h5" mb={2}>
        Mes amis
      </Typography>

      <Paper elevation={3} sx={{ p: 3, minWidth: 350, mb: 3 }}>
        <Typography variant="subtitle1" mb={1}>
          Rechercher un utilisateur
        </Typography>
        <Box component="form" onSubmit={handleSearch} display="flex" gap={2}>
          <TextField
            label="Nom d'utilisateur"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary">
            Rechercher
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {info && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {info}
          </Alert>
        )}
        {(results.length > 0 || hasSearched) && (
          <Box mt={3}>
            <Typography variant="subtitle2" mb={1}>
              Résultats de recherche
            </Typography>
            {results.length === 0 ? (
              <Typography variant="body2">Aucun utilisateur trouvé.</Typography>
            ) : (
              <List>
                {results.map((u, index) => (
                  <React.Fragment key={u.id}>
                    <ListItem
                      secondaryAction={
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => sendRequest(u.id)}
                        >
                          Ajouter
                        </Button>
                      }
                    >
                      <ListItemText primary={u.username} />
                    </ListItem>
                    {index < results.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        )}
      </Paper>

      <Paper elevation={2} sx={{ p: 2, minWidth: 350, mb: 3 }}>
        <Typography variant="subtitle1" mb={1}>
          Demandes en attente
        </Typography>
        <List>
          {pending.map((r, index) => (
            <React.Fragment key={r.id}>
              <ListItem
                secondaryAction={
                  r.type === 'recue' ? (
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => acceptRequest(r.id)}
                      >
                        Accepter
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() => rejectRequest(r.id)}
                      >
                        Refuser
                      </Button>
                    </Box>
                  ) : null
                }
              >
                <ListItemText
                  primary={r.username}
                  secondary={r.type === 'recue' ? 'Demande reçue' : 'Demande envoyée'}
                />
              </ListItem>
              {index < pending.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
          {pending.length === 0 && (
            <Typography variant="body2">Aucune demande en attente.</Typography>
          )}
        </List>
      </Paper>

      <Paper elevation={2} sx={{ p: 2, minWidth: 350 }}>
        <Typography variant="subtitle1" mb={1}>
          Liste de mes amis
        </Typography>
        <List>
          {friends.map((f, index) => (
            <React.Fragment key={f.id}>
              <ListItem
                secondaryAction={
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={() => blockFriend(f.id)}
                    >
                      Bloquer
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => deleteFriend(f.id)}
                    >
                      Supprimer
                    </Button>
                  </Box>
                }
              >
                <ListItemText primary={f.username} />
              </ListItem>
              {index < friends.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
          {friends.length === 0 && (
            <Typography variant="body2">Vous n'avez encore aucun ami.</Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
}
