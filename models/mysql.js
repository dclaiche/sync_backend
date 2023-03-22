const mysql = require('mysql2/promise');

class Database {
    constructor() {
      if (!Database.instance) {
        this.pool = mysql.createPool({
            connectionLimit: 50,
            host: "syncdb2.cluster-cjgbedur5ue8.us-west-1.rds.amazonaws.com",
            user: "dclaiche",
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