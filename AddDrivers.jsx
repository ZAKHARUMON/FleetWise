import { useState } from 'react';
import {
  Box,
  Typography,
  Toolbar,
  Paper,
  Grid,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { addDriver } from "../api/mockApi";

const AddDriver = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    licenseNumber: '',
    licenseType: '',
    experience: '',
    phoneNumber: '',
    email: '',
    address: '',
    emergencyContact: '',
    vehiclePreference: '',
    status: 'active',
    otherDetails: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const driverData = {
        user_id: 1, // Since we're not using user authentication, we'll use a default user_id
        name: `${formData.firstName} ${formData.lastName}`,
        license_number: formData.licenseNumber,
        license_expiry: "2025-12-31",
        experience: parseInt(formData.experience) || 0,
        vehicle: formData.vehiclePreference || 'any',
        hours: 0,
        rating: 0,
        avatar: "",
        other_details: formData.otherDetails
      };

      const driverResponse = await addDriver(driverData);
      
      if (driverResponse.status === 'success') {
        setSnackbar({
          open: true,
          message: 'Driver added successfully',
          severity: 'success'
        });
        setTimeout(() => {
          navigate('/drivers');
        }, 2000);
      } else {
        throw new Error(driverResponse.message || 'Failed to add driver');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add driver',
        severity: 'error'
      });
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5' }}>
      <Toolbar />
      
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={() => navigate('/drivers')} sx={{ color: '#4CAF50' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0A1929' }}>
            Add New Driver
          </Typography>
        </Stack>
      </Box>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#0A1929' }}>
                Personal Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* License Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#0A1929' }}>
                License Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="License Number"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>License Type</InputLabel>
                <Select
                  name="licenseType"
                  value={formData.licenseType}
                  onChange={handleChange}
                  label="License Type"
                >
                  <MenuItem value="CDL-A">CDL-A</MenuItem>
                  <MenuItem value="CDL-B">CDL-B</MenuItem>
                  <MenuItem value="CDL-C">CDL-C</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#0A1929' }}>
                Additional Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Years of Experience"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Vehicle Preference</InputLabel>
                <Select
                  name="vehiclePreference"
                  value={formData.vehiclePreference}
                  onChange={handleChange}
                  label="Vehicle Preference"
                >
                  <MenuItem value="truck">Truck</MenuItem>
                  <MenuItem value="van">Van</MenuItem>
                  <MenuItem value="any">Any</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Emergency Contact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Other Details"
                name="otherDetails"
                multiline
                rows={3}
                value={formData.otherDetails}
                onChange={handleChange}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/drivers')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ 
                    bgcolor: '#4CAF50',
                    '&:hover': { bgcolor: '#388E3C' }
                  }}
                >
                  Save Driver
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddDriver;