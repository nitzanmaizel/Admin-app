import { createTheme, Theme } from '@mui/material/styles';

const boxShadow = '#2553b919 0px 2px 6px';

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
  direction: 'rtl',
  palette: {
    primary: { main: '#0a7ea4' },
    secondary: { main: '#ccda4e' },
    error: { main: '#fb977d' },
    warning: { main: '#f8c076' },
    success: { main: '#4bd08b' },
    background: {
      default: '#f4f6f8',
      paper: '#fff',
    },
    text: {
      primary: '#111c2d',
      secondary: '#666',
    },
    mode: 'light',
  },
  spacing: 8,
  typography: {
    fontFamily: "'Roboto','Arial', 'Helvetica', sans-serif",
    h1: {
      fontWeight: 600,
      fontSize: '2.25rem',
      lineHeight: '2.75',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.875rem',
      lineHeight: '2.25',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: '1.75',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.3125rem',
      lineHeight: '1.6',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: '1.6',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: '1.2',
    },
    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.75',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.75',
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.334',
    },
    body2: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: '1',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: '100%',
          '*': {
            '::-webkit-scrollbar': { width: '8px' },
            '::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' },
            '::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '10px' },
            '::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
          },
        },
        body: {
          margin: 0,
          padding: 0,
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          backgroundColor: '#f0f5f9',
          color: '#333',
          height: '100vh',
          overflowX: 'hidden',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: '20px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          padding: '5px 10px',
          borderRadius: '25px',
          fontWeight: '500',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: boxShadow,
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: boxShadow,
          },
        },
        // For the different color variants, we now use theme.palette
        containedPrimary: ({ theme }: { theme: Theme }) => ({
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }),
        containedSecondary: ({ theme }: { theme: Theme }) => ({
          backgroundColor: theme.palette.secondary.main,
          '&:hover': {
            backgroundColor: theme.palette.secondary.dark, // Darker shade from theme
          },
        }),
        containedError: ({ theme }: { theme: Theme }) => ({
          backgroundColor: theme.palette.error.main,
          '&:hover': {
            backgroundColor: theme.palette.error.dark,
          },
        }),
        containedWarning: ({ theme }: { theme: Theme }) => ({
          backgroundColor: theme.palette.warning.main,
          '&:hover': {
            backgroundColor: theme.palette.warning.dark,
          },
        }),
        containedSuccess: ({ theme }: { theme: Theme }) => ({
          backgroundColor: theme.palette.success.main,
          '&:hover': {
            backgroundColor: theme.palette.success.dark,
          },
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '0 20px',
          backgroundColor: '#fff',
          boxShadow: boxShadow,
          zIndex: 1000,
          transition: 'all 0.3s ease-in-out',
          width: 'auto',
          top: 0,
          left: 0,
          marginLeft: '24px',
          minHeight: '70px',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          textAlign: 'center',
          fontWeight: '500',
          fontSize: '1.25rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          borderRadius: '12px',
          boxShadow: boxShadow,
          backgroundColor: '#fff',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {},
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          borderRadius: '12px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          boxShadow: boxShadow,
        },
        paper: {
          transition: 'all 0.3s ease',
          backgroundColor: '#fff',
          boxShadow: boxShadow,
          boxSizing: 'border-box',
          maxHeight: 'calc(100vh - 40px)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          color: '#111c2d',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          ':before': {
            display: 'none',
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '0 16px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: '50px',
          height: '50px',
        },
      },
    },
  },
});

export default theme;
