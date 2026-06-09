-- AgroScan Rwanda Database Schema
-- MySQL Database for Crop Disease Detection System

CREATE DATABASE IF NOT EXISTS agroscan_rwanda;
USE agroscan_rwanda;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    location VARCHAR(200),
    user_type ENUM('farmer', 'expert', 'admin') DEFAULT 'farmer',
    profile_image VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created (created_at)
);

-- Crops Table
CREATE TABLE crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_emoji VARCHAR(10),
    common_diseases JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_crop_name (crop_name)
);

-- Scan History Table
CREATE TABLE scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    crop_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    image_size INT,
    upload_notes TEXT,
    scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confidence_score FLOAT,
    analysis_result JSON,
    time_taken_ms INT,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES crops(id),
    INDEX idx_user_id (user_id),
    INDEX idx_scan_date (scan_date),
    INDEX idx_status (status)
);

-- Disease Detection Results Table
CREATE TABLE detection_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scan_id INT NOT NULL,
    disease_name VARCHAR(150) NOT NULL,
    confidence FLOAT NOT NULL,
    severity ENUM('mild', 'moderate', 'severe') DEFAULT 'mild',
    affected_area FLOAT,
    treatment_recommendation TEXT,
    treatment_link VARCHAR(255),
    prevention_tips JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE,
    INDEX idx_scan_id (scan_id),
    INDEX idx_disease_name (disease_name)
);

-- Diseases Database Table
CREATE TABLE diseases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    disease_name VARCHAR(150) NOT NULL UNIQUE,
    scientific_name VARCHAR(200),
    crop_id INT NOT NULL,
    description TEXT,
    symptoms JSON,
    treatment_options JSON,
    prevention_methods JSON,
    fungicide_recommendations JSON,
    image_url VARCHAR(255),
    risk_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (crop_id) REFERENCES crops(id),
    INDEX idx_disease_name (disease_name),
    INDEX idx_crop_id (crop_id)
);

-- Contact Submissions Table
CREATE TABLE contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'responded') DEFAULT 'new',
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_created (created_at),
    INDEX idx_status (status)
);

-- User Notifications Table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    notification_type VARCHAR(50),
    title VARCHAR(200),
    message TEXT,
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created (created_at)
);

-- User Sessions Table
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token)
);

-- Insert Sample Crops
INSERT INTO crops (crop_name, icon_emoji, description) VALUES
('Tomato', '🍅', 'Common garden vegetable, vulnerable to multiple fungal diseases'),
('Potato', '🥔', 'Root vegetable, susceptible to blight and rot diseases'),
('Maize', '🌽', 'Staple crop in Rwanda, prone to leaf diseases and rust'),
('Bean', '🫘', 'Protein-rich legume, affected by various bacterial and fungal diseases'),
('Cassava', '🥬', 'Root vegetable, can develop root rot and brown streak virus'),
('Banana', '🍌', 'Important crop, susceptible to Panama disease and leaf spot'),
('Coffee', '☕', 'Economic crop for Rwanda, affected by coffee leaf rust');

-- Insert Sample Diseases
INSERT INTO diseases (disease_name, scientific_name, crop_id, description, risk_level) VALUES
('Tomato Late Blight', 'Phytophthora infestans', 1, 'Fungal disease causing rapid crop destruction', 'high'),
('Early Blight', 'Alternaria solani', 1, 'Fungal disease affecting tomato leaves and stems', 'high'),
('Potato Late Blight', 'Phytophthora infestans', 2, 'Destructive disease affecting potato crops', 'high'),
('Maize Leaf Rust', 'Puccinia polysora', 3, 'Fungal rust disease reducing yield', 'medium'),
('Bean Anthracnose', 'Colletotrichum lindemuthianum', 4, 'Fungal disease affecting bean pods', 'medium'),
('Cassava Brown Streak', 'Cassava brown streak virus', 5, 'Viral disease reducing root quality', 'high'),
('Banana Panama Disease', 'Fusarium oxysporum', 6, 'Soil-borne fungal disease', 'high'),
('Coffee Leaf Rust', 'Hemileia vastatrix', 7, 'Fungal disease reducing coffee yield', 'high');
