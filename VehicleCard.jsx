import { Card, CardContent, Typography, Chip, Button, Stack, Box, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, CircularProgress, Alert } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SpeedIcon from "@mui/icons-material/Speed";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import AirIcon from "@mui/icons-material/Air";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useState, useEffect } from "react";
import { Build as BuildIcon } from '@mui/icons-material';

const API_URL = 'http://localhost/backend/api';

const VehicleCard = ({ vehicle }) => {
  const [maintenanceDialog, setMaintenanceDialog] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pollutionPrediction, setPollutionPrediction] = useState(null);
  const [pollutionDialog, setPollutionDialog] = useState(false);

  const handlePredictMaintenance = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/predict_maintenance.php?vehicle_id=${vehicle.vehicle_id}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setMaintenanceData(data.data);
        setMaintenanceDialog(true);
      } else {
        throw new Error(data.message || 'Failed to get maintenance prediction');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePredictPollution = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        engine_load: vehicle.telemetry?.engine_load || 50,
        engine_temp: vehicle.telemetry?.engine_temp || 90,
        speed: vehicle.telemetry?.speed || 40,
        hour: new Date().getHours()
      });
      const response = await fetch(`${API_URL}/predict_pollution.php?${params.toString()}`);
      const data = await response.json();
      if (data.status === 'success') {
        setPollutionPrediction(data.data.predicted_pollution);
        setPollutionDialog(true);
      } else {
        throw new Error(data.message || 'Failed to get pollution prediction');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const telemetry = vehicle.telemetry || {};
  
  // Parse telemetry values as numbers to ensure toFixed works
  const speed = telemetry.speed !== undefined ? Number(telemetry.speed) : 0;
  const latitude = telemetry.latitude !== undefined ? Number(telemetry.latitude) : 0;
  const longitude = telemetry.longitude !== undefined ? Number(telemetry.longitude) : 0;
  const gasLevel = telemetry.gas_level !== undefined ? Number(telemetry.gas_level) : 0;
  const pollution = telemetry.pollution_ppm !== undefined ? Number(telemetry.pollution_ppm) : 0;

  const pollutionStatus = pollution > 100 ? "error" : "success";
  const gasStatus = gasLevel < 20 ? "error" : "success";
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  function getBsNormLimit(bsNorm) {
    switch (bsNorm) {
      case 'BS6': return 80;
      case 'BS4': return 100;
      case 'BS3': return 120;
      default: return 100;
    }
  }

  return (
    <>
      <Card sx={{ 
        minWidth: 275,
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        color: 'white',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {vehicle.name} {vehicle.model && `(${vehicle.model})`}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              ID: {vehicle.vehicle_id}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Assigned Driver: {vehicle.driver_name || "Unassigned"}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2">
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeedIcon fontSize="small" />
              <Typography variant="body2">
                Speed: {speed.toFixed(1)} km/h
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalGasStationIcon fontSize="small" />
              <Typography variant="body2">
                Fuel: {gasLevel.toFixed(1)}%
              </Typography>
              <Chip 
                label={gasLevel < 20 ? "Low Fuel" : "OK"} 
                color={gasStatus} 
                size="small" 
                sx={{ ml: 'auto' }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AirIcon fontSize="small" />
              <Typography variant="body2">
                Pollution: {pollution.toFixed(1)} PPM ({vehicle.bs_norm})
              </Typography>
              <Chip 
                label={pollution > getBsNormLimit(vehicle.bs_norm) ? "Exceeds Limit" : "OK"} 
                color={pollution > getBsNormLimit(vehicle.bs_norm) ? "error" : "success"} 
                size="small" 
                sx={{ ml: 'auto' }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon fontSize="small" />
              <Typography variant="caption" color="text.secondary">
                Last update: {formatTimestamp(telemetry.timestamp)}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Bharat Stage: {vehicle.bs_norm || "N/A"}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} mt={2}>
            <Button 
              variant="outlined" 
              size="small"
              onClick={handlePredictMaintenance}
              disabled={loading}
              sx={{ 
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Predict Maintenance'}
            </Button>
            <Button 
              variant="outlined" 
              size="small"
              onClick={handlePredictPollution}
              disabled={loading}
              sx={{ 
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Predict Pollution
            </Button>
          </Stack>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      <Dialog 
        open={maintenanceDialog} 
        onClose={() => setMaintenanceDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Maintenance Prediction
          {maintenanceData?.maintenance_needed && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Maintenance Required
            </Alert>
          )}
        </DialogTitle>
        <DialogContent>
          {maintenanceData && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Confidence: {(maintenanceData.confidence * 100).toFixed(1)}%
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Factors Considered:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Mileage"
                    secondary={`${maintenanceData.factors.mileage.toLocaleString()} km`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Engine Temperature"
                    secondary={`${maintenanceData.factors.engine_temperature}°C`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Fuel Efficiency"
                    secondary={`${maintenanceData.factors.fuel_efficiency.toFixed(1)} km/l`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Error Codes"
                    secondary={maintenanceData.factors.error_codes}
                  />
                </ListItem>
              </List>

              {maintenanceData.recommendations.length > 0 && (
                <>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Recommendations:
                  </Typography>
                  <List>
                    {maintenanceData.recommendations.map((rec, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMaintenanceDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={pollutionDialog}
        onClose={() => setPollutionDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Pollution Prediction</DialogTitle>
        <DialogContent>
          <Typography variant="h6" align="center">
            Predicted Pollution: {pollutionPrediction ? pollutionPrediction.toFixed(2) : 'N/A'} PPM
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPollutionDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VehicleCard;
