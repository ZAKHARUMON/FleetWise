import { useEffect, useState } from "react";
import {
  Box,
  Toolbar,
  Typography,
  Grid,
  Paper,
  Stack,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  Tooltip,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import VehicleCard from "../components/VehicleCard";
import { fetchVehicles, getLatestTelemetry, fetchVehicleAssignmentsWithDriver } from "../api/mockApi";
import RefreshIcon from '@mui/icons-material/Refresh';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import TimelineIcon from '@mui/icons-material/Timeline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DownloadIcon from '@mui/icons-material/Download';

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

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState(3);

  const fetchAndSet = async () => {
    try {
      setLoading(true);
      const vehiclesData = await fetchVehicles();
      // Ensure vehiclesData is an array before proceeding
      if (!Array.isArray(vehiclesData)) {
        setVehicles([]);
        setError('Invalid data format received from server');
        return;
      }
      // Fetch latest telemetry for each vehicle
      const vehiclesWithTelemetry = await Promise.all(
        vehiclesData.map(async (vehicle) => {
          try {
            const telemetry = await getLatestTelemetry(vehicle.vehicle_id);
            return {
              ...vehicle,
              telemetry: telemetry || null
            };
          } catch (err) {
            return {
              ...vehicle,
              telemetry: null
            };
          }
        })
      );
      setVehicles(vehiclesWithTelemetry);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vehicle data');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSet();
    const interval = setInterval(fetchAndSet, 10000);
    return () => clearInterval(interval);
  }, []);

  // Calculate dashboard metrics
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.telemetry?.speed > 0).length;
  const maintenanceNeeded = vehicles.filter(v => v.telemetry?.gas_level < 20).length;
  const operationalRate = totalVehicles ? (activeVehicles / totalVehicles) * 100 : 0;

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        borderRadius: 2,
        height: '100%',
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        color: 'white',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 1.5, 
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );

  const VehicleAssignmentsTable = () => {
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
      fetchVehicleAssignmentsWithDriver().then(setAssignments);
    }, []);

    return (
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ p: 2 }}>Vehicle Assignments</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vehicle</TableCell>
              <TableCell>Vehicle ID</TableCell>
              <TableCell>Assigned Driver</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map(row => (
              <TableRow key={`${row.vehicle_id} `}>
                <TableCell>{row.vehicle_name}</TableCell>
                <TableCell>{row.vehicle_code}</TableCell>
                <TableCell>{row.driver_name || "Unassigned"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: colors.background }}>
      <Toolbar />
      
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
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
            Fleet Overview
          </Typography>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Notifications">
              <IconButton>
                <Badge badgeContent={notifications} color="error">
                  <NotificationsIcon sx={{ color: colors.primary }} />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={fetchAndSet} 
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
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Vehicles"
            value={totalVehicles}
            icon={<DirectionsCarIcon sx={{ color: 'white' }} />}
            color={colors.primary}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Vehicles"
            value={activeVehicles}
            icon={<LocalShippingIcon sx={{ color: 'white' }} />}
            color={colors.success}
            subtitle={`${operationalRate.toFixed(1)}% operational`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Maintenance"
            value={maintenanceNeeded}
            icon={<WarningIcon sx={{ color: 'white' }} />}
            color={colors.warning}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Operational Rate"
            value={`${operationalRate.toFixed(1)}%`}
            icon={<CheckCircleIcon sx={{ color: 'white' }} />}
            color={colors.secondary}
          />
        </Grid>
      </Grid>

      {/* Vehicle Status Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2, 
          mb: 4,
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <SpeedIcon sx={{ color: colors.primary }} />
          <Typography 
            variant="h6" 
            sx={{ 
              color: colors.primary,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600
            }}
          >
            Vehicle Status
          </Typography>
        </Stack>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: colors.primary }} />
          </Box>
        ) : error ? (
          <Typography 
            color="error" 
            align="center"
            sx={{ fontFamily: '"Inter", sans-serif' }}
          >
            {error}
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {vehicles.map(vehicle => (
              <Grid item key={`${vehicle.vehicle_id}-${vehicle.id}`} xs={12} sm={6} md={4} lg={3}>
                <VehicleCard vehicle={vehicle} />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Performance Metrics Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              height: '100%',
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <TimelineIcon sx={{ color: colors.primary }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: colors.primary,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600
                }}
              >
                Fleet Performance
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: colors.text,
                      fontFamily: '"Inter", sans-serif'
                    }}
                  >
                    Operational Efficiency
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: colors.success,
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 600
                    }}
                  >
                    {operationalRate.toFixed(1)}%
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={operationalRate} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: `${colors.success}15`,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: colors.success
                    }
                  }}
                />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: colors.text,
                      fontFamily: '"Inter", sans-serif'
                    }}
                  >
                    Maintenance Status
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: colors.warning,
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 600
                    }}
                  >
                    {maintenanceNeeded} vehicles
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={(maintenanceNeeded / totalVehicles) * 100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: `${colors.warning}15`,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: colors.warning
                    }
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              height: '100%',
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <DirectionsCarIcon sx={{ color: colors.primary }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: colors.primary,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600
                }}
              >
                Quick Actions
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: colors.textSecondary,
                  fontFamily: '"Inter", sans-serif'
                }}
              >
                No pending actions
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <VehicleAssignmentsTable />
    </Box>
  );
};

export default Dashboard;