const mysql = require('mysql2/promise');

class Database {
    constructor() {
      if (!Database.instance) {
        this.pool = mysql.createPool({
            connectionLimit: 50,
            host: "syncdb.cjgbedur5ue8.us-west-1.rds.amazonaws.com",
            user: "admin",
            password: "Dxto80kgwvvl$",
            database: "SyncDB",
            waitForConnections: true,
            queueLimit: 0,
        });
        Database.instance = this;
      }
      return Database.instance;
    }
  
    async statement(sql, params) {
      const connection = await this.pool.getConnection();

      try {
        const [rows] = await connection.execute(sql, params);
        return rows;
      } catch (err) {
        return err
      } finally {
      connection.release();
      }
    }
  
}

module.exports = Database;


// -- MySQL Workbench Forward Engineering

// SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
// SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
// SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

// -- -----------------------------------------------------
// -- Schema SyncDB
// -- -----------------------------------------------------

// -- -----------------------------------------------------
// -- Schema SyncDB
// -- -----------------------------------------------------
// CREATE SCHEMA IF NOT EXISTS `SyncDB` DEFAULT CHARACTER SET utf8 ;
// USE `SyncDB` ;

// -- -----------------------------------------------------
// -- Table `SyncDB`.`user`
// -- -----------------------------------------------------
// DROP TABLE IF EXISTS `SyncDB`.`user` ;

// CREATE TABLE IF NOT EXISTS `SyncDB`.`user` (
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `password` VARCHAR(45) NULL,
//   `email` VARCHAR(45) NOT NULL UNIQUE,
//   `phone` VARCHAR(20) NULL,
//   PRIMARY KEY (`id`))
// ENGINE = InnoDB;

// -- -----------------------------------------------------
// -- Table `SyncDB`.`subs`
// -- -----------------------------------------------------
// DROP TABLE IF EXISTS `SyncDB`.`alerts` ;

// CREATE TABLE IF NOT EXISTS `SyncDB`.`alerts` (
// 	`id` INT NOT NULL AUTO_INCREMENT,
//     `sub_id` INT NOT NULL,
    
//     )
// -- -----------------------------------------------------
// -- Table `SyncDB`.`subs`
// -- -----------------------------------------------------
// DROP TABLE IF EXISTS `SyncDB`.`subs` ;

// CREATE TABLE IF NOT EXISTS `SyncDB`.`subs` (
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `channel_id` INT NOT NULL,
//   `sub_id` INT NOT NULL UNIQUE,
//   `active` TINYINT NULL,
//   `start_time` TIMESTAMP NULL,
//   `end_time` TIMESTAMP NULL,
//   PRIMARY KEY (`id`),
//   CONSTRAINT `channel_id`
//     FOREIGN KEY (`channel_id`)
//     REFERENCES `SyncDB`.`user` (`id`)
//     ON DELETE NO ACTION
//     ON UPDATE NO ACTION,
//   CONSTRAINT `sub_id`
//     FOREIGN KEY (`sub_id`)
//     REFERENCES `SyncDB`.`user` (`id`)
//     ON DELETE NO ACTION
//     ON UPDATE NO ACTION)
// ENGINE = InnoDB;


// -- -----------------------------------------------------
// -- Table `SyncDB`.`transactions`
// -- -----------------------------------------------------
// DROP TABLE IF EXISTS `SyncDB`.`transactions` ;

// CREATE TABLE IF NOT EXISTS `SyncDB`.`transactions` (
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `user_id` INT NOT NULL,
//   `symbol` VARCHAR(10) NOT NULL,
//   `client_order_id` VARCHAR(55) NOT NULL,
//   `created_at` TIMESTAMP NOT NULL,
//   `updated_at` TIMESTAMP NOT NULL,
//   `submitted_at` TIMESTAMP NOT NULL,
//   `filled_at` TIMESTAMP NOT NULL,
//   `expired_at` TIMESTAMP NULL,
//   `canceled_at` TIMESTAMP NULL,
//   `failed_at` TIMESTAMP NULL,
//   `replaced_at` TIMESTAMP NULL,
//   `replaced_by` VARCHAR(45) NULL,
//   `replaces` VARCHAR(45) NULL,
//   `asset_id` VARCHAR(45) NOT NULL,
//   `symbol` VARCHAR(10) NOT NULL,
//   `asset_class` VARCHAR(30) NOT NULL,
//   `notional` DECIMAL(10, 2) NULL,
//   `qty` DECIMAL(10, 8) NULL,
//   `filled_qty` DECIMAL(10, 8) NOT NULL,
//   `filled_avg_price` DECIMAL(10, 3) NOT NULL,
//   `order_class` VARCHAR(45) NOT NULL,
//   `order_type` VARCHAR(45) NOT NULL,
//   `type` VARCHAR(45) NOT NULL,
//   `side` VARCHAR(10) NOT NULL,
//   `time_in_force` VARCHAR(10) NOT NULL,
//   `limit_price` DECIMAL(10, 2) NULL,
//   `stop_price` DECIMAL(10, 2) NULL,
//   `status` VARCHAR(45) NOT NULL,
//   `extended_hours` BOOLEAN NOT NULL,
//   `legs` TEXT NULL,
//   `trail_percent` DECIMAL(10, 8) NULL,
//   `trail_price` DECIMAL(10, 8) NULL,
//   `hwm` DECIMAL(10, 8) NULL,
//   `subtag` VARCHAR(45) NULL,
//   `source` VARCHAR(45) NOT NULL,
  
//   PRIMARY KEY (`id`),
//   CONSTRAINT `user_id_transactions`
//     FOREIGN KEY (`user_id`)
//     REFERENCES `SyncDB`.`user` (`id`)
//     ON DELETE NO ACTION
//     ON UPDATE NO ACTION)
// ENGINE = InnoDB;

// -- -----------------------------------------------------
// -- Table `SyncDB`.`positions`
// -- -----------------------------------------------------
// DROP TABLE IF EXISTS `SyncDB`.`positions` ;

// CREATE TABLE IF NOT EXISTS `SyncDB`.`positions` (
// 	`id` INT NOT NULL AUTO_INCREMENT,
//     `user_id` INT NOT NULL,
//     `asset_id` varchar(50) NOT NULL,
//     `symbol` varchar(6) NOT NULL,
//     `quantity` INT NOT NULL
//     )
// ENGINE = InnoDB;
// -- -----------------------------------------------------
// -- Table `SyncDB`.`api_keys`
// -- -----------------------------------------------------
// DROP TABLE IF EXISTS `SyncDB`.`api_keys` ;

// CREATE TABLE IF NOT EXISTS `SyncDB`.`api_keys` (
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `user_id` INT NOT NULL UNIQUE,
//   `alpaca_key` VARCHAR(50) NOT NULL,
//   `alpaca_secret` VARCHAR(50) NOT NULL,
//   PRIMARY KEY (`id`),
//   CONSTRAINT `user_id_api`
//     FOREIGN KEY (`user_id`)
//     REFERENCES `SyncDB`.`user` (`id`)
//     ON DELETE CASCADE
//     ON UPDATE NO ACTION)
// ENGINE = InnoDB;


// SET SQL_MODE=@OLD_SQL_MODE;
// SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
// SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;