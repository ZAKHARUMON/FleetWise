CREATE TABLE IF NOT EXISTS mpu6050_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id VARCHAR(50) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    acceleration_x FLOAT NOT NULL COMMENT 'Acceleration in X-axis (m/s²)',
    acceleration_y FLOAT NOT NULL COMMENT 'Acceleration in Y-axis (m/s²)',
    acceleration_z FLOAT NOT NULL COMMENT 'Acceleration in Z-axis (m/s²)',
    gyro_x FLOAT NOT NULL COMMENT 'Angular velocity in X-axis (degrees/s)',
    gyro_y FLOAT NOT NULL COMMENT 'Angular velocity in Y-axis (degrees/s)',
    gyro_z FLOAT NOT NULL COMMENT 'Angular velocity in Z-axis (degrees/s)',
    temperature FLOAT NOT NULL COMMENT 'Temperature in Celsius',
    harsh_braking BOOLEAN DEFAULT FALSE COMMENT 'Detected harsh braking event',
    rapid_acceleration BOOLEAN DEFAULT FALSE COMMENT 'Detected rapid acceleration event',
    sharp_turn BOOLEAN DEFAULT FALSE COMMENT 'Detected sharp turn event',
    behavior_score FLOAT NOT NULL COMMENT 'Driver behavior score (0-100)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    INDEX idx_vehicle_timestamp (vehicle_id, timestamp),
    INDEX idx_behavior_score (behavior_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 