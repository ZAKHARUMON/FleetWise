<?php
require_once __DIR__ . '/../config/database.php';

class MPU9250Handler {
    private $conn;
    private $table_name = "mpu9250_data";

    // Thresholds for behavior detection
    private $harsh_braking_threshold = -2.0; // m/s²
    private $rapid_acceleration_threshold = 2.0; // m/s²
    private $sharp_turn_threshold = 45.0; // degrees/s

    public function __construct($db) {
        $this->conn = $db;
    }

    public function processData($data) {
        // Validate required fields
        if (!isset($data['vehicle_id']) || !isset($data['acceleration_x']) || 
            !isset($data['acceleration_y']) || !isset($data['acceleration_z']) ||
            !isset($data['gyro_x']) || !isset($data['gyro_y']) || !isset($data['gyro_z']) ||
            !isset($data['mag_x']) || !isset($data['mag_y']) || !isset($data['mag_z'])) {
            return false;
        }

        // Calculate behavior metrics
        $harsh_braking = $this->detectHarshBraking($data['acceleration_x']);
        $rapid_acceleration = $this->detectRapidAcceleration($data['acceleration_x']);
        $sharp_turn = $this->detectSharpTurn($data['gyro_z']);
        
        // Calculate heading from magnetometer data
        $heading = $this->calculateHeading($data['mag_x'], $data['mag_y']);
        
        // Calculate behavior score (0-100)
        $behavior_score = $this->calculateBehaviorScore($harsh_braking, $rapid_acceleration, $sharp_turn);

        // Prepare query
        $query = "INSERT INTO " . $this->table_name . "
                (vehicle_id, acceleration_x, acceleration_y, acceleration_z,
                gyro_x, gyro_y, gyro_z, mag_x, mag_y, mag_z,
                temperature, harsh_braking, rapid_acceleration, sharp_turn,
                behavior_score, heading)
                VALUES
                (:vehicle_id, :acceleration_x, :acceleration_y, :acceleration_z,
                :gyro_x, :gyro_y, :gyro_z, :mag_x, :mag_y, :mag_z,
                :temperature, :harsh_braking, :rapid_acceleration, :sharp_turn,
                :behavior_score, :heading)";

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind values
        $stmt->bindParam(":vehicle_id", $data['vehicle_id']);
        $stmt->bindParam(":acceleration_x", $data['acceleration_x']);
        $stmt->bindParam(":acceleration_y", $data['acceleration_y']);
        $stmt->bindParam(":acceleration_z", $data['acceleration_z']);
        $stmt->bindParam(":gyro_x", $data['gyro_x']);
        $stmt->bindParam(":gyro_y", $data['gyro_y']);
        $stmt->bindParam(":gyro_z", $data['gyro_z']);
        $stmt->bindParam(":mag_x", $data['mag_x']);
        $stmt->bindParam(":mag_y", $data['mag_y']);
        $stmt->bindParam(":mag_z", $data['mag_z']);
        $stmt->bindParam(":temperature", $data['temperature']);
        $stmt->bindParam(":harsh_braking", $harsh_braking);
        $stmt->bindParam(":rapid_acceleration", $rapid_acceleration);
        $stmt->bindParam(":sharp_turn", $sharp_turn);
        $stmt->bindParam(":behavior_score", $behavior_score);
        $stmt->bindParam(":heading", $heading);

        // Execute query
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    private function detectHarshBraking($acceleration_x) {
        return $acceleration_x < $this->harsh_braking_threshold;
    }

    private function detectRapidAcceleration($acceleration_x) {
        return $acceleration_x > $this->rapid_acceleration_threshold;
    }

    private function detectSharpTurn($gyro_z) {
        return abs($gyro_z) > $this->sharp_turn_threshold;
    }

    private function calculateHeading($mag_x, $mag_y) {
        // Calculate heading in degrees (0-360)
        $heading = atan2($mag_y, $mag_x) * 180 / M_PI;
        if ($heading < 0) {
            $heading += 360;
        }
        return $heading;
    }

    private function calculateBehaviorScore($harsh_braking, $rapid_acceleration, $sharp_turn) {
        $score = 100;
        
        // Deduct points for each violation
        if ($harsh_braking) $score -= 20;
        if ($rapid_acceleration) $score -= 20;
        if ($sharp_turn) $score -= 20;
        
        // Ensure score doesn't go below 0
        return max(0, $score);
    }

    public function getDriverBehavior($vehicle_id, $limit = 100) {
        try {
            // Validate vehicle_id
            if (!$vehicle_id) {
                throw new Exception("Vehicle ID is required");
            }

            // Validate limit
            if ($limit < 1 || $limit > 1000) {
                $limit = 100; // Default to 100 if limit is invalid
            }

            $query = "SELECT * FROM " . $this->table_name . "
                    WHERE vehicle_id = :vehicle_id
                    ORDER BY timestamp DESC
                    LIMIT :limit";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":vehicle_id", $vehicle_id);
            $stmt->bindParam(":limit", $limit, PDO::PARAM_INT);
            
            if (!$stmt->execute()) {
                throw new Exception("Failed to execute query");
            }

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Format the data
            foreach ($result as &$row) {
                $row['harsh_braking'] = (bool)$row['harsh_braking'];
                $row['rapid_acceleration'] = (bool)$row['rapid_acceleration'];
                $row['sharp_turn'] = (bool)$row['sharp_turn'];
                $row['behavior_score'] = (int)$row['behavior_score'];
                if (isset($row['heading'])) {
                    $row['heading'] = (float)$row['heading'];
                }
            }

            return $result;
        } catch (Exception $e) {
            error_log("Error in getDriverBehavior: " . $e->getMessage());
            throw $e;
        }
    }

    public function getAverageBehaviorScore($vehicle_id) {
        $query = "SELECT AVG(behavior_score) as avg_score
                FROM " . $this->table_name . "
                WHERE vehicle_id = :vehicle_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":vehicle_id", $vehicle_id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['avg_score'] ?? 0;
    }
}
?> 