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
  Chip,
  Divider,
  Tooltip,
  Badge
} from "@mui/material";
import { fetchVehicles } from "../api/mockApi";
import VehicleTable from "../components/VehicleTable";
import VehicleCharts from "../components/VehicleCharts";
import VehicleMap from "../components/VehicleMap";
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SpeedIcon from '@mui/icons-material/Speed';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from "react-router-dom";

// Enhanced color palette
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

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchVehicles();
      setVehicles(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vehicle data');
      console.error('Error fetching vehicles:', err);
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

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.id?.toString().includes(searchQuery) ||
    vehicle.status?.toLowerCase().includes(searchQuery.toLowerCase())
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
              Fleet Management
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/Vehicles/add")}
                sx={{ 
                  bgcolor: colors.primary,
                  '&:hover': { bgcolor: colors.secondary },
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 3
                }}
              >
                Add Vehicle
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
                  <LocalShippingIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {vehicles.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Total Vehicles
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
                  <SpeedIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {vehicles.filter(v => v.status === 'active').length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Active Vehicles
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
                  <WarningIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {vehicles.filter(v => v.status === 'maintenance').length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      In Maintenance
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
                  <SpeedIcon sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {((vehicles.filter(v => v.status === 'active').length / vehicles.length) * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Operational Rate
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
              placeholder="Search vehicles by name, ID, or status..."
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
                label="Maintenance" 
                color="warning" 
                size="small"
                sx={{ fontFamily: '"Inter", sans-serif' }}
              />
              <Chip 
                label="Inactive" 
                color="error" 
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
          <Tab label="All Vehicles" />
          <Tab label="Active" />
          <Tab label="Maintenance" />
          <Tab label="Inactive" />
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
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
              }}
            >
              <VehicleTable data={filteredVehicles} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                borderRadius: 2, 
                height: '100%',
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
              }}
            >
              <VehicleCharts data={filteredVehicles} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                borderRadius: 2, 
                height: '100%',
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
              }}
            >
              <VehicleMap data={filteredVehicles} />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Vehicles;