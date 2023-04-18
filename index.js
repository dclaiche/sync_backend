const express = require('express');
const bodyParser = require('body-parser');
const Database = require('./models/mysql');
const Alpaca = require("@alpacahq/alpaca-trade-api");

const app = express();
app.enable('trust proxy');
app.use(bodyParser.json());


app.use('/user', require('./routes/userRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/trader', require('./routes/tradeRoutes'));
// app.use(cors());

const db = new Database();
var last_check = new Date().toISOString();
// for each creator get all orders after X time
        // -> add each order to the DB in the transactions table
        // -> Eventually we will periodically loop through all transactions made by creators and send their subscribers alerts for each transaction made
        // -> We will also need to update the positions table with the new quantity for each position
async function checkUserPositions() {
    try {
      const users = await db.statement('SELECT * FROM user INNER JOIN api_keys ON user.id = api_keys.user_id WHERE user.creator_status = 1;');
      for (const user of users) {
        const alpaca = new Alpaca({
          keyId: user.alpaca_key,
          secretKey: user.alpaca_secret,
          paper: true,
          usePolygon: false,
        });

        if (user.creator_status === 1) {
        const orders = await alpaca.getOrders({status: "all", after: last_check});
        for (const order of orders) {
          const sql = `INSERT INTO transactions (
            id, client_order_id, created_at, updated_at, submitted_at, 
            filled_at, expired_at, canceled_at, failed_at, replaced_at, replaced_by, replaces,
            asset_id, symbol, asset_class, notional, qty, filled_qty, filled_avg_price,
            order_class, order_type, type, side, time_in_force, limit_price,
            stop_price, status, extended_hours, legs, trail_percent, trail_price,
            hwm, subtag, source, user_id
          ) VALUES (
            ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?
          );
          `
          console.log(order)
          var params = Object.values(order);
          params.push(user.id);
          console.log(params)
          const rows = await db.statement(sql, params);
          console.log(rows);
        }
      }
      last_check = new Date().toISOString();
      }
    } catch (error) {
      console.error('Error checking user positions:', error.message);
    }
  }

  checkUserPositions();
  setInterval(checkUserPositions, 30 * 1000); // Check for new users every 30 seconds

// set the PORT and listen
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});