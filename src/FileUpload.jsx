// Correct ESM import for axios in Vite/React
import React, { useState } from 'react';
import axios from 'axios';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress, 
  Box, 
  Divider, 
  Alert, 
  Snackbar, 
  Paper,
  Grid,
  CardHeader,
  Stack,
  useTheme
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import RefreshIcon from '@mui/icons-material/Refresh';

import config from './config';

const FileUpload = () => {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success'); // 'success' or 'error'
  const [showMessage, setShowMessage] = useState(false);
  const [agentType, setAgentType] = useState('Both'); // 'Creator', 'Content', or 'Both'


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    // Clear any previous messages when a new file is selected
    setShowMessage(false);
    setMessage('');
  };

  const handleDownloadTemplate = (e) => {
    // Create a link element and trigger download
    e.preventDefault();
    const link = document.createElement('a');
    link.href = '/template_for_job.xlsx';
    link.download = 'template_for_job.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async (e) => {
  
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setProcessing(false); // Reset processing state
    setShowMessage(false); // Hide any previous messages
    setMessage('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    let successMessage = '';
    let errorMessage = '';
    
    // Add agent type as a query parameter
    const params = new URLSearchParams();
    params.append('agent', agentType);
    
    try {
      const response = await axios.post(
        `${config.getApiUrl(config.UPLOAD_EXCEL)}?${params.toString()}`,
        formData,
        {
          headers: {
            'Accept': '*/*',
            // 'Referer' removed because browsers block setting it
          },
          maxBodyLength: Infinity,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(percent);
              if (percent === 100) setProcessing(true);
            }
          },
        }
      );
      successMessage = 'Upload successful!';
      setProcessing(false); // Reset processing state after successful upload

      // setTimeout(() => {
      //   // Option 1: Hard refresh to job-details page
      //   window.location.href = '/job-details';
        
      //   // Option 2: Navigate with state and then hard refresh
      //   // navigate('/job-details', { state: response.data });
      //   // setTimeout(() => window.location.reload(), 100);
        
      //   // Option 3: Just refresh the current page
      //   // window.location.reload();
      // }, 3000); // 3 second wait before redirect
    } catch (err) {
      e.preventDefault();
      console.error('Upload error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      errorMessage = 'Upload failed. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error (500). Check backend logs for details.';
      } else if (err.response?.status) {
        errorMessage = `HTTP ${err.response.status}: ${err.message}`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setProcessing(false); // Reset processing state on error
    } finally {
      setLoading(false);
      setProgress(0);
      
      // Show messages only after upload is completely finished
      if (successMessage) {
        setMessage(successMessage);
        setMessageType('success');
        setShowMessage(true);
      }
      if (errorMessage) {
        setMessage(errorMessage);
        setMessageType('error');
        setShowMessage(true);
      }
    }
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} md={8} lg={7}>
        <Card elevation={0} sx={{ overflow: 'visible' }}>
          <CardHeader
            title={
              <Typography variant="h5" fontWeight={700} color="primary">
                Upload Excel Data
              </Typography>
            }
            subheader={
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Upload your formatted Excel file to analyze TikTok data
              </Typography>
            }
            sx={{ pb: 1 }}
          />
          
          <CardContent sx={{ pt: 0 }}>
            {/* Message Display */}
            {showMessage && (
              <Snackbar 
                open={showMessage} 
                autoHideDuration={6000} 
                onClose={handleCloseMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <Alert 
                  severity={messageType} 
                  onClose={handleCloseMessage}
                  variant="filled"
                  elevation={6}
                  sx={{ width: '100%' }}
                >
                  {message}
                </Alert>
              </Snackbar>
            )}
            
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                {/* Template Download Section */}
                <Grid item xs={12} md={5}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      bgcolor: theme.palette.background.default,
                      borderRadius: 2,
                      border: '1px dashed',
                      borderColor: 'divider'
                    }}
                  >
                    <Stack spacing={2} height="100%" justifyContent="space-between">
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          Need a template?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Download our standardized Excel template for properly formatted data
                        </Typography>
                      </Box>
                      
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadTemplate}
                        size="large"
                        sx={{ 
                          py: 1.2,
                          borderRadius: 1.5,
                          fontWeight: 500,
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
                        Download Template
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
                
                {/* Upload Section */}
                <Grid item xs={12} md={7}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: file ? 'primary.main' : 'divider',
                      bgcolor: file ? 'primary.light' : 'white',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          Upload your file
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Select and upload your Excel file (.xlsx, .xls)
                        </Typography>
                      </Box>
                      
                      <Box 
                        sx={{ 
                          border: '2px dashed',
                          borderColor: file ? 'primary.main' : 'divider',
                          borderRadius: 2,
                          p: 3,
                          textAlign: 'center',
                          bgcolor: file ? 'rgba(26, 26, 26, 0.04)' : 'white',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <input
                          id="file-input"
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleFileChange}
                          disabled={loading}
                          style={{ display: 'none' }}
                        />
                        
                        {file ? (
                          <Box>
                            <InsertDriveFileIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="body1" fontWeight={500} gutterBottom>
                              {file.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {(file.size / 1024).toFixed(2)} KB
                            </Typography>
                          </Box>
                        ) : (
                          <Box>
                            <FileUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="body1" fontWeight={500} gutterBottom>
                              Drag & drop or click to browse
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Supports Excel files up to 10MB
                            </Typography>
                          </Box>
                        )}
                        
                        <Box sx={{ mt: 3, textAlign: 'left' }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Select Agent Type:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            {['Creator', 'Content', 'Both'].map((type) => (
                              <Box key={type} sx={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                  type="radio"
                                  id={`agent-${type.toLowerCase()}`}
                                  name="agent-type"
                                  value={type}
                                  checked={agentType === type}
                                  onChange={() => setAgentType(type)}
                                  style={{ marginRight: '8px', cursor: 'pointer' }}
                                />
                                <label 
                                  htmlFor={`agent-${type.toLowerCase()}`}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <Typography variant="body2" color="text.primary">
                                    {type}
                                  </Typography>
                                </label>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                        
                        <Box mt={2}>
                          <label htmlFor="file-input">
                            <Button
                              variant={file ? "outlined" : "contained"}
                              component="span"
                              startIcon={file ? <RefreshIcon /> : <CloudUploadIcon />}
                              disabled={loading}
                              size="large"
                              sx={{ 
                                mt: 1,
                                ...(file ? {
                                  backgroundColor: '#ffffff',
                                  color: '#1a1a1a',
                                  border: '1px solid #d1d5db',
                                  '&:hover': {
                                    backgroundColor: '#f9fafb',
                                    borderColor: '#9ca3af',
                                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                                  }
                                } : {
                                  backgroundColor: '#1a1a1a',
                                  color: '#ffffff',
                                  border: '1px solid #1a1a1a',
                                  '&:hover': {
                                    backgroundColor: '#333333',
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
                                  }
                                })
                              }}
                            >
                              {file ? 'Change File' : 'Select File'}
                            </Button>
                          </label>
                        </Box>
                      </Box>
                      
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={!file || loading}
                        // endIcon={<CloudUploadIcon />}
                        size="large"
                        sx={{ 
                          py: 1.5, 
                          fontWeight: 600, 
                          fontSize: '1rem',
                          backgroundColor: '#1a1a1a',
                          color: '#ffffff',
                          border: '1px solid #1a1a1a',
                          '&:hover': {
                            backgroundColor: '#333333',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
                            color:'black'
                          },
                          '&:disabled': {
                            backgroundColor: '#f3f4f6',
                            color: '#9ca3af',
                            border: '1px solid #e5e7eb',
                          }
                        }}
                      >
                        {loading ? 'Uploading...' : 'Upload File'}
                      </Button>
                      
                      {/* Manual refresh button - shows after successful upload */}
                      {!loading && !file && (
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => window.location.reload()}
                          startIcon={<RefreshIcon />}
                          sx={{ 
                            alignSelf: 'center',
                            color: '#1a1a1a',
                            '&:hover': {
                              backgroundColor: '#f9fafb',
                            }
                          }}
                        >
                          Refresh Page
                        </Button>
                      )}
                    </Stack>
                    
                    {/* Progress Bar */}
                    {loading && (
                      <Box sx={{ width: '100%', mt: 3 }}>
                        {processing ? (
                          <>
                            <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                              Processing your file...
                            </Typography>
                          </>
                        ) : (
                          <>
                            <LinearProgress 
                              variant="determinate" 
                              value={progress} 
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 4
                                }
                              }} 
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                              Uploading: {progress}% complete
                            </Typography>
                          </>
                        )}
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default FileUpload;