import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SpeedIcon from "@mui/icons-material/Speed";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Fleet", icon: <LocalShippingIcon />, path: "/vehicles" },
  { text: "Drivers", icon: <PeopleIcon />, path: "/drivers" },
  { text: "Driver Behavior", icon: <SpeedIcon />, path: "/driver-behavior" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer 
      variant="permanent" 
      sx={{ 
        width: 280,
        '& .MuiDrawer-paper': { 
          width: 280,
          backgroundColor: '#1a237e', // Deep blue background
          color: '#fff',
          borderRight: 'none',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
        } 
      }}
    >
      <Box 
        sx={{ 
          p: 3, 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(45deg, #1a237e 0%, #283593 100%)'
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 800,
            color: '#fff',
            fontFamily: '"Poppins", sans-serif',
            letterSpacing: '0.5px',
            mb: 0.5
          }}
        >
          FleetWise
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.85rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}
        >
          Smart Fleet Management
        </Typography>
      </Box>
      
      <List sx={{ mt: 2, px: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              mx: 1,
              borderRadius: 2,
              mb: 0.5,
              transition: 'all 0.3s ease',
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                '& .MuiListItemIcon-root': {
                  color: '#64ffda', // Teal accent color
                },
                '& .MuiListItemText-primary': {
                  color: '#64ffda',
                  fontWeight: 600,
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                transform: 'translateX(5px)',
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                minWidth: '40px'
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                letterSpacing: '0.3px'
              }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* Footer Section */}
      <Box 
        sx={{ 
          mt: 'auto', 
          p: 2, 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.5)',
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.75rem'
          }}
        >
          © 2024 FleetWise
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;