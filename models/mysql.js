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
//   `email` VARCHAR(45) NOT NULL,
//   `phone` VARCHAR(20) NULL,
//   PRIMARY KEY (`id`),
//   UNIQUE INDEX `user_id_UNIQUE` (`id` ASC),
//   UNIQUE INDEX `email_UNIQUE` (`email` ASC))
// ENGINE = InnoDB;


// -- -----------------------------------------------------
// -- Table `SyncDB`.`subs`
// -- -----------------------------------------------------
// DROP TABLE IF EXISTS `SyncDB`.`subs` ;

// CREATE TABLE IF NOT EXISTS `SyncDB`.`subs` (
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `channel_id` INT NOT NULL,
//   `sub_id` INT NOT NULL,
//   `active` TINYINT NULL,
//   `start_time` TIMESTAMP NULL,
//   `end_time` TIMESTAMP NULL,
//   PRIMARY KEY (`id`),
//   UNIQUE INDEX `sync_id_UNIQUE` (`id` ASC),
//   INDEX `channel_id_idx` (`channel_id` ASC),
//   INDEX `sub_id_idx` (`sub_id` ASC),
//   UNIQUE INDEX `channel_id_UNIQUE` (`channel_id` ASC),
//   UNIQUE INDEX `sub_id_UNIQUE` (`sub_id` ASC),
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
//   `stock` VARCHAR(10) NOT NULL,
//   `sold` TINYINT NULL,
//   `time_bought` TIMESTAMP NOT NULL,
//   `time_sold` TIMESTAMP NULL,
//   `price_bought` DOUBLE NOT NULL,
//   `price_sold` DOUBLE NULL,
//   PRIMARY KEY (`id`),
//   UNIQUE INDEX `id_UNIQUE` (`id` ASC),
//   UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
//   CONSTRAINT `user_id_transactions`
//     FOREIGN KEY (`user_id`)
//     REFERENCES `SyncDB`.`user` (`id`)
//     ON DELETE NO ACTION
//     ON UPDATE NO ACTION)
// ENGINE = InnoDB;


// -- -----------------------------------------------------
// -- Table `SyncDB`.`api_keys`
// -- -----------------------------------------------------
// DROP TABLE IF EXISTS `SyncDB`.`api_keys` ;

// CREATE TABLE IF NOT EXISTS `SyncDB`.`api_keys` (
//   `id` INT NOT NULL,
//   `user_id` INT NOT NULL,
//   `robinhood_code` TEXT NULL,
//   PRIMARY KEY (`id`),
//   UNIQUE INDEX `id_UNIQUE` (`id` ASC),
//   UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
//   CONSTRAINT `user_id_api`
//     FOREIGN KEY (`user_id`)
//     REFERENCES `SyncDB`.`user` (`id`)
//     ON DELETE NO ACTION
//     ON UPDATE NO ACTION)
// ENGINE = InnoDB;


// SET SQL_MODE=@OLD_SQL_MODE;
// SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
// SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;