import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#7C3AED',
        light: '#A78BFA',
        dark: '#5B21B6',
        contrastText: '#fff',
      },
      secondary: {
        main: '#EC4899',
        light: '#F9A8D4',
        dark: '#BE185D',
      },
      success: { main: '#10B981' },
      warning: { main: '#F59E0B' },
      error: { main: '#EF4444' },
      background: {
        default: mode === 'light' ? '#F5F3FF' : '#0F0A1E',
        paper: mode === 'light'
          ? 'rgba(255,255,255,0.85)'
          : 'rgba(30,18,60,0.85)',
      },
      text: {
        primary: mode === 'light' ? '#1E1B4B' : '#EDE9FE',
        secondary: mode === 'light' ? '#6D28D9' : '#A78BFA',
      },
      divider: mode === 'light' ? 'rgba(124,58,237,0.15)' : 'rgba(167,139,250,0.15)',
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      h4: { fontWeight: 800, letterSpacing: '-0.02em' },
      h5: { fontWeight: 700, letterSpacing: '-0.01em' },
      h6: { fontWeight: 700 },
      subtitle1: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.02em' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundAttachment: 'fixed',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: mode === 'light'
              ? '1px solid rgba(124,58,237,0.12)'
              : '1px solid rgba(167,139,250,0.12)',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 12px 40px rgba(124,58,237,0.18)'
                : '0 12px 40px rgba(124,58,237,0.35)',
            },
          },
          elevation3: {
            boxShadow: mode === 'light'
              ? '0 4px 24px rgba(124,58,237,0.12)'
              : '0 4px 24px rgba(0,0,0,0.5)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            padding: '8px 22px',
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 4px 16px rgba(124,58,237,0.35)' },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #6D28D9 0%, #DB2777 100%)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#7C3AED',
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            backgroundColor: mode === 'light'
              ? 'rgba(245,243,255,0.8)'
              : 'rgba(15,10,30,0.85)',
            borderBottom: mode === 'light'
              ? '1px solid rgba(124,58,237,0.15)'
              : '1px solid rgba(167,139,250,0.12)',
            boxShadow: '0 2px 20px rgba(124,58,237,0.08)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 600 },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: { fontWeight: 600, textTransform: 'none', fontSize: '0.95rem' },
        },
      },
    },
  });
