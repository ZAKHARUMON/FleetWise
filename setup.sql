-- Create database if not exists
CREATE DATABASE IF NOT EXISTS fleet_management;
USE fleet_management;

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id VARCHAR(50) UNIQUE NOT NULL,
    model VARCHAR(100),
    registration_number VARCHAR(50),
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create mpu6050_data table
CREATE TABLE IF NOT EXISTS mpu6050_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id VARCHAR(50) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    acceleration_x FLOAT NOT NULL,
    acceleration_y FLOAT NOT NULL,
    acceleration_z FLOAT NOT NULL,
    gyro_x FLOAT NOT NULL,
    gyro_y FLOAT NOT NULL,
    gyro_z FLOAT NOT NULL,
    temperature FLOAT NOT NULL,
    harsh_braking BOOLEAN DEFAULT FALSE,
    rapid_acceleration BOOLEAN DEFAULT FALSE,
    sharp_turn BOOLEAN DEFAULT FALSE,
    behavior_score FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE
); 