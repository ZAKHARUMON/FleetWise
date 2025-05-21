import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Paper, Typography } from "@mui/material";

const VehicleCharts = ({ data }) => {
  const chartData = data.map((v, i) => ({
    name: v.id || `Vehicle ${i + 1}`,
    Speed: typeof v.speed === 'number' && !isNaN(v.speed) ? v.speed : 0,
    Pollution: typeof v.pollution_ppm === 'number' && !isNaN(v.pollution_ppm) ? v.pollution_ppm : 0
  }));

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Speed & Pollution Overview</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#333" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Speed" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Pollution" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default VehicleCharts;
