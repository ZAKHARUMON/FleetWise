const API_URL = 'http://localhost/backend/api';

export const predictMaintenance = async (vehicleData) => {
  try {
    const response = await fetch(`${API_URL}/example.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mileage: vehicleData.mileage || 0,
        engine_temp: vehicleData.engine_temp || 0,
        fuel_eff: vehicleData.fuel_eff || 0,
        error_codes: vehicleData.error_codes || 0
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server did not return JSON');
    }

    return await response.json();
  } catch (error) {
    console.error('Error predicting maintenance:', error);
    throw error;
  }
}; 