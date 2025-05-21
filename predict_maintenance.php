<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config/database.php';
use Config\Database;

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get vehicle_id from query parameter
    $vehicle_id = isset($_GET['vehicle_id']) ? $_GET['vehicle_id'] : null;

    if (!$vehicle_id) {
        throw new Exception("Vehicle ID is required");
    }

    // Get latest vehicle data
    $query = "SELECT 
        t.mileage,
        t.engine_status,
        t.fuel_level,
        COUNT(DISTINCT CASE WHEN m.harsh_braking = 1 THEN m.id END) as harsh_braking_count,
        COUNT(DISTINCT CASE WHEN m.rapid_acceleration = 1 THEN m.id END) as rapid_acceleration_count,
        COUNT(DISTINCT CASE WHEN m.sharp_turn = 1 THEN m.id END) as sharp_turn_count,
        AVG(m.behavior_score) as avg_behavior_score
    FROM telemetry_data t
    LEFT JOIN mpu9250_data m ON t.vehicle_id = m.vehicle_id
    WHERE t.vehicle_id = :vehicle_id
      AND t.timestamp = (SELECT MAX(timestamp) FROM telemetry_data WHERE vehicle_id = :vehicle_id)
    GROUP BY t.mileage, t.engine_status, t.fuel_level";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':vehicle_id', $vehicle_id);
    $stmt->execute();
    $vehicle_data = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$vehicle_data) {
        throw new Exception("Vehicle data not found");
    }

    // Calculate error codes based on behavior metrics
    $error_codes = 0;
    if ($vehicle_data['harsh_braking_count'] > 5) $error_codes++;
    if ($vehicle_data['rapid_acceleration_count'] > 5) $error_codes++;
    if ($vehicle_data['sharp_turn_count'] > 5) $error_codes++;
    if ($vehicle_data['avg_behavior_score'] < 70) $error_codes++;

    // Prepare data for prediction
    $prediction_data = [
        'mileage' => (float)$vehicle_data['mileage'],
        'engine_temp' => $vehicle_data['engine_status'] ? 90.0 : 60.0,
        'fuel_eff' => (float)$vehicle_data['fuel_level'] / 10,
        'error_codes' => $error_codes
    ];

    // Call Python script for prediction
    $script_path = __DIR__ . '/../predict_maintenance.py';
    if (!file_exists($script_path)) {
        throw new Exception("Prediction script not found");
    }

    $command = sprintf(
        'python3 %s %f %f %f %d 2>&1',
        $script_path,
        $prediction_data['mileage'],
        $prediction_data['engine_temp'],
        $prediction_data['fuel_eff'],
        $prediction_data['error_codes']
    );

    $prediction = shell_exec($command);
    if ($prediction === null) {
        throw new Exception("Failed to execute prediction script");
    }

    $prediction_result = json_decode($prediction, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid prediction result: " . $prediction);
    }

    if (!isset($prediction_result['maintenance_needed']) || !isset($prediction_result['confidence'])) {
        throw new Exception("Invalid prediction result format");
    }

    // Prepare response
    $response = [
        'status' => 'success',
        'data' => [
            'vehicle_id' => $vehicle_id,
            'maintenance_needed' => (bool)$prediction_result['maintenance_needed'],
            'confidence' => $prediction_result['confidence'],
            'factors' => [
                'mileage' => $prediction_data['mileage'],
                'engine_temperature' => $prediction_data['engine_temp'],
                'fuel_efficiency' => $prediction_data['fuel_eff'],
                'error_codes' => $prediction_data['error_codes']
            ],
            'recommendations' => $prediction_result['recommendations'] ?? []
        ]
    ];

    echo json_encode($response);

} catch(Exception $e) {
    error_log("Maintenance prediction error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?> 