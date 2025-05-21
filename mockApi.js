import axios from 'axios';

// Update this URL to match your current ngrok URL or local development server
const API_BASE_URL = 'http://localhost/backend/api';  // For local development
// const API_BASE_URL = 'https://your-ngrok-url.ngrok-free.app/backend/api';  // For production

// Add axios interceptor for authentication
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User related API calls
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth.php`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth.php`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Vehicle related API calls
export const fetchVehicles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vehicles.php`);
    const vehiclesArray = response.data?.data;
    if (!Array.isArray(vehiclesArray)) {
      console.error('API response does not contain a data array:', response.data);
      return [];
    }
    return vehiclesArray;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error.response?.data || error.message;
  }
};

export const getVehicleById = async (vehicleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vehicles.php?id=${vehicleId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addVehicle = async (vehicleData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/vehicles.php`, vehicleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Telemetry data related API calls
export const getVehicleTelemetry = async (vehicleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/telemetry.php?vehicle_id=${vehicleId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getLatestTelemetry = async (vehicleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/telemetry.php?vehicle_id=${vehicleId}`);
    // Return the first telemetry record, or null if none
    return response.data?.data?.[0] || null;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addTelemetryData = async (telemetryData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/telemetry.php`, { ...telemetryData, pollution_ppm: telemetryData.pollution_ppm });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchDrivers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/drivers.php`);
    return response.data?.data || [];
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addDriver = async (driverData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/drivers.php`, driverData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchAvailableVehicles = async () => {
  const response = await axios.get(`${API_BASE_URL}/available_vehicles.php`);
  return response.data?.data || [];
};

export const assignVehicle = async (vehicle_id, driver_id) => {
  const response = await axios.post(`${API_BASE_URL}/vehicle_assignments.php`, { vehicle_id, driver_id });
  return response.data;
};

export const fetchVehicleAssignmentsWithDriver = async () => {
  const response = await axios.get(`${API_BASE_URL}/vehicle_assignments_with_driver.php`);
  return response.data?.data || [];
}; 