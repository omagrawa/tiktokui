import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Alert,
  Button,
  Divider,
  Grid,
  Paper,
  Chip
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const Settings = () => {
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  const handleGoogleToggle = (event) => {
    const isEnabled = event.target.checked;
    setGoogleEnabled(isEnabled);
    
    if (isEnabled) {
      setShowAuthAlert(true);
    } else {
      setShowAuthAlert(false);
    }
  };

  const handleAuthenticate = () => {
    // Simulate authentication process
    alert('Redirecting to Google OAuth...');
    // In a real app, this would redirect to Google OAuth
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Configure your service integrations and preferences
      </Typography>

      {/* Google Service Integration */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Service Integrations
          </Typography>
          
          <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <GoogleIcon sx={{ fontSize: 40, color: '#4285F4' }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Google Sheets Integration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Connect your Google Sheets to automatically export data
                    </Typography>
                    {googleEnabled && (
                      <Chip 
                        icon={<CheckCircleIcon />}
                        label="Connected" 
                        color="success" 
                        size="small" 
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={googleEnabled}
                        onChange={handleGoogleToggle}
                        color="primary"
                        size="large"
                      />
                    }
                    label={googleEnabled ? 'Enabled' : 'Disabled'}
                    labelPlacement="start"
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Authentication Alert */}
            {showAuthAlert && (
              <Alert 
                severity="warning" 
                icon={<SecurityIcon />}
                sx={{ mt: 3 }}
                action={
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={handleAuthenticate}
                    variant="outlined"
                    sx={{ 
                      ml: 2,
                      backgroundColor: '#ffffff',
                      color: '#1a1a1a',
                      border: '1px solid #d1d5db',
                      '&:hover': {
                        backgroundColor: '#f9fafb',
                        borderColor: '#9ca3af',
                        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                      }
                    }}
                  >
                    Authenticate
                  </Button>
                }
              >
                <Typography variant="body2" fontWeight={600}>
                  Authentication Required
                </Typography>
                <Typography variant="body2">
                  Please authenticate with Google to enable Sheets integration. 
                  This will allow the app to read and write to your Google Sheets.
                </Typography>
              </Alert>
            )}
          </Paper>
        </CardContent>
      </Card>

      {/* Service Status */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Service Status
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <GoogleIcon sx={{ color: googleEnabled ? '#4285F4' : '#9e9e9e' }} />
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      Google Sheets
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {googleEnabled ? 'Connected and ready' : 'Not connected'}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <WarningIcon sx={{ color: '#ff9800' }} />
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      API Status
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      All systems operational
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings; 