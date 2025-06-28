CREATE DATABASE car_data;
USE car_data;
CREATE TABLE car (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(50),
    model VARCHAR(100),
    year INT,
    engine_fuel_type VARCHAR(50),
    engine_cylinders FLOAT,
    transmission_type VARCHAR(50),
    driven_wheels VARCHAR(50),
    num_doors FLOAT,
    market_category VARCHAR(255),
    vehicle_size VARCHAR(50),
    vehicle_style VARCHAR(50),
    popularity INT
);

CREATE TABLE car_specs (
    spec_id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT,
    engine_hp FLOAT,
    highway_mpg INT,
    city_mpg INT,
    msrp INT,
    FOREIGN KEY (car_id) REFERENCES car(car_id)
);
CREATE TABLE car_temp (
    make VARCHAR(50),
    model VARCHAR(100),
    year INT,
    engine_fuel_type VARCHAR(50),
    engine_hp FLOAT,
    engine_cylinders FLOAT,
    transmission_type VARCHAR(50),
    driven_wheels VARCHAR(50),
    num_doors FLOAT,
    market_category VARCHAR(255),
    vehicle_size VARCHAR(50),
    vehicle_style VARCHAR(50),
    highway_mpg INT,
    city_mpg INT,
    popularity INT,
    msrp INT
);
