/*
 Navicat Premium Dump SQL

 Source Server         : onboarding
 Source Server Type    : MySQL
 Source Server Version : 80041 (8.0.41)
 Source Host           : localhost:3306
 Source Schema         : sun_protect

 Target Server Type    : MySQL
 Target Server Version : 80041 (8.0.41)
 File Encoding         : 65001

 Date: 13/03/2025 23:43:09
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for daily_uv_temp_forecast
-- ----------------------------
DROP TABLE IF EXISTS `daily_uv_temp_forecast`;
CREATE TABLE `daily_uv_temp_forecast`  (
  `forecast_id` int NOT NULL AUTO_INCREMENT COMMENT 'ID of each forecast',
  `MAX_UVI` decimal(4, 2) NOT NULL COMMENT 'Max UV index of the day',
  `loc_id` int NOT NULL COMMENT 'ID of the sample location',
  `forecast_date` date NOT NULL COMMENT 'The specific future date this forecast predicts (YYYY-MM-DD format)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Automatically records when this forecast was stored in the database',
  `min_temp` decimal(4, 1) NULL DEFAULT NULL COMMENT 'minimum tempreture of the day',
  `max_temp` decimal(4, 1) NULL DEFAULT NULL COMMENT 'maximum tempreture of the day',
  `weather_summary` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'summary of the day\'s weather',
  PRIMARY KEY (`forecast_id`) USING BTREE,
  INDEX `loc_id`(`loc_id` ASC) USING BTREE,
  CONSTRAINT `daily_uv_temp_forecast_ibfk_1` FOREIGN KEY (`loc_id`) REFERENCES `location` (`loc_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of daily_uv_temp_forecast
-- ----------------------------

-- ----------------------------
-- Table structure for hist_cancer_data
-- ----------------------------
DROP TABLE IF EXISTS `hist_cancer_data`;
CREATE TABLE `hist_cancer_data`  (
  `cancer_id` int NOT NULL COMMENT 'ID of each cancer data',
  `loc_id` int NULL DEFAULT NULL COMMENT 'ID of the sample location',
  `diag_year` year NULL DEFAULT NULL COMMENT 'Year of incidence diagnosed',
  `cancer_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'what type of cancer',
  `age_group` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'age group of patient, write as \"10-20\", \"50-60\"',
  `mort_count` int NULL DEFAULT NULL COMMENT 'number of death',
  `incid_count` int NULL DEFAULT NULL COMMENT 'number of incidence',
  PRIMARY KEY (`cancer_id`) USING BTREE,
  INDEX `loc_id`(`loc_id` ASC) USING BTREE,
  CONSTRAINT `hist_cancer_data_ibfk_1` FOREIGN KEY (`loc_id`) REFERENCES `location` (`loc_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of hist_cancer_data
-- ----------------------------

-- ----------------------------
-- Table structure for hist_uv_data
-- ----------------------------
DROP TABLE IF EXISTS `hist_uv_data`;
CREATE TABLE `hist_uv_data`  (
  `UV_rec_id` int NOT NULL COMMENT 'ID of each UV record',
  `loc_id` int NULL DEFAULT NULL COMMENT 'ID of sample location',
  `time_stamp` datetime NULL DEFAULT NULL COMMENT 'time of each history record',
  `UV_idx` float(4, 2) NULL DEFAULT NULL COMMENT 'index of each UV record',
  PRIMARY KEY (`UV_rec_id`) USING BTREE,
  INDEX `loc_id`(`loc_id` ASC) USING BTREE,
  CONSTRAINT `hist_uv_data_ibfk_1` FOREIGN KEY (`loc_id`) REFERENCES `location` (`loc_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of hist_uv_data
-- ----------------------------

-- ----------------------------
-- Table structure for location
-- ----------------------------
DROP TABLE IF EXISTS `location`;
CREATE TABLE `location`  (
  `loc_id` int NOT NULL COMMENT 'ID of each location',
  `pos_code` int NULL DEFAULT NULL COMMENT 'post code of each location',
  `locality` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'unknown yet',
  `state` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'Name of the state',
  `latitude` float(10, 6) NULL DEFAULT NULL COMMENT 'latitude of location',
  `longitude` float(10, 6) NULL DEFAULT NULL COMMENT 'longitude of location',
  `type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `sa3` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'suburban',
  `sa3_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'suburban description',
  PRIMARY KEY (`loc_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of location
-- ----------------------------

-- ----------------------------
-- Table structure for realtime_uv_weather
-- ----------------------------
DROP TABLE IF EXISTS `realtime_uv_weather`;
CREATE TABLE `realtime_uv_weather`  (
  `record_id` int NOT NULL AUTO_INCREMENT COMMENT 'ID of each data frame',
  `UV_idx` decimal(4, 2) NOT NULL COMMENT 'number of UV index',
  `loc_id` int NOT NULL COMMENT 'ID of sample location',
  `time_stamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Time stamp of each data frame',
  PRIMARY KEY (`record_id`) USING BTREE,
  INDEX `loc_id`(`loc_id` ASC) USING BTREE,
  CONSTRAINT `realtime_uv_weather_ibfk_1` FOREIGN KEY (`loc_id`) REFERENCES `location` (`loc_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of realtime_uv_weather
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
