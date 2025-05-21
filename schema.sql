CREATE DATABASE IF NOT EXISTS fleet_management;
USE fleet_management;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'driver', 'manager') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id VARCHAR(50) UNIQUE NOT NULL,
    model VARCHAR(100),
    registration_number VARCHAR(50),
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_vehicle_id (vehicle_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_expiry DATE NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS vehicle_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    driver_id INT NOT NULL,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP NULL,
    status ENUM('active', 'completed') DEFAULT 'active',
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

CREATE TABLE IF NOT EXISTS telemetry_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(10, 2) NOT NULL,
    fuel_level DECIMAL(5, 2) NOT NULL,
    engine_status VARCHAR(50) NOT NULL,
    pollution DECIMAL(10, 2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE IF NOT EXISTS mpu6050_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
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
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    INDEX idx_vehicle_timestamp (vehicle_id, timestamp),
    INDEX idx_behavior_score (behavior_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mpu9250_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acceleration_x FLOAT NOT NULL COMMENT 'Acceleration in X-axis (m/s²)',
    acceleration_y FLOAT NOT NULL COMMENT 'Acceleration in Y-axis (m/s²)',
    acceleration_z FLOAT NOT NULL COMMENT 'Acceleration in Z-axis (m/s²)',
    gyro_x FLOAT NOT NULL COMMENT 'Angular velocity in X-axis (degrees/s)',
    gyro_y FLOAT NOT NULL COMMENT 'Angular velocity in Y-axis (degrees/s)',
    gyro_z FLOAT NOT NULL COMMENT 'Angular velocity in Z-axis (degrees/s)',
    mag_x FLOAT NOT NULL COMMENT 'Magnetic field in X-axis (μT)',
    mag_y FLOAT NOT NULL COMMENT 'Magnetic field in Y-axis (μT)',
    mag_z FLOAT NOT NULL COMMENT 'Magnetic field in Z-axis (μT)',
    temperature FLOAT NOT NULL COMMENT 'Temperature in Celsius',
    harsh_braking BOOLEAN DEFAULT FALSE COMMENT 'Detected harsh braking event',
    rapid_acceleration BOOLEAN DEFAULT FALSE COMMENT 'Detected rapid acceleration event',
    sharp_turn BOOLEAN DEFAULT FALSE COMMENT 'Detected sharp turn event',
    behavior_score INT DEFAULT 100 COMMENT 'Overall behavior score (0-100)',
    heading FLOAT COMMENT 'Computed heading in degrees (0-360)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    INDEX idx_vehicle_timestamp (vehicle_id, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 