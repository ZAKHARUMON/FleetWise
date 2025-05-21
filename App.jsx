import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { darkTheme } from "./theme";
import Dashboard from "./pages/Dashboard";
// Add more pages as needed
import Sidebar from "./components/Sidebar";
import Drivers from "./pages/Drivers";
import Settings from "./pages/Settings";
import Vehicles from "./pages/Vehicles";
import AddDrivers from "./pages/AddDrivers";
import AddVehicle from "./pages/AddVehicle";
import AssignVehicle from "./pages/AssignVehicle";
import DriverBehavior from "./pages/DriverBehavior";

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Drivers" element={<Drivers />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Vehicles" element={<Vehicles />} />
          <Route path="/AddDrivers" element={<AddDrivers />} />
          <Route path="/Drivers/add" element={<AddDrivers />} />
          <Route path="/Vehicles/add" element={<AddVehicle />} />
          <Route path="/assign-vehicle" element={<AssignVehicle />} />
          <Route path="/driver-behavior" element={<DriverBehavior />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
