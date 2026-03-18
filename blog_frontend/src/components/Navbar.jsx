import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar, Menu, MenuItem,
  Tooltip, Divider, useTheme,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

const NAV_LINKS = [
  { to: '/dashboard',  label: 'Tableau de bord', icon: <DashboardIcon fontSize="small" /> },
  { to: '/articles',   label: 'Articles',         icon: <ArticleIcon fontSize="small" /> },
  { to: '/friends',    label: 'Amis',             icon: <PeopleIcon fontSize="small" /> },
  { to: '/comments',   label: 'Commentaires',     icon: <ChatBubbleIcon fontSize="small" /> },
];

export default function Navbar({ mode, onToggleTheme }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  // Get user initials from stored data (fallback to "U")
  const username = localStorage.getItem('username') || 'U';
  const initials = username.substring(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" elevation={0} color="transparent">
      <Toolbar sx={{ gap: 1, minHeight: '64px !important' }}>
        {/* Logo */}
        <Box
          component={Link}
          to={token ? '/dashboard' : '/login'}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', mr: 3 }}
        >
          <EditNoteIcon sx={{ fontSize: 28, color: 'primary.main' }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}
          >
            MonBlog
          </Typography>
        </Box>

        {/* Nav Links */}
        {token && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexGrow: 1 }}>
            {NAV_LINKS.map((link) => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                startIcon={link.icon}
                sx={{
                  color: isActive(link.to) ? 'primary.main' : 'text.secondary',
                  fontWeight: isActive(link.to) ? 700 : 500,
                  bgcolor: isActive(link.to)
                    ? (theme.palette.mode === 'light' ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.2)')
                    : 'transparent',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'light'
                      ? 'rgba(124,58,237,0.08)'
                      : 'rgba(124,58,237,0.15)',
                    color: 'primary.main',
                  },
                  borderRadius: 3,
                  px: 2,
                  transition: 'all 0.2s ease',
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        )}

        {!token && <Box sx={{ flexGrow: 1 }} />}

        {/* Toggle theme */}
        <Tooltip title={mode === 'light' ? 'Mode sombre' : 'Mode clair'}>
          <IconButton
            onClick={onToggleTheme}
            sx={{
              bgcolor: 'rgba(124,58,237,0.1)',
              '&:hover': { bgcolor: 'rgba(124,58,237,0.2)' },
            }}
          >
            {mode === 'light'
              ? <Brightness4Icon sx={{ color: '#7C3AED' }} />
              : <Brightness7Icon sx={{ color: '#A78BFA' }} />}
          </IconButton>
        </Tooltip>

        {/* Auth buttons or Avatar */}
        {token ? (
          <>
            <Tooltip title={username}>
              <Avatar
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  ml: 1,
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  width: 38,
                  height: 38,
                  border: '2px solid rgba(167,139,250,0.4)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': { transform: 'scale(1.08)', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' },
                }}
              >
                {initials}
              </Avatar>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: { mt: 1, minWidth: 180, borderRadius: 3, p: 0.5 },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem disabled sx={{ opacity: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  @{username}
                </Typography>
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem
                onClick={handleLogout}
                sx={{ gap: 1.5, color: 'error.main', borderRadius: 2 }}
              >
                <LogoutIcon fontSize="small" />
                Déconnexion
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
            <Button
              component={Link} to="/login"
              variant="outlined"
              color="primary"
              sx={{ borderColor: 'rgba(124,58,237,0.5)' }}
            >
              Connexion
            </Button>
            <Button
              component={Link} to="/register"
              variant="contained"
              color="primary"
            >
              S'inscrire
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
