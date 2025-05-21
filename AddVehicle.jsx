import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addVehicle } from "../api/mockApi";

const AddVehicle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    model: "",
    year: "",
    status: "active",
    licensePlate: "",
    bs_norm: "BS4",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addVehicle(formData);
      navigate("/Vehicles");
    } catch (error) {
      console.error("Error adding vehicle:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          background: "#ffffff",
          border: "1px solid rgba(26, 35, 126, 0.1)",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: "#1a237e", fontWeight: 600 }}>
          Add New Vehicle
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vehicle Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Vehicle Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Vehicle Type"
                  required
                >
                  <MenuItem value="truck">Truck</MenuItem>
                  <MenuItem value="van">Van</MenuItem>
                  <MenuItem value="car">Car</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="License Plate"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                  required
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Bharat Stage Norm</InputLabel>
                <Select
                  name="bs_norm"
                  value={formData.bs_norm}
                  onChange={handleChange}
                  label="Bharat Stage Norm"
                  required
                >
                  <MenuItem value="BS3">BS3</MenuItem>
                  <MenuItem value="BS4">BS4</MenuItem>
                  <MenuItem value="BS6">BS6</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate("/Vehicles")}
                  sx={{
                    color: "#1a237e",
                    borderColor: "#1a237e",
                    "&:hover": {
                      borderColor: "#0d47a1",
                      backgroundColor: "rgba(26, 35, 126, 0.04)",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#1a237e",
                    "&:hover": { bgcolor: "#0d47a1" },
                  }}
                >
                  Add Vehicle
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddVehicle; 