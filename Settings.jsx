import { useState } from "react";
import {
  Box,
  Typography,
  Toolbar,
  Grid,
  Paper,
  Stack,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Card,
  CardContent,
  Tooltip,
  Badge
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import LanguageIcon from '@mui/icons-material/Language';
import StorageIcon from '@mui/icons-material/Storage';
import BackupIcon from '@mui/icons-material/Backup';
import RestoreIcon from '@mui/icons-material/Restore';
import RefreshIcon from '@mui/icons-material/Refresh';
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
  border: 'rgba(26, 35, 126, 0.1)', // Primary color with opacity
  label: '#334155',       // Darker text for labels
  inputText: '#1e293b'    // Dark text for inputs
};

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      maintenance: true,
      alerts: true,
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      theme: 'light',
    },
    data: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 30,
    }
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [notifications, setNotifications] = useState(2);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    // Implement save functionality
    setSnackbar({
      open: true,
      message: 'Settings saved successfully',
      severity: 'success'
    });
  };

  const handleBackup = () => {
    // Implement backup functionality
    setSnackbar({
      open: true,
      message: 'Backup initiated successfully',
      severity: 'success'
    });
  };

  const handleRestore = () => {
    // Implement restore functionality
    setSnackbar({
      open: true,
      message: 'Restore initiated successfully',
      severity: 'success'
    });
  };

  const SettingCard = ({ title, icon, children }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 2, 
        height: '100%',
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        {icon}
        <Typography 
          variant="h6" 
          sx={{ 
            color: colors.text,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600
          }}
        >
          {title}
        </Typography>
      </Stack>
      {children}
    </Paper>
  );

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: colors.background }}>
      <Toolbar />
      
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Stack spacing={2}>
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
                color: colors.text,
                fontFamily: '"Poppins", sans-serif',
                letterSpacing: '0.5px'
              }}
            >
              Settings
            </Typography>
            <Stack direction="row" spacing={2}>
              <Tooltip title="Notifications">
                <IconButton>
                  <Badge badgeContent={notifications} color="error">
                    <NotificationsIcon sx={{ color: colors.primary }} />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
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
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Settings">
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
          <Typography 
            variant="body1" 
            sx={{ 
              color: colors.label,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500
            }}
          >
            Manage your fleet management system preferences
          </Typography>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Notifications Settings */}
        <Grid item xs={12} md={6}>
          <SettingCard 
            title="Notifications" 
            icon={<NotificationsIcon sx={{ color: colors.primary }} />}
          >
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: colors.primary,
                        '& + .MuiSwitch-track': {
                          backgroundColor: colors.primary,
                        },
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.label,
                    fontWeight: 500
                  }}>
                    Email Notifications
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.sms}
                    onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: colors.primary,
                        '& + .MuiSwitch-track': {
                          backgroundColor: colors.primary,
                        },
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.label,
                    fontWeight: 500
                  }}>
                    SMS Notifications
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.maintenance}
                    onChange={(e) => handleSettingChange('notifications', 'maintenance', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: colors.primary,
                        '& + .MuiSwitch-track': {
                          backgroundColor: colors.primary,
                        },
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.label,
                    fontWeight: 500
                  }}>
                    Maintenance Alerts
                  </Typography>
                }
              />
            </Stack>
          </SettingCard>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <SettingCard 
            title="Security" 
            icon={<SecurityIcon sx={{ color: colors.primary }} />}
          >
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.security.twoFactor}
                    onChange={(e) => handleSettingChange('security', 'twoFactor', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: colors.primary,
                        '& + .MuiSwitch-track': {
                          backgroundColor: colors.primary,
                        },
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.label,
                    fontWeight: 500
                  }}>
                    Two-Factor Authentication
                  </Typography>
                }
              />
              <FormControl fullWidth>
                <InputLabel 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.label,
                    '&.Mui-focused': {
                      color: colors.primary
                    }
                  }}
                >
                  Session Timeout (minutes)
                </InputLabel>
                <Select
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                  label="Session Timeout (minutes)"
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    color: colors.inputText,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.border,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.primary,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.primary,
                    },
                  }}
                >
                  <MenuItem value={15} sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.inputText
                  }}>15 minutes</MenuItem>
                  <MenuItem value={30} sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.inputText
                  }}>30 minutes</MenuItem>
                  <MenuItem value={60} sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.inputText
                  }}>60 minutes</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </SettingCard>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={6}>
          <SettingCard 
            title="Preferences" 
            icon={<LanguageIcon sx={{ color: colors.primary }} />}
          >
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.label,
                    '&.Mui-focused': {
                      color: colors.primary
                    }
                  }}
                >
                  Language
                </InputLabel>
                <Select
                  value={settings.preferences.language}
                  onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                  label="Language"
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    color: colors.inputText,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.border,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.primary,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.primary,
                    },
                  }}
                >
                  <MenuItem value="en" sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.inputText
                  }}>English</MenuItem>
                  <MenuItem value="es" sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.inputText
                  }}>Spanish</MenuItem>
                  <MenuItem value="fr" sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.inputText
                  }}>French</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.label,
                    '&.Mui-focused': {
                      color: colors.primary
                    }
                  }}
                >
                  Timezone
                </InputLabel>
                <Select
                  value={settings.preferences.timezone}
                  onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                  label="Timezone"
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    color: colors.inputText,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.border,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.primary,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.primary,
                    },
                  }}
                >
                  <MenuItem value="UTC" sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.inputText
                  }}>UTC</MenuItem>
                  <MenuItem value="EST" sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.inputText
                  }}>EST</MenuItem>
                  <MenuItem value="PST" sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.inputText
                  }}>PST</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </SettingCard>
        </Grid>

        {/* Data Management */}
        <Grid item xs={12} md={6}>
          <SettingCard 
            title="Data Management" 
            icon={<StorageIcon sx={{ color: colors.primary }} />}
          >
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.data.autoBackup}
                    onChange={(e) => handleSettingChange('data', 'autoBackup', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: colors.primary,
                        '& + .MuiSwitch-track': {
                          backgroundColor: colors.primary,
                        },
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.label,
                    fontWeight: 500
                  }}>
                    Automatic Backup
                  </Typography>
                }
              />
              <FormControl fullWidth>
                <InputLabel 
                  sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.label,
                    '&.Mui-focused': {
                      color: colors.primary
                    }
                  }}
                >
                  Backup Frequency
                </InputLabel>
                <Select
                  value={settings.data.backupFrequency}
                  onChange={(e) => handleSettingChange('data', 'backupFrequency', e.target.value)}
                  label="Backup Frequency"
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    color: colors.inputText,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.border,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.primary,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.primary,
                    },
                  }}
                >
                  <MenuItem value="daily" sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.inputText
                  }}>Daily</MenuItem>
                  <MenuItem value="weekly" sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.inputText
                  }}>Weekly</MenuItem>
                  <MenuItem value="monthly" sx={{ 
                    fontFamily: '"Inter", sans-serif',
                    color: colors.inputText
                  }}>Monthly</MenuItem>
                </Select>
              </FormControl>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<BackupIcon />}
                  onClick={handleBackup}
                  fullWidth
                  sx={{
                    borderColor: colors.primary,
                    color: colors.primary,
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: colors.secondary,
                      backgroundColor: `${colors.primary}10`,
                    },
                  }}
                >
                  Backup Now
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RestoreIcon />}
                  onClick={handleRestore}
                  fullWidth
                  sx={{
                    borderColor: colors.primary,
                    color: colors.primary,
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: colors.secondary,
                      backgroundColor: `${colors.primary}10`,
                    },
                  }}
                >
                  Restore
                </Button>
              </Stack>
            </Stack>
          </SettingCard>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ 
            bgcolor: colors.primary,
            '&:hover': { bgcolor: colors.secondary },
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
            color: 'white'
          }}
        >
          Save Changes
        </Button>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            fontFamily: '"Inter", sans-serif',
            '& .MuiAlert-message': {
              color: colors.inputText
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;