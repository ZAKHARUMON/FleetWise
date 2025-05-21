import { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Button, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert } from "@mui/material";
import { fetchDrivers, fetchAvailableVehicles, assignVehicle } from "../api/mockApi";

const AssignVehicle = () => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchDrivers().then(setDrivers);
    fetchAvailableVehicles().then(setVehicles);
  }, []);

  const handleAssign = async () => {
    if (!selectedDriver || !selectedVehicle) {
      setSnackbar({ open: true, message: "Please select both driver and vehicle.", severity: "error" });
      return;
    }
    const res = await assignVehicle(selectedVehicle, selectedDriver);
    setSnackbar({ open: true, message: res.message, severity: res.status === "success" ? "success" : "error" });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Assign Vehicle to Driver</Typography>
      <Paper sx={{ p: 3, maxWidth: 500 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Driver</InputLabel>
              <Select value={selectedDriver} onChange={e => setSelectedDriver(e.target.value)} label="Driver">
                {drivers.map(driver => (
                  <MenuItem key={driver.id} value={driver.id}>{driver.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Vehicle</InputLabel>
              <Select value={selectedVehicle} onChange={e => setSelectedVehicle(e.target.value)} label="Vehicle">
                {vehicles.map(vehicle => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>{vehicle.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleAssign}>Assign</Button>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AssignVehicle; 