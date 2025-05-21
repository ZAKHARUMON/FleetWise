import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Toolbar,
  Grid,
  Paper,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  CircularProgress,
  Button,
  Avatar,
  Chip,
  Tooltip,
  Badge,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { fetchDrivers, fetchAvailableVehicles, assignVehicle } from "../api/mockApi";

// Define color palette
const colors = {
  primary: '#1a237e',     // Deep blue
  secondary: '#0d47a1',   // Darker blue
  accent: '#4CAF50',      // Green
  warning: '#FF9800',     // Orange
  error: '#f44336',       // Red
  success: '#4CAF50',     // Green
  background: '#f8fafc',  // Light gray
  cardBg: '#ffffff',      // White
  text: '#1a237e',        // Dark blue text
  textSecondary: '#64748b', // Gray text
  border: 'rgba(26, 35, 126, 0.1)' // Primary color with opacity
};

// Mock data - Replace with actual API call
const mockDrivers = [
  {
    id: 1,
    name: "John Smith",
    status: "active",
    vehicle: "Truck-001",
    hours: 42,
    rating: 4.8,
    avatar: null,
    license: "CDL-123456",
    experience: "5 years"
  },
  // Add more mock drivers as needed
];

const Drivers = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState(2);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignDriver, setAssignDriver] = useState(null);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [assignSnackbar, setAssignSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchDrivers(); // Use real API
      setDrivers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch driver data');
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddDriver = () => {
    navigate('/drivers/add');
  };

  const openAssignDialog = async (driver) => {
    setAssignDriver(driver);
    setAssignDialogOpen(true);
    setSelectedVehicle("");
    const vehicles = await fetchAvailableVehicles();
    setAvailableVehicles(vehicles);
  };

  const closeAssignDialog = () => {
    setAssignDialogOpen(false);
    setAssignDriver(null);
    setAvailableVehicles([]);
    setSelectedVehicle("");
  };

  const handleAssignVehicle = async () => {
    if (!selectedVehicle || !assignDriver) return;
    const res = await assignVehicle(selectedVehicle, assignDriver.id);
    setAssignSnackbar({ open: true, message: res.message, severity: res.status === "success" ? "success" : "error" });
    closeAssignDialog();
    fetchData(); // Refresh driver list if needed
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.license?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const DriverCard = ({ driver }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        borderRadius: 2, 
        height: '100%',
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar 
            sx={{ 
              bgcolor: colors.primary,
              width: 56, 
              height: 56,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {driver.avatar ? (
              <img src={driver.avatar} alt={driver.name} />
            ) : (
              <PersonIcon />
            )}
          </Avatar>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: colors.text,
                fontFamily: '"Inter", sans-serif'
              }}
            >
              {driver.name}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: colors.textSecondary,
                fontFamily: '"Inter", sans-serif'
              }}
            >
              License Number: {driver.license_number}
            </Typography>
          </Box>
        </Stack>
        
        <Divider sx={{ borderColor: colors.border }} />
        
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip 
            icon={<DirectionsCarIcon />} 
            label={driver.vehicle}
            size="small"
            sx={{ 
              bgcolor: `${colors.primary}10`,
              color: colors.primary,
              fontFamily: '"Inter", sans-serif'
            }}
          />
          <Chip 
            icon={<AccessTimeIcon />} 
            label={`${isNaN(driver.hours) ? 0 : driver.hours}h`}
            size="small"
            sx={{ 
              bgcolor: `${colors.success}10`,
              color: colors.success,
              fontFamily: '"Inter", sans-serif'
            }}
          />
          <Chip 
            icon={<StarIcon />} 
            label={isNaN(driver.rating) ? 'N/A' : driver.rating}
            size="small"
            sx={{ 
              bgcolor: `${colors.warning}10`,
              color: colors.warning,
              fontFamily: '"Inter", sans-serif'
            }}
          />
        </Stack>

        <Typography 
          variant="body2" 
          sx={{ 
            color: colors.textSecondary,
            fontFamily: '"Inter", sans-serif'
          }}
        >
          Experience: {driver.experience}
        </Typography>
        <Button variant="outlined" size="small" onClick={() => openAssignDialog(driver)}>
          Assign Vehicle
        </Button>
      </Stack>
    </Paper>
  );

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: colors.background }}>
      <Toolbar />
      
      {/* Header Section with Stats */}
      <Box sx={{ mb: 4 }}>
        <Stack spacing={3}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800,
                color: colors.primary,
                fontFamily: '"Poppins", sans-serif',
                letterSpacing: '0.5px'
              }}
            >
              Driver Management
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddDriver}
                sx={{ 
                  bgcolor: colors.primary,
                  '&:hover': { bgcolor: colors.secondary },
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 3
                }}
              >
                Add Driver
              </Button>
              <Tooltip title="Notifications">
                <IconButton>
                  <Badge badgeContent={notifications} color="error">
                    <NotificationsIcon sx={{ color: colors.primary }} />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh Data">
                <IconButton 
                  onClick={fetchData} 
                  sx={{ 
                    color: colors.primary,
                    '&:hover': { 
                      backgroundColor: `${colors.primary}10`,
                      transform: 'scale(1.1)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Report">
                <IconButton 
                  sx={{ 
                    color: colors.primary,
                    '&:hover': { 
                      backgroundColor: `${colors.primary}10`,
                      transform: 'scale(1.1)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Quick Stats */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  color: 'white'
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <PersonIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {drivers.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Total Drivers
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${colors.success} 0%, #2E7D32 100%)`,
                  color: 'white'
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <DirectionsCarIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {drivers.filter(d => d.status === 'active').length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Active Drivers
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${colors.warning} 0%, #E65100 100%)`,
                  color: 'white'
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <AccessTimeIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {Math.round(drivers.reduce((acc, d) => acc + d.hours, 0) / drivers.length)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Avg. Hours
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                  color: 'white'
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <StarIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {Math.round(drivers.reduce((acc, d) => acc + d.rating, 0) / drivers.length * 10) / 10}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Avg. Rating
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Box>

      {/* Search and Filter Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 2,
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search drivers by name, license, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.textSecondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: colors.border,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary,
                  },
                },
                '& .MuiInputBase-input': {
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.95rem',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
              <Chip 
                label="Active" 
                color="success" 
                size="small"
                sx={{ fontFamily: '"Inter", sans-serif' }}
              />
              <Chip 
                label="On Leave" 
                color="warning" 
                size="small"
                sx={{ fontFamily: '"Inter", sans-serif' }}
              />
              <Chip 
                label="Training" 
                color="info" 
                size="small"
                sx={{ fontFamily: '"Inter", sans-serif' }}
              />
              <Tooltip title="Advanced Filters">
                <IconButton 
                  sx={{ 
                    color: colors.primary,
                    '&:hover': { 
                      backgroundColor: `${colors.primary}10`,
                      transform: 'scale(1.1)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs Section */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.95rem',
              minWidth: 120,
              color: colors.textSecondary,
              '&:hover': {
                color: colors.primary,
              },
            },
            '& .Mui-selected': {
              color: `${colors.primary} !important`,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: colors.primary,
              height: 3,
            },
          }}
        >
          <Tab label="All Drivers" />
          <Tab label="Active" />
          <Tab label="On Leave" />
          <Tab label="Training" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress sx={{ color: colors.primary }} />
        </Box>
      ) : error ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            textAlign: 'center', 
            color: 'error.main',
            background: colors.cardBg,
            borderRadius: 2,
            border: '1px solid #ef4444'
          }}
        >
          {error}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredDrivers.map((driver) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={driver.id}>
              <DriverCard driver={driver} />
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={assignDialogOpen} onClose={closeAssignDialog}>
        <DialogTitle>Assign Vehicle to {assignDriver?.name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Vehicle</InputLabel>
            <Select
              value={selectedVehicle}
              onChange={e => setSelectedVehicle(e.target.value)}
              label="Vehicle"
            >
              {availableVehicles.map(vehicle => (
                <MenuItem key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                  {vehicle.name} ({vehicle.vehicle_id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAssignDialog}>Cancel</Button>
          <Button onClick={handleAssignVehicle} variant="contained" disabled={!selectedVehicle}>Assign</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={assignSnackbar.open} autoHideDuration={4000} onClose={() => setAssignSnackbar({ ...assignSnackbar, open: false })}>
        <Alert severity={assignSnackbar.severity}>{assignSnackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Drivers;