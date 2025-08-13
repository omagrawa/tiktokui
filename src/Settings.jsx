import React, { useState, useEffect, useRef } from 'react';
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
  Chip,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  LinearProgress,
  Stack,
  Container,
  CardHeader,
  Fade
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import StorageIcon from '@mui/icons-material/Storage';
import config from './config';

const Settings = () => {
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  const passWordRef = useRef('')
  // const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [envVars, setEnvVars] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [openPasswordDialog, setOpenPasswordDialog] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [showMessage, setShowMessage] = useState(false);

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

  const fetchEnvironmentVariables = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(config.getApiUrl(`/api/environment`));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data) {
        // Transform the API response to match our local state format
        const transformedVars = data.data.map(item => ({
          _id: item._id,
          key: item.key,
          value: item.value,
          isSensitive: item.isSensitive,
          description: item.description || ''
        }));
        setEnvVars(transformedVars);
      }
    } catch (err) {
      console.error('Failed to fetch environment variables:', err);
      setError('Failed to load environment variables. Please try again later.');
      // Fallback to local storage if API fails
      const savedVars = localStorage.getItem('envVars');
      if (savedVars) {
        setEnvVars(JSON.parse(savedVars));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e && e.preventDefault();
    if (passWordRef.current.value === 'tik@1123') {
      setAuthenticated(true);
      setOpenPasswordDialog(false);
      // Fetch environment variables from API
      fetchEnvironmentVariables();
    } else {
      alert('Incorrect password');
      // setPassword('');
      passWordRef.current.value = '';
    }
  };

  const handleEnvVarChange = (id, field, value) => {
    setEditValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleEdit = (env) => {
    setEditingId(env._id || `temp-${Date.now()}`);
    setEditValues(prev => ({
      ...prev,
      [env._id || `temp-${Date.now()}`]: {
        key: env.key,
        value: env.value,
        isSensitive: env.isSensitive || false,
        description: env.description || ''
      }
    }));
  };

  const handleSave = async (id, index) => {
    try {
      setLoading(true);
      const updatedVar = { ...editValues[id] };
      const updatedVars = [...envVars];
      
      if (id.startsWith('temp-')) {
        // New variable
        const { key, value, isSensitive, description } = updatedVar;
        updatedVars.push({ key, value, isSensitive, description });
        
        // In a real app, you would make an API call to create the variable
        // For now, we'll just update the local state
        setEnvVars(updatedVars);
      } else {
        // Existing variable - make API call to update
        try {
          const response = await fetch(config.getApiUrl(`/api/environment/${id}`), {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              value: updatedVar.value
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          
          if (result.success) {
            // Update local state with the server's response
            updatedVars[index] = { ...updatedVars[index], ...updatedVar };
            setEnvVars(updatedVars);
            
            setMessage('Environment variable updated successfully!');
            setMessageType('success');
          } else {
            throw new Error(result.message || 'Failed to update variable');
          }
        } catch (err) {
          console.error('API Error:', err);
          throw new Error('Failed to update environment variable. Please try again.');
        }
      }
      
      setEditingId(null);
      setShowMessage(true);
      
    } catch (err) {
      console.error('Failed to save environment variable:', err);
      setError(err.message || 'Failed to save environment variable. Please try again.');
      setMessage('Failed to save environment variable.');
      setMessageType('error');
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (id) => {
    setEditingId(null);
    // If it was a new variable being added, remove it
    if (id.startsWith('temp-')) {
      setEnvVars(envVars.filter(env => !env._id || !env._id.startsWith('temp-')));
    }
  };

  const addEnvVar = () => {
    const newId = `temp-${Date.now()}`;
    setEnvVars([...envVars, { _id: newId, key: '', value: '' }]);
    setEditingId(newId);
    setEditValues(prev => ({
      ...prev,
      [newId]: { key: '', value: '', isSensitive: false, description: '' }
    }));
  };

  const saveEnvVars = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you would make an API call to save each variable
      // For now, we'll just save to localStorage and show a success message
      localStorage.setItem('envVars', JSON.stringify(envVars));
      
      // Show success message
      setMessage('Environment variables saved successfully!');
      setMessageType('success');
      setShowMessage(true);
      
    } catch (err) {
      console.error('Failed to save environment variables:', err);
      setError('Failed to save environment variables. Please try again.');
      setMessage('Failed to save environment variables.');
      setMessageType('error');
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };

  // Password Dialog
  const PasswordDialog = () => (
    <Dialog 
      open={openPasswordDialog} 
      onClose={() => setOpenPasswordDialog(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 4
        }
      }}
    >
      <form onSubmit={handlePasswordSubmit}>
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: 'primary.50',
                border: '1px solid',
                borderColor: 'primary.200'
              }}
            >
              <LockIcon color="primary" sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Admin Authentication
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Secure access required
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Please enter the admin password to access system settings and configuration.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Admin Password"
            type="password"
            fullWidth
            variant="outlined"
            inputRef={passWordRef}
            placeholder="Enter your admin password"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button 
            onClick={() => setOpenPasswordDialog(false)} 
            color="inherit"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Authenticate
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );

  if (!authenticated) {
    return <PasswordDialog />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: 'primary.50',
                border: '1px solid',
                borderColor: 'primary.200'
              }}
            >
              <SettingsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                System Settings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage integrations and configuration
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Stack spacing={3}>
          {/* Service Integrations Card */}
          {/* <Card elevation={2} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
            <CardHeader
              avatar={
                <IntegrationInstructionsIcon sx={{ fontSize: 24, color: 'primary.main' }} />
              }
              title={
                <Typography variant="h6" fontWeight="semibold">
                  Service Integrations
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary">
                  Configure external service connections and integrations
                </Typography>
              }
              sx={{ pb: 1 }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Paper 
                sx={{ 
                  p: 3, 
                  backgroundColor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 2
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: 'white',
                          border: '1px solid',
                          borderColor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <GoogleIcon sx={{ fontSize: 32, color: '#4285F4' }} />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="medium" gutterBottom>
                          Google Sheets Integration
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Connect to Google Sheets for automated data export and synchronization
                        </Typography>
                        {googleEnabled && (
                          <Chip 
                            icon={<CheckCircleIcon />}
                            label="Active Connection" 
                            color="success" 
                            size="small" 
                            variant="filled"
                            sx={{ borderRadius: 1 }}
                          />
                        )}
                      </Box>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={googleEnabled}
                            onChange={handleGoogleToggle}
                            color="primary"
                            size="medium"
                          />
                        }
                        label={
                          <Typography variant="body2" fontWeight="medium">
                            {googleEnabled ? 'Enabled' : 'Disabled'}
                          </Typography>
                        }
                        labelPlacement="start"
                      />
                    </Box>
                  </Grid>
                </Grid>

                {showAuthAlert && (
                  <Fade in={showAuthAlert}>
                    <Alert 
                      severity="info" 
                      icon={<SecurityIcon />}
                      sx={{ 
                        mt: 3,
                        borderRadius: 2,
                        '& .MuiAlert-message': { width: '100%' }
                      }}
                      action={
                        <Button 
                          color="inherit" 
                          size="small" 
                          onClick={handleAuthenticate}
                          variant="outlined"
                          sx={{ 
                            borderRadius: 1,
                            borderColor: 'info.main',
                            color: 'info.main',
                            '&:hover': {
                              backgroundColor: 'info.main',
                              color: 'white'
                            }
                          }}
                        >
                          Authenticate Now
                        </Button>
                      }
                    >
                      <Typography variant="body2" fontWeight="medium" gutterBottom>
                        Authentication Required
                      </Typography>
                      <Typography variant="body2">
                        Please authenticate with Google to enable Sheets integration and grant necessary permissions.
                      </Typography>
                    </Alert>
                  </Fade>
                )}
              </Paper>
            </CardContent>
          </Card> */}

          {/* Service Status Card */}
          {/* <Card elevation={2} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
            <CardHeader
              avatar={
                <WarningIcon sx={{ fontSize: 24, color: 'warning.main' }} />
              }
              title={
                <Typography variant="h6" fontWeight="semibold">
                  Service Status
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary">
                  Real-time status of connected services and APIs
                </Typography>
              }
              sx={{ pb: 1 }}
            />
            <CardContent sx={{ pt: 0 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      border: '1px solid',
                      borderColor: googleEnabled ? 'success.light' : 'grey.300',
                      borderRadius: 2,
                      backgroundColor: googleEnabled ? 'success.50' : 'grey.50'
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <GoogleIcon sx={{ 
                        color: googleEnabled ? '#4285F4' : 'grey.400',
                        fontSize: 28
                      }} />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          Google Sheets
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {googleEnabled ? 'Connected and operational' : 'Not connected'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      border: '1px solid',
                      borderColor: 'success.light',
                      borderRadius: 2,
                      backgroundColor: 'success.50'
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CheckCircleIcon sx={{ color: 'success.main', fontSize: 28 }} />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          API Status
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          All systems operational
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card> */}

          {/* Environment Variables Editor */}
          <Card elevation={2} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
            {loading && <LinearProgress sx={{ borderRadius: '8px 8px 0 0' }} />}
            
            <CardHeader
              avatar={
                <StorageIcon sx={{ fontSize: 24, color: 'primary.main' }} />
              }
              title={
                <Typography variant="h6" fontWeight="semibold">
                  Environment Variables
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary">
                  Configure your application's environment variables and settings
                </Typography>
              }
              // action={
              //   <Stack direction="row" spacing={1}>
              //     <Tooltip title="Add new variable">
              //       <IconButton 
              //         onClick={addEnvVar} 
              //         color="primary" 
              //         disabled={loading}
              //         sx={{ 
              //           borderRadius: 1,
              //           border: '1px solid',
              //           borderColor: 'primary.main',
              //           '&:hover': {
              //             backgroundColor: 'primary.50'
              //           }
              //         }}
              //       >
              //         <AddIcon />
              //       </IconButton>
              //     </Tooltip>
              //     <Button 
              //       variant="contained" 
              //       startIcon={<SaveIcon />} 
              //       onClick={saveEnvVars}
              //       disabled={!envVars.length || loading}
              //       sx={{ borderRadius: 2 }}
              //     >
              //       {loading ? 'Saving...' : 'Save Changes'}
              //     </Button>
              //   </Stack>
              // }
              sx={{ pb: 1 }}
            />

            <CardContent sx={{ pt: 0 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
              
              {showMessage && (
                <Fade in={showMessage}>
                  <Alert 
                    severity={messageType} 
                    sx={{ mb: 3, borderRadius: 2 }} 
                    onClose={() => setShowMessage(false)}
                  >
                    {message}
                  </Alert>
                </Fade>
              )}
              
              {envVars.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <StorageIcon sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Environment Variables
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click the + button to add your first environment variable.
                  </Typography>
                </Box>
              ) : (
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  {/* Header */}
                  <Box sx={{ backgroundColor: 'grey.50', p: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={5}>
                        <Typography variant="subtitle2" fontWeight="semibold" color="text.secondary">
                          VARIABLE NAME
                        </Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="subtitle2" fontWeight="semibold" color="text.secondary">
                          VALUE
                        </Typography>
                      </Grid>
                      <Grid item xs={2} sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle2" fontWeight="semibold" color="text.secondary">
                          ACTIONS
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  {/* Variables List */}
                  <Box sx={{ p: 1 }}>
                    {envVars.map((env, index) => (
                      <Box 
                        key={env._id || `row-${index}`}
                        sx={{ 
                          p: 2,
                          borderRadius: 1,
                          '&:hover': {
                            backgroundColor: 'grey.50'
                          },
                          borderBottom: index < envVars.length - 1 ? '1px solid' : 'none',
                          borderColor: 'grey.100'
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={5}>
                            {editingId === (env._id || `temp-${index}`) ? (
                              <TextField
                                fullWidth
                                size="small"
                                placeholder="VARIABLE_NAME"
                                value={editValues[env._id || `temp-${index}`]?.key || ''}
                                onChange={(e) => handleEnvVarChange(env._id || `temp-${index}`, 'key', e.target.value)}
                                error={!editValues[env._id || `temp-${index}`]?.key}
                                helperText={!editValues[env._id || `temp-${index}`]?.key ? 'Key is required' : ''}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 1
                                  }
                                }}
                              />
                            ) : (
                              <Box>
                                <Typography variant="body2" fontWeight="medium" color="text.primary">
                                  {env.key || 'Unnamed Variable'}
                                </Typography>
                                {env.description && (
                                  <Typography variant="caption" color="text.secondary">
                                    {env.description}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Grid>
                          <Grid item xs={5}>
                            {editingId === (env._id || `temp-${index}`) ? (
                              <TextField
                                fullWidth
                                size="small"
                                type={env.isSensitive || (env.key && (
                                  env.key.toLowerCase().includes('key') || 
                                  env.key.toLowerCase().includes('secret') ||
                                  env.key.toLowerCase().includes('password') ||
                                  env.key.toLowerCase().includes('token')
                                )) ? 'password' : 'text'}
                                placeholder="Enter value"
                                value={editValues[env._id || `temp-${index}`]?.value || ''}
                                onChange={(e) => handleEnvVarChange(env._id || `temp-${index}`, 'value', e.target.value)}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 1
                                  }
                                }}
                              />
                            ) : (
                              <Box>
                                <Typography variant="body2" color="text.primary" sx={{ fontFamily: 'monospace' }}>
                                  {env.isSensitive || (env.key && (
                                    env.key.toLowerCase().includes('key') || 
                                    env.key.toLowerCase().includes('secret') ||
                                    env.key.toLowerCase().includes('password') ||
                                    env.key.toLowerCase().includes('token')
                                  )) ? '••••••••••••' : env.value || 'No value set'}
                                </Typography>
                                {(env.isSensitive || (env.key && (
                                  env.key.toLowerCase().includes('key') || 
                                  env.key.toLowerCase().includes('secret') ||
                                  env.key.toLowerCase().includes('password') ||
                                  env.key.toLowerCase().includes('token')
                                ))) && (
                                  <Chip 
                                    label="Sensitive" 
                                    size="small" 
                                    color="warning" 
                                    variant="outlined"
                                    sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                                  />
                                )}
                              </Box>
                            )}
                          </Grid>
                          <Grid item xs={2} sx={{ textAlign: 'right' }}>
                            {editingId === (env._id || `temp-${index}`) ? (
                              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                <Tooltip title="Save changes">
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => handleSave(env._id || `temp-${index}`, index)}
                                    disabled={!editValues[env._id || `temp-${index}`]?.key}
                                    sx={{ 
                                      borderRadius: 1,
                                      backgroundColor: 'success.50',
                                      '&:hover': {
                                        backgroundColor: 'success.100'
                                      }
                                    }}
                                  >
                                    <CheckIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancel editing">
                                  <IconButton
                                    size="small"
                                    color="inherit"
                                    onClick={() => handleCancel(env._id || `temp-${index}`)}
                                    sx={{ 
                                      borderRadius: 1,
                                      backgroundColor: 'grey.100',
                                      '&:hover': {
                                        backgroundColor: 'grey.200'
                                      }
                                    }}
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            ) : (
                              <Tooltip title="Edit variable">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEdit(env)}
                                  disabled={editingId !== null}
                                  sx={{ 
                                    borderRadius: 1,
                                    backgroundColor: 'primary.50',
                                    '&:hover': {
                                      backgroundColor: 'primary.100'
                                    }
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  startIcon={<LockOpenIcon />}
                  onClick={() => setAuthenticated(false)}
                  sx={{ 
                    borderRadius: 2,
                    borderColor: 'grey.300',
                    color: 'text.secondary',
                    '&:hover': {
                      borderColor: 'grey.400',
                      backgroundColor: 'grey.50'
                    }
                  }}
                >
                  Lock Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Container>
  );
};

export default Settings; 