import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const API_URL = 'http://localhost/backend/api/mpu9250_endpoint.php';

const DriverBehavior = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedDriver, setSelectedDriver] = useState('all');
  const [loading, setLoading] = useState(true);
  const [behaviorData, setBehaviorData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBehaviorData();
  }, [selectedDriver]);

  const fetchBehaviorData = async () => {
    try {
      setLoading(true);
      console.log('Fetching data from:', `${API_URL}?vehicle_id=${selectedDriver}`);
      
      const response = await fetch(`${API_URL}?vehicle_id=${selectedDriver}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      if (Array.isArray(data)) {
        setBehaviorData(data);
      } else if (data.data && Array.isArray(data.data)) {
        setBehaviorData(data.data);
      } else {
        setBehaviorData([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching behavior data:', err);
      setError(err.message || 'Failed to fetch behavior data');
      setBehaviorData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = selectedDriver === 'all'
    ? behaviorData
    : behaviorData.filter(row => row.vehicle_id === selectedDriver);

  const drivers = [...new Set(behaviorData.map(row => row.vehicle_id))];

  // Prepare data for radar chart
  const radarData = filteredData.length > 0 ? [{
    subject: 'Harsh Braking',
    value: filteredData.filter(row => row.harsh_braking).length,
    fullMark: filteredData.length,
  }, {
    subject: 'Rapid Acceleration',
    value: filteredData.filter(row => row.rapid_acceleration).length,
    fullMark: filteredData.length,
  }, {
    subject: 'Sharp Turns',
    value: filteredData.filter(row => row.sharp_turn).length,
    fullMark: filteredData.length,
  }] : [];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Driver Behavior Monitoring
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Driver</InputLabel>
          <Select
            value={selectedDriver}
            label="Select Driver"
            onChange={(e) => setSelectedDriver(e.target.value)}
          >
            <MenuItem value="all">All Drivers</MenuItem>
            {drivers.map((driver) => (
              <MenuItem key={driver} value={driver}>
                {driver}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Behavior Score
              </Typography>
              <Typography variant="h4">
                {Math.round(filteredData.reduce((acc, curr) => acc + parseFloat(curr.behavior_score), 0) / filteredData.length)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Harsh Braking Incidents
              </Typography>
              <Typography variant="h4">
                {filteredData.filter(row => row.harsh_braking).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Rapid Acceleration
              </Typography>
              <Typography variant="h4">
                {filteredData.filter(row => row.rapid_acceleration).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Sharp Turns
              </Typography>
              <Typography variant="h4">
                {filteredData.filter(row => row.sharp_turn).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Behavior Score Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="behavior_score" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Incident Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="Incidents" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Data Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Vehicle ID</TableCell>
                <TableCell align="right">Harsh Braking</TableCell>
                <TableCell align="right">Rapid Acceleration</TableCell>
                <TableCell align="right">Sharp Turn</TableCell>
                <TableCell align="right">Heading</TableCell>
                <TableCell align="right">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover key={index}>
                    <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{row.vehicle_id}</TableCell>
                    <TableCell align="right">{row.harsh_braking ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="right">{row.rapid_acceleration ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="right">{row.sharp_turn ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="right">{row.heading?.toFixed(1)}°</TableCell>
                    <TableCell align="right">{row.behavior_score}%</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default DriverBehavior; 