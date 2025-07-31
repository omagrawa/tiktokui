import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Box, Divider, Fade } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GoogleIcon from '@mui/icons-material/Google';

const mockData = {
  message: 'Data successfully saved to the job collection and processed',
  data: [
    {
      hashtags: 'showshul, uk, trending',
      'creator follower': 100,
      'creator like count': 100,
    },
  ],
  jobDetails: [
    {
      status: 'active',
      _id: '686e90eb85056cc56b94f48c',
      hashtags: 'showshul, uk, trending',
      'creator follower': 100,
      'creator like count': 100,
      createdAt: '2025-07-09T15:55:23.832Z',
      updatedAt: '2025-07-09T15:55:23.832Z',
    },
  ],
};

const JobDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const response = location.state || mockData;
  const job = response.jobDetails?.[0] || {};

  const handleConnectGoogle = () => {
    // Placeholder for Google Sheets integration
    alert('Google Sheets integration coming soon!');
  };

  return (
    <Fade in timeout={600}>
      <Box sx={{ maxWidth: 480, mx: 'auto', mt: 8 }}>
        <Card sx={{ boxShadow: 8, borderRadius: 4, p: 2 }}>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
              <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h5" fontWeight={700} color="success.main" mb={1}>
                Upload successful!
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={2}>
                {response.message}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
                Job Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Hashtags:</b> {job.hashtags || '-'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Creator Follower:</b> {job['creator follower'] || '-'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Like Count:</b> {job['creator like count'] || '-'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Status:</b> {job.status || '-'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Upload Date:</b> {job.createdAt ? new Date(job.createdAt).toLocaleString() : '-'}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Button
              variant="contained"
              color="secondary"
              startIcon={<GoogleIcon />}
              sx={{ 
                width: '100%', 
                fontWeight: 600, 
                fontSize: '1.1rem', 
                py: 1.2, 
                borderRadius: 2,
                backgroundColor: '#00A4EF',
                color: '#ffffff',
                border: '1px solid #00A4EF',
                '&:hover': {
                  backgroundColor: '#0078BD',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
                }
              }}
              onClick={handleConnectGoogle}
            >
              Please check your google sheet in your google drive
            </Button>
            <Button
              variant="text"
              sx={{ 
                mt: 2, 
                width: '100%',
                color: '#1a1a1a',
                '&:hover': {
                  backgroundColor: '#f9fafb',
                }
              }}
              onClick={() => navigate('/')}
            >
              Upload another file
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default JobDetails; 