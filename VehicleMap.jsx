import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Paper, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = 'http://localhost/backend/api';
const containerStyle = { width: '100%', height: '300px' };
const defaultCenter = { lat: 34.05, lng: -118.25 };

const VehicleMap = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [telemetryData, setTelemetryData] = useState({});
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCeU4TOPlhsJ0GqdgpKia5jm5Z0DdY6mCk"
  });

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        setLoading(true);
        const telemetryPromises = data.map(vehicle => 
          axios.get(`${API_URL}/telemetry.php?vehicle_id=${vehicle.vehicle_id}`)
            .then(response => response.data?.data?.[0] || null)
            .catch(() => null)
        );

        const telemetryResults = await Promise.all(telemetryPromises);
        const telemetryMap = {};
        data.forEach((vehicle, index) => {
          telemetryMap[vehicle.vehicle_id] = telemetryResults[index];
        });
        setTelemetryData(telemetryMap);

        // Find the first valid vehicle location to center the map
        const firstValidTelemetry = telemetryResults.find(t => 
          t && !isNaN(Number(t.latitude)) && !isNaN(Number(t.longitude))
        );
        
        if (firstValidTelemetry) {
          setMapCenter({
            lat: Number(firstValidTelemetry.latitude),
            lng: Number(firstValidTelemetry.longitude)
          });
        }
      } catch (err) {
        setError('Failed to fetch telemetry data');
        console.error('Error fetching telemetry:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTelemetry();
    // Refresh telemetry data every 10 seconds
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, [data]);

  if (!isLoaded || loading) return (
    <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
      <CircularProgress />
    </Paper>
  );

  if (error) return (
    <Paper sx={{ p: 2 }}>
      <Typography color="error">{error}</Typography>
    </Paper>
  );

  const validMarkers = data
    .filter(v => {
      const telemetry = telemetryData[v.vehicle_id];
      if (!telemetry) return false;
      const { latitude, longitude } = telemetry;
      return latitude !== undefined && longitude !== undefined && 
             !isNaN(Number(latitude)) && !isNaN(Number(longitude));
    })
    .map(v => {
      const telemetry = telemetryData[v.vehicle_id];
      const position = {
        lat: Number(telemetry.latitude),
        lng: Number(telemetry.longitude)
      };
      return (
        <Marker 
          key={v.vehicle_id} 
          position={position}
          title={`${v.name} (${v.vehicle_id})`}
        />
      );
    });

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Vehicle Locations</Typography>
      <GoogleMap 
        mapContainerStyle={containerStyle} 
        center={mapCenter} 
        zoom={12}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {validMarkers}
      </GoogleMap>
    </Paper>
  );
};

export default VehicleMap;
