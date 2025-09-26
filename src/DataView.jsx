import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Collapse,
  Tooltip,
  Stack,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios';
import config from './config';
import DeleteIcon from '@mui/icons-material/Delete';
import TableRowsIcon from '@mui/icons-material/TableRows';
import GroupIcon from '@mui/icons-material/Group';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// Available job statuses for filter
const jobStatuses = ['All', 'active', 'completed', 'pending', 'failed'];

const columns = [
  { key: '_id', label: 'Job ID', sortable: true },
  { key: 'contentStatus', label: 'Content Status', sortable: true },
  { key: 'creatorStatus', label: 'Creator Status', sortable: true },
  { key: 'Hashtags', label: 'Hashtags', sortable: true },
  { key: 'Content_Type', label: 'Content Type', sortable: true },
  { key: 'Language', label: 'Language', sortable: true },
  { key: 'Time_Period(7,14,30)', label: 'Time Period', sortable: true },
  { key: 'Min_Views', label: 'Min Views', sortable: true },
  { key: 'Min_Likes', label: 'Min Likes', sortable: true },
  { key: 'Min_Comments', label: 'Min Comments', sortable: true },
  { key: 'Video_Length_(sec)', label: 'Video Length (sec)', sortable: true },
  { key: 'Min_Followers', label: 'Min Followers', sortable: true },
  { key: 'Max_Followers', label: 'Max Followers', sortable: true },
  { key: 'Number_of_Required_Results', label: 'Required Results', sortable: true },
  { key: 'tatalDataCount', label: 'Total Data Count', sortable: true },
  { key: 'afterFilterdataCount', label: 'After Filter Count', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true },
  { key: 'updatedAt', label: 'Updated', sortable: true },
  { key: 'apifyDatasetId', label: 'Apify Info', sortable: false },
  { key: 'action', label: 'Actions', sortable: false }
];

