<?php
require_once __DIR__ . '/../config/database.php';

class MPU6050Handler {
    private $conn;
    private $table_name = "mpu6050_data";

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
            !isset($data['gyro_x']) || !isset($data['gyro_y']) || !isset($data['gyro_z'])) {
            return false;
        }

        // Calculate behavior metrics
        $harsh_braking = $this->detectHarshBraking($data['acceleration_x']);
        $rapid_acceleration = $this->detectRapidAcceleration($data['acceleration_x']);
        $sharp_turn = $this->detectSharpTurn($data['gyro_z']);
        
        // Calculate behavior score (0-100)
        $behavior_score = $this->calculateBehaviorScore($harsh_braking, $rapid_acceleration, $sharp_turn);

        // Prepare query
        $query = "INSERT INTO " . $this->table_name . "
                (vehicle_id, acceleration_x, acceleration_y, acceleration_z,
                gyro_x, gyro_y, gyro_z, temperature, harsh_braking,
                rapid_acceleration, sharp_turn, behavior_score)
                VALUES
                (:vehicle_id, :acceleration_x, :acceleration_y, :acceleration_z,
                :gyro_x, :gyro_y, :gyro_z, :temperature, :harsh_braking,
                :rapid_acceleration, :sharp_turn, :behavior_score)";

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
        $stmt->bindParam(":temperature", $data['temperature']);
        $stmt->bindParam(":harsh_braking", $harsh_braking);
        $stmt->bindParam(":rapid_acceleration", $rapid_acceleration);
        $stmt->bindParam(":sharp_turn", $sharp_turn);
        $stmt->bindParam(":behavior_score", $behavior_score);

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
        $query = "SELECT * FROM " . $this->table_name . "
                WHERE vehicle_id = :vehicle_id
                ORDER BY timestamp DESC
                LIMIT :limit";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":vehicle_id", $vehicle_id);
        $stmt->bindParam(":limit", $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
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