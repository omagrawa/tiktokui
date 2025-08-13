import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Tabs, 
  Tab, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TableViewIcon from '@mui/icons-material/TableView';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate, useLocation } from 'react-router-dom';
import FileUpload from './FileUpload';
import DataView from './DataView';
import Settings from './Settings';

function NavigationTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const handleTabChange = (event, newValue) => {
    if (newValue === 0) {
      navigate('/');
    } else if (newValue === 1) {
      navigate('/data');
    } else if (newValue === 2) {
      navigate('/settings');
    }
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const getCurrentTab = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname === '/data') return 1;
    if (location.pathname === '/settings') return 2;
    return 0;
  };

  const menuItems = [
    { label: 'Upload Excel', path: '/', icon: <CloudUploadIcon /> },
    { label: 'View Data', path: '/data', icon: <TableViewIcon /> },
    { label: 'Settings', path: '/settings', icon: <SettingsIcon /> }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'primary.main' }}>
          TikTok Excel Uploader
        </Typography>
      </Box>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem 
            key={item.label}
            onClick={() => handleTabChange(null, index)}
            sx={{
              mb: 1,
              mx: 1,
              borderRadius: 1,
              backgroundColor: location.pathname === item.path ? 'primary.light' : 'transparent',
              color: location.pathname === item.path ? 'primary.main' : 'text.primary',
              '&:hover': {
                backgroundColor: location.pathname === item.path ? 'primary.light' : 'action.hover',
                transform: 'translateX(5px)',
                transition: 'all 0.2s ease'
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
              minWidth: '40px'
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              borderRadius: '0 16px 16px 0',
              boxShadow: '0px 10px 40px -10px rgba(0,0,0,0.2)'
            },
          }}
        >
          {drawer}
        </Drawer>
      </>
    );
  }

  return (
    <Tabs 
      value={getCurrentTab()} 
      onChange={handleTabChange} 
      sx={{ 
        height: '100%',
        color: 'white',
        '& .MuiTab-root': {
          color: 'white',
          fontWeight: 500,
          fontSize: '0.95rem',
          textTransform: 'none',
          minWidth: 120,
          padding: '8px 16px',
          height: '100%',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: 'white'
          },
          '&.Mui-selected': {
            color: 'white',
            fontWeight: 600,
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        },
        '& .MuiTabs-indicator': {
          backgroundColor: 'white',
          height: 3
        }
      }}
    >
      <Tab icon={<CloudUploadIcon sx={{ mb: 0.5, fontSize: '1.1rem' }} />} iconPosition="start" label="Upload Excel" />
      <Tab icon={<TableViewIcon sx={{ mb: 0.5, fontSize: '1.1rem' }} />} iconPosition="start" label="View Data" />
      <Tab 
        icon={<SettingsIcon sx={{ mb: 0.5, fontSize: '1.1rem' }} />} 
        iconPosition="start" 
        label="Settings"
        onClick={() => navigate('/settings')}
      />
    </Tabs>
  );
}

function App() {
  // Create a custom theme
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1a1a1a',
        light: '#f0f0f0',
        dark: '#000000',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#00A4EF',
        light: '#6AD1FF',
        dark: '#0078BD',
        contrastText: '#ffffff',
      },
      background: {
        default: '#f7f9fc',
        paper: '#ffffff',
      },
      text: {
        primary: '#333333',
        secondary: '#717171',
      },
    },
    typography: {
      fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            boxShadow: 'none',
            textTransform: 'none',
            fontWeight: 500,
            border: '1px solid transparent',
            '&:hover': {
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
              transform: 'none',
            },
          },
          contained: {
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            border: '1px solid #1a1a1a',
            '&:hover': {
              backgroundColor: '#333333',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
              transform: 'none',
            },
          },
          outlined: {
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
            border: '1px solid #d1d5db',
            '&:hover': {
              backgroundColor: '#f9fafb',
              borderColor: '#9ca3af',
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
              transform: 'none',
            },
          },
          text: {
            color: '#1a1a1a',
            '&:hover': {
              backgroundColor: '#f9fafb',
              transform: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="sticky" elevation={0} sx={{ backgroundColor: theme.palette.primary.main }}>
            <Toolbar sx={{ height: { xs: 64, md: 70 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  src="/favicon.ico" 
                  alt="Logo" 
                  variant="rounded"
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    mr: 1.5,
                    display: { xs: 'none', sm: 'block' }
                  }} 
                />
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    flexGrow: 1,
                    fontWeight: 700,
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.4rem' },
                    letterSpacing: '-0.5px'
                  }}
                >
                  TikTok Excel Uploader
                </Typography>
              </Box>
              <Box sx={{ ml: 'auto' }}>
                <NavigationTabs />
              </Box>
            </Toolbar>
          </AppBar>
          
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              bgcolor: 'background.default',
              minHeight: 'calc(100vh - 70px)'
            }}
          >
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
              <Routes>
                <Route path="/" element={<FileUpload />} />
                <Route path="/data" element={<DataView />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Container>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
