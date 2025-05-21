<?php
header("Content-Type: application/json");
require_once '../config/database.php';
use Config\Database;

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit;
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Start transaction
    $db->beginTransaction();

    // Get vehicle ID from vehicle_id string
    $vehicle_query = "SELECT id FROM vehicles WHERE vehicle_id = :vehicle_id";
    $vehicle_stmt = $db->prepare($vehicle_query);
    $vehicle_stmt->execute([':vehicle_id' => $input['vehicle_id']]);
    $vehicle = $vehicle_stmt->fetch(PDO::FETCH_ASSOC);

    if (!$vehicle) {
        throw new Exception("Vehicle not found");
    }

    $vehicle_id = $vehicle['id'];

    // Insert/Update telemetry data
    $telemetry_query = "INSERT INTO telemetry_data (vehicle_id, latitude, longitude, speed, fuel_level, engine_status, pollution_ppm) 
              VALUES (:vehicle_id, :latitude, :longitude, :speed, :fuel_level, :engine_status, :pollution_ppm) 
              ON DUPLICATE KEY UPDATE 
              latitude = VALUES(latitude),
              longitude = VALUES(longitude),
              speed = VALUES(speed),
              fuel_level = VALUES(fuel_level),
              engine_status = VALUES(engine_status),
              pollution_ppm = VALUES(pollution_ppm),
              timestamp = CURRENT_TIMESTAMP";

    $telemetry_stmt = $db->prepare($telemetry_query);
    $telemetry_stmt->execute([
        ':vehicle_id' => $vehicle_id,
        ':latitude' => $input['latitude'],
        ':longitude' => $input['longitude'],
        ':speed' => $input['speed'],
        ':fuel_level' => $input['fuel_level'],
        ':engine_status' => $input['engine_status'],
        ':pollution_ppm' => $input['pollution_ppm']
    ]);

    // Process MPU9250 data if available
    if (isset($input['mpu9250'])) {
        $mpu_data = $input['mpu9250'];
        
        // Calculate behavior metrics
        $harsh_braking = $mpu_data['acceleration_x'] < -2.0; // m/s²
        $rapid_acceleration = $mpu_data['acceleration_x'] > 2.0; // m/s²
        $sharp_turn = abs($mpu_data['gyro_z']) > 45.0; // degrees/s
        
        // Calculate behavior score (0-100)
        $behavior_score = 100;
        if ($harsh_braking) $behavior_score -= 20;
        if ($rapid_acceleration) $behavior_score -= 20;
        if ($sharp_turn) $behavior_score -= 20;
        $behavior_score = max(0, $behavior_score);

        // Insert MPU9250 data
        $mpu_query = "INSERT INTO mpu9250_data (
            vehicle_id, acceleration_x, acceleration_y, acceleration_z,
            gyro_x, gyro_y, gyro_z, magnetometer_x, magnetometer_y, magnetometer_z,
            temperature, harsh_braking, rapid_acceleration, sharp_turn, behavior_score
        ) VALUES (
            :vehicle_id, :acceleration_x, :acceleration_y, :acceleration_z,
            :gyro_x, :gyro_y, :gyro_z, :magnetometer_x, :magnetometer_y, :magnetometer_z,
            :temperature, :harsh_braking, :rapid_acceleration, :sharp_turn, :behavior_score
        )";

        $mpu_stmt = $db->prepare($mpu_query);
        $mpu_stmt->execute([
            ':vehicle_id' => $vehicle_id,
            ':acceleration_x' => $mpu_data['acceleration_x'],
            ':acceleration_y' => $mpu_data['acceleration_y'],
            ':acceleration_z' => $mpu_data['acceleration_z'],
            ':gyro_x' => $mpu_data['gyro_x'],
            ':gyro_y' => $mpu_data['gyro_y'],
            ':gyro_z' => $mpu_data['gyro_z'],
            ':magnetometer_x' => $mpu_data['magnetometer_x'],
            ':magnetometer_y' => $mpu_data['magnetometer_y'],
            ':magnetometer_z' => $mpu_data['magnetometer_z'],
            ':temperature' => $mpu_data['temperature'],
            ':harsh_braking' => $harsh_braking,
            ':rapid_acceleration' => $rapid_acceleration,
            ':sharp_turn' => $sharp_turn,
            ':behavior_score' => $behavior_score
        ]);
    }

    // Commit transaction
    $db->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Data updated successfully"
    ]);

} catch(Exception $e) {
    // Rollback transaction on error
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?> 