const DataView = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState(null);
  const [creatingCreatorJobId, setCreatingCreatorJobId] = useState(null);

  // Fetch jobs from API
  useEffect(() => {
      fetchJobs();
  }, []);


  useEffect(()=>{
    const statusInterval = setInterval(()=>{
      updateJobStatuses();
    }, 10000)

    return () => clearInterval(statusInterval);
  },[])

  // Apply sorting and filtering when data or filters change
  useEffect(() => {
    applyFiltersAndSort();
  }, [allJobs, selectedStatus, searchTerm, sortField, sortDirection]);


  console.log('setAllJobs', allJobs)
  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get(config.getApiUrl('/api/jobs'));
      if (response.data && response.data.jobs) {
        setAllJobs(response.data.jobs);
        setFilteredJobs(response.data.jobs);
      }
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      // Demo fallback
      const demoJobs = [
        {
          "_id": "686f9e2504bfd9055475baaf",
          "contentStatus": "completed",
          "creatorStatus": "pending",
          "Hashtags": "trending, best",
          "Content_Type": "Organic Post",
          "Language": "english",
          "Time_Period(7,14,30)": 30,
          "Min_Views": 1000,
          "Min_Likes": 2000,
          "Min_Comments": 5,
          "Video_Length_(sec)": 20,
          "Min_Followers": 5,
          "Max_Followers": 2000,
          "Number_of_Required_Results": 50,
          "tatalDataCount": 76,
          "afterFilterdataCount": 2,
          "createdAt": "2025-07-10T11:04:05.788Z",
          "updatedAt": "2025-07-10T11:04:32.408Z",
          "apifyDatasetId": "pMnOWGf0RZ0RfpgHr",
          "apifyRunId": "gFynKhMBun7ASJAA6",
          "sheetUrl": "https://docs.google.com/spreadsheets/d/1OZ8CmVutbHebrns3jtzO1lzoJD6k796DXgBbsiGhmZo/edit"
        },
        {
          "_id": "686f9fa3bccc7c41d8c6d711",
          "contentStatus": "active",
          "creatorStatus": null,
          "Hashtags": "trending, best",
          "Content_Type": "Organic Post",
          "Language": "english",
          "Time_Period(7,14,30)": 30,
          "Min_Views": 1000,
          "Min_Likes": 2000,
          "Min_Comments": 5,
          "Video_Length_(sec)": 20,
          "Min_Followers": 5,
          "Max_Followers": 2000,
          "Number_of_Required_Results": 50,
          "createdAt": "2025-07-10T11:10:27.748Z",
          "updatedAt": "2025-07-10T11:10:27.748Z"
        },
        {
          "_id": "686fa04ecac3f44308501e8d",
          "contentStatus": "active",
          "creatorStatus": null,
          "Hashtags": "trending, best",
          "Content_Type": "Organic Post",
          "Language": "english",
          "Time_Period(7,14,30)": 30,
          "Min_Views": 1000,
          "Min_Likes": 2000,
          "Min_Comments": 5,
          "Video_Length_(sec)": 20,
          "Min_Followers": 5,
          "Max_Followers": 2000,
          "Number_of_Required_Results": 50,
          "createdAt": "2025-07-10T11:13:18.578Z",
          "updatedAt": "2025-07-10T11:13:18.578Z"
        },
        {
          "_id": "686fa0cbc338ca97c4ac2db3",
          "contentStatus": "completed",
          "creatorStatus": "completed",
          "Hashtags": "trending, best",
          "Content_Type": "Organic Post",
          "Language": "english",
          "Time_Period(7,14,30)": 30,
          "Min_Views": 1000,
          "Min_Likes": 2000,
          "Min_Comments": 5,
          "Video_Length_(sec)": 20,
          "Min_Followers": 5,
          "Max_Followers": 2000,
          "Number_of_Required_Results": 50,
          "tatalDataCount": 76,
          "afterFilterdataCount": 2,
          "createdAt": "2025-07-10T11:15:23.638Z",
          "updatedAt": "2025-07-10T11:15:49.183Z",
          "apifyDatasetId": "JO8sv4l2TfgPUtrPL",
          "apifyRunId": "Ge4wWw9v6HNdnZk8f",
          "sheetUrl": "https://docs.google.com/spreadsheets/d/1fFnfzmPrkMTGUcHf9457ZLja6Pp66WF0L3Fnb4eEKJs/edit"
        }
      ];
      setAllJobs(demoJobs);
      setFilteredJobs(demoJobs);
    } finally {
      setLoading(false);
    }
  };

  // Update only job statuses without affecting other data
  const updateJobStatuses = async () => {
    try {
      const response = await axios.get(config.getApiUrl('/api/jobs'));
      if (response.data && response.data.jobs) {
        const updatedJobs = response.data.jobs;
        
        // Update only status-related fields in existing jobs
        setAllJobs(prevJobs => 
          prevJobs.map(existingJob => {
            const updatedJob = updatedJobs.find(job => job._id === existingJob._id);
            if (updatedJob) {
              return {
                ...existingJob,
                contentStatus: updatedJob.contentStatus?.toLowerCase(),
                creatorStatus: updatedJob.creatorStatus?.toLowerCase(),
                updatedAt: updatedJob.updatedAt,
                agents: updatedJob.agents?.toLowerCase(),

                // Update completion-related fields if they exist
                ...(updatedJob.tatalDataCount !== undefined && { tatalDataCount: updatedJob.tatalDataCount }),
                ...(updatedJob.afterFilterdataCount !== undefined && { afterFilterdataCount: updatedJob.afterFilterdataCount }),
                ...(updatedJob.apifyDatasetId !== undefined && { apifyDatasetId: updatedJob.apifyDatasetId }),
                ...(updatedJob.apifyRunId !== undefined && { apifyRunId: updatedJob.apifyRunId }),
                ...(updatedJob.sheetUrl !== undefined && { sheetUrl: updatedJob.sheetUrl }),
                ...(updatedJob.finalSheetUrl !== undefined && { finalSheetUrl: updatedJob.finalSheetUrl }),
                ...(updatedJob.creatorSheetUrl !== undefined && { creatorSheetUrl: updatedJob.creatorSheetUrl }),
               ...(updatedJob.failedMessagge !== undefined && { failedMessagge: updatedJob.failedMessagge }),
              };
            }
            return existingJob;
          })
        );
      }
    } catch (err) {
      // Silently fail for status updates to avoid disrupting the UI
      console.warn('Failed to update job statuses:', err);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...allJobs];
    // Filter by job status (checks both contentStatus and creatorStatus)
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(job => 
        job.contentStatus?.toLowerCase() === selectedStatus || job.creatorStatus === selectedStatus
      );
    }
    // Filter by search term (searches most fields)
    if (searchTerm) {
      filtered = filtered.filter(job =>
        Object.keys(job).some(key =>
          String(job[key] || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      // Handle date sorting
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    setFilteredJobs(filtered);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleReset = () => {
    setSelectedStatus('All');
    setSearchTerm('');
    setSortField('createdAt');
    setSortDirection('desc');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'secondary';
      case 'completed':
        return 'success';
      case 'pending':
        return 'info';
      case 'failed':
          return 'error';
      case 'not active':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    setDeletingJobId(jobId);
    try {
      await axios.delete(config.getApiUrl(`/api/jobs?jobId=${jobId}`));
      setAllJobs((prev) => prev.filter((job) => job._id !== jobId));
      setFilteredJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      setError('Failed to delete job. Please try again.');
    } finally {
      setDeletingJobId(null);
    }
  };

  const handleCreateCreatorJob = async (jobId, sheetType) => {
    setCreatingCreatorJobId(jobId);
    try {
      const res =  await axios.get(config.getApiUrl(`/api/jobs/creator/${jobId}/?sheetType=${sheetType}`));
      console.log('creator response', res);
      
      // Refresh the jobs data to get updated status
        updateJobStatuses();
    } catch (err) {
      console.log('Error creating creator job:', err);
      setError('Failed to create creator job. Please try again.');
    } finally {
      setCreatingCreatorJobId(null);
    }
  };

const handleDownloadExcelAPI = async (jobId, sheetType) => {
  setCreatingCreatorJobId(jobId);
  try {
    const res = await axios.get(config.getApiUrl(`/api/jobs/sheet/?jobId=${jobId}&sheetType=${sheetType}`), {
      responseType: 'blob' // Important: Tell axios to handle binary data
    });
    
    // Create blob URL and trigger download
    const blob = new Blob([res.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = window.URL.createObjectURL(blob);
    
    // Create temporary link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sheetType}-data-${jobId}.xlsx`; // Set filename
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('Excel file downloaded successfully');
    
    // Refresh the jobs data to get updated status
    updateJobStatuses();
  } catch (err) {
    console.log('Error downloading Excel file:', err);
    setError('Failed to download Excel file. Please try again.');
  } finally {
    setCreatingCreatorJobId(null);
  }
};

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 400,
        gap: 2
      }}>
        <CircularProgress size={40} thickness={4} />
        <Typography variant="body1" color="text.secondary">
          Loading job data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '100%' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          Job Data Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          size="small"
          onClick={fetchJobs}
          sx={{
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
          Refresh Data
        </Button>
      </Stack>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 1, 
            border: '1px solid',
            borderColor: 'error.light'
          }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
      <Card sx={{ 
        mb: 3, 
        bgcolor: 'background.paper', 
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <CardContent>
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center" 
            mb={2}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Filters & Search
            </Typography>
            <Button
              startIcon={<FilterListIcon />}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              variant="text"
              size="small"
              sx={{ 
                color: '#1a1a1a',
                '&:hover': {
                  backgroundColor: '#f9fafb',
                }
              }}
            >
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
            </Button>
          </Stack>
          
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="status-select-label">Status Filter</InputLabel>
                <Select
                  labelId="status-select-label"
                  value={selectedStatus}
                  label="Status Filter"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {jobStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status === 'All' ? 'All Statuses' : 
                        status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={5}>
              <TextField
                fullWidth
                label="Search in all fields"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Job ID, hashtags, content type..."
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                onClick={handleReset}
                fullWidth
                size="medium"
                sx={{
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
                Reset Filters
              </Button>
            </Grid>
          </Grid>
          
          {showAdvancedFilters && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Advanced filters coming soon
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        px: 1
      }}>
        <Typography variant="body2" color="text.secondary">
          <strong>{filteredJobs.length}</strong> of {allJobs.length} jobs
          {sortField !== 'createdAt' && (
            <> • Sorted by <strong>{columns.find(c => c.key === sortField)?.label || sortField}</strong> ({sortDirection === 'asc' ? 'ascending' : 'descending'})</>
          )}
        </Typography>
        
        <Box>
          <Chip 
            label={`${selectedStatus !== 'All' ? selectedStatus : 'All statuses'}`} 
            size="small" 
            variant="outlined"
            sx={{ mr: 1, bgcolor: 'background.paper' }}
          />
          {searchTerm && (
            <Chip 
              label={`"${searchTerm}"`} 
              size="small" 
              variant="outlined"
              onDelete={() => setSearchTerm('')}
              sx={{ bgcolor: 'background.paper' }}
            />
          )}
        </Box>
      </Box>
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          maxHeight: 650,
          overflowX: 'auto',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          '& .MuiTable-root': {
            borderCollapse: 'separate',
            borderSpacing: 0
          }
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell
                  key={col.key}
                  sx={{ 
                    minWidth: 120, 
                    cursor: col.sortable ? 'pointer' : 'default',
                    backgroundColor: 'background.paper',
                    borderBottom: '2px solid',
                    borderBottomColor: 'divider',
                    fontWeight: 600,
                    color: sortField === col.key ? 'primary.main' : 'text.primary',
                    padding: '12px 16px',
                    whiteSpace: 'nowrap'
                  }}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {col.label}
                    {col.sortable && (
                      sortField === col.key ? (
                        sortDirection === 'asc' ? 
                          <ArrowUpwardIcon fontSize="small" color="primary" sx={{ fontSize: 16 }} /> : 
                          <ArrowDownwardIcon fontSize="small" color="primary" sx={{ fontSize: 16 }} />
                      ) : null
                    )}
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredJobs.map((job) => (
              <TableRow 
                key={job._id} 
                hover
                sx={{
                  '&:nth-of-type(even)': {
                    backgroundColor: 'background.default',
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  '& .MuiTableCell-root': {
                    borderBottom: '1px solid',
                    borderBottomColor: 'divider',
                    padding: '10px 16px'
                  }
                }}
              >
                {columns.map(col => {
                  if (col.key === '_id') {
                    return (
                      <TableCell key={col.key}>
                        <Tooltip title={`ID: ${job._id}`} placement="top">
                          <Typography
                            variant="body2"
                            fontFamily="monospace"
                            sx={{
                              cursor: 'help',
                              color: 'text.primary',
                              fontWeight: 500
                            }}
                          >
                            {job._id.substring(0, 8)}...
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    );
                  }
                  if (col.key === 'contentStatus' || col.key === 'creatorStatus') {
                    let displayValue = null;
                    let isFailedStatus = false;
                    let failureMessage = null;

                    console.log('job status', job.contentStatus, job.creatorStatus, job.finalSheetUrl, job.failedMessagge, job.creatorErrorMessage);
                    
                    if (col.key === 'contentStatus') {
                      if (job.contentStatus?.toLowerCase() !== "failed" && job.contentStatus) {
                        displayValue = job.contentStatus?.toLowerCase();
                      } else if (job.contentStatus?.toLowerCase() === "failed") {
                        displayValue = "failed";
                        isFailedStatus = true;
                        failureMessage = job.failedMessagge || job.failedMessage ||'Unknown error';
                      }
                    } else if (col.key === 'creatorStatus') {
                      if (job.creatorStatus?.toLowerCase() !== "failed" ) {
                        displayValue = job.creatorStatus;
                      } else if (job.creatorStatus?.toLowerCase() === "failed") {
                        displayValue = "failed";
                        isFailedStatus = true;
                        failureMessage = job.creatorErrorMessage || job.failedMessage || job.failedMessagge|| 'Unknown error';
                      }
                    }
                    
                    return (
                      <TableCell key={col.key}>
                        {displayValue ? (
                          isFailedStatus ? (
                            <Tooltip title={`Failed: ${failureMessage}`} placement="top">
                              <Chip
                                label="failed"
                                size="small"
                                color="error"
                                sx={{
                                  fontWeight: 500,
                                  borderRadius: '4px',
                                  backgroundColor: 'transparent',
                                  border: '1px solid',
                                  borderColor: theme => theme.palette.error.main,
                                  color: theme => theme.palette.error.main,
                                  textTransform: 'capitalize',
                                  cursor: 'help'
                                }}
                              />
                            </Tooltip>
                          ) : (
                            <Chip
                              label={displayValue?.toLowerCase()}
                              size="small"
                              color={getStatusColor(displayValue?.toLowerCase())}
                              sx={{
                                fontWeight: 500,
                                borderRadius: '4px',
                                backgroundColor: 'transparent',
                                border: '1px solid',
                                borderColor: theme => `${theme.palette[getStatusColor(displayValue?.toLowerCase())].main}`,
                                color: theme => `${theme.palette[getStatusColor(displayValue?.toLowerCase())].main}`,
                                textTransform: 'capitalize'
                              }}
                            />
                          )
                        ) : (
                          <Chip
                              label={'Not Active'}
                              size="small"
                              color={getStatusColor('Not Active')}
                              sx={{
                                fontWeight: 500,
                                borderRadius: '4px',
                                backgroundColor: 'transparent',
                                border: '1px solid',
                                borderColor: theme => `${theme.palette[getStatusColor('Not Active')].main}`,
                                color: theme => `${theme.palette[getStatusColor('Not Active')].main}`,
                                textTransform: 'capitalize'
                              }}
                            />
                        )}
                      </TableCell>
                    );
                  }
                  if (col.key === 'createdAt' || col.key === 'updatedAt') {
                    return (
                      <TableCell key={col.key}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            whiteSpace: 'nowrap',
                            color: 'text.secondary',
                            fontSize: '0.875rem'
                          }}
                        >
                          {formatDate(job[col.key])}
                        </Typography>
                      </TableCell>
                    );
                  }
                  if (col.key === 'apifyDatasetId') {
                    return (
                      <TableCell key={col.key}>
                        {job.apifyDatasetId ? (
                          <Stack spacing={0.5}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                              Dataset: <Box component="span" sx={{ ml: 0.5, fontFamily: 'monospace' }}>{job.apifyDatasetId.substring(0, 8)}...</Box>
                            </Typography>
                            {job.apifyRunId && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                Run: <Box component="span" sx={{ ml: 0.5, fontFamily: 'monospace' }}>{job.apifyRunId.substring(0, 8)}...</Box>
                              </Typography>
                            )}
                          </Stack>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Not available
                          </Typography>
                        )}
                      </TableCell>
                    );
                  }
                  if (col.key === 'action') {
                    const isContentCompleted = job.contentStatus && String(job.contentStatus).toLowerCase() === 'completed' || job.agents?.toLowerCase() == 'content' && job?.contentStatus?.toLowerCase() == 'completed';
                    const isCreatorCompleted = job.creatorStatus && String(job.creatorStatus).toLowerCase() === 'completed' || job.agents?.toLowerCase() == 'creator' && job?.creatorStatus?.toLowerCase() == 'completed';
                    const showPlayIcon = job.finalSheetUrl && !job.creatorSheetUrl || job.agents?.toLowerCase() == 'content' && job.contentStatus?.toLowerCase() == 'completed' && job?.agents?.toLowerCase() !== 'both';
                    const contentShowPlayIcon = job.creatorStatus?.toLowerCase() == 'completed' && job?.agents?.toLowerCase() == 'creator' && job?.agents?.toLowerCase() !== 'both';
                    const errorMessage = job.failedMessagge || job.failedMessage || job.creatorErrorMessage;
                    
                    return (
                      <TableCell key={col.key}>
                        <Stack direction="row" spacing={1} alignItems="center">

                           {contentShowPlayIcon && (
                            <Tooltip title="Create Creator Job">
                              <IconButton
                                size="small"
                                sx={{ 
                                  color: '#059669',
                                  bgcolor: '#ecfdf5',
                                  border: '1px solid #a7f3d0',
                                  p: '4px',
                                  '&:hover': {
                                    bgcolor: '#d1fae5',
                                    borderColor: '#6ee7b7',
                                  }
                                }}
                                onClick={() => handleCreateCreatorJob(job._id, 'content')}
                                disabled={creatingCreatorJobId === job._id}
                              >
                                {creatingCreatorJobId === job._id ? (
                                  <CircularProgress size={16} color="inherit" />
                                ) : (
                                  <PlayArrowIcon fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                          )}
                          {isContentCompleted && (
                            <Tooltip title="View Content Sheet">
                              <IconButton
                                size="small"
                                sx={{ 
                                  color: '#1a1a1a',
                                  bgcolor: '#f9fafb',
                                  border: '1px solid #d1d5db',
                                  p: '4px',
                                  '&:hover': {
                                    bgcolor: '#f3f4f6',
                                    borderColor: '#9ca3af',
                                  }
                                }}
                                onClick={() =>handleDownloadExcelAPI(job._id, 'content')}
                              >
                                <TableRowsIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {showPlayIcon && (
                            <Tooltip title="Create Creator Job">
                              <IconButton
                                size="small"
                                sx={{ 
                                  color: '#059669',
                                  bgcolor: '#ecfdf5',
                                  border: '1px solid #a7f3d0',
                                  p: '4px',
                                  '&:hover': {
                                    bgcolor: '#d1fae5',
                                    borderColor: '#6ee7b7',
                                  }
                                }}
                                onClick={() => handleCreateCreatorJob(job._id, 'creator')}
                                disabled={creatingCreatorJobId === job._id}
                              >
                                {creatingCreatorJobId === job._id ? (
                                  <CircularProgress size={16} color="inherit" />
                                ) : (
                                  <PlayArrowIcon fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                          )}
                          {isCreatorCompleted && (
                            <Tooltip title="View Creator Sheet">
                              <IconButton
                                size="small"
                                sx={{ 
                                  color: '#1a1a1a',
                                  bgcolor: '#f9fafb',
                                  border: '1px solid #d1d5db',
                                  p: '4px',
                                  '&:hover': {
                                    bgcolor: '#f3f4f6',
                                    borderColor: '#9ca3af',
                                  }
                                }}
                                onClick={() =>handleDownloadExcelAPI(job._id, 'creator')}
                              >
                                <GroupIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete Job">
                            <IconButton
                              size="small"
                              sx={{ 
                                color: '#dc2626',
                                bgcolor: '#fef2f2',
                                border: '1px solid #fecaca',
                                p: '4px',
                                '&:hover': {
                                  bgcolor: '#fee2e2',
                                  borderColor: '#fca5a5',
                                }
                              }}
                              onClick={() => handleDeleteJob(job._id)}
                              disabled={deletingJobId === job._id}
                            >
                              {deletingJobId === job._id ? (
                                <CircularProgress size={16} color="inherit" />
                              ) : (
                                <DeleteIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                          
                          {errorMessage && (
                            <Tooltip 
                              title={
                                <Box sx={{ p: 1, maxWidth: 300 }}>
                                  <Typography variant="caption" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>Error Details:</Typography>
                                  <Typography variant="caption" component="div" sx={{ whiteSpace: 'pre-wrap' }}>{errorMessage}</Typography>
                                </Box>
                              }
                              arrow
                              placement="top"
                            >
                              <ErrorIcon 
                                color="error" 
                                fontSize="small"
                                sx={{ 
                                  cursor: 'pointer',
                                  ml: 1,
                                  '&:hover': {
                                    transform: 'scale(1.2)',
                                    transition: 'transform 0.2s ease-in-out'
                                  }
                                }}
                              />
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    );
                  }
                  
                  // Default cell formatting
                  const value = job[col.key];
                  return (
                    <TableCell key={col.key}>
                      {value === undefined || value === null ? (
                        <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                          N/A
                        </Typography>
                      ) : typeof value === 'number' ? (
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {value.toLocaleString()}
                        </Typography>
                      ) : (
                        <Typography variant="body2">
                          {String(value)}
                        </Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {filteredJobs.length === 0 && !loading && (
        <Paper 
          sx={{ 
            textAlign: 'center', 
            py: 6,
            px: 2,
            mt: 2,
            bgcolor: 'background.paper',
            border: '1px dashed',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No matching jobs found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: 'auto', mb: 2 }}>
            Try changing your search terms or filters to see more results
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            sx={{
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
            Reset all filters
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default DataView; 
