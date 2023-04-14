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

async function checkUserPositions() {
    try {
      const users = await db.statement('SELECT * FROM user INNER JOIN api_keys ON user.id = api_keys.user_id');
      for (const user of users) {
        const alpaca = new Alpaca({
          keyId: user.alpaca_key,
          secretKey: user.alpaca_secret,
          paper: true,
          usePolygon: false,
        });
       
        const positions = await alpaca.getOrders({status: "closed", after: "2023-04-13T18:35:14.817211157Z"});
        console.log(`User ${user.id}:`, positions);
        //const current_positions = await db.statement('SELECT * FROM positions WHERE symbol = ?', [symbol]);

        // for (const position of positions) {
        //   const symbol = position.symbol;
        //   const quantity = position.qty;
        //   const asset_id = position.asset_id;
        //   for (const current_position of current_positions) {
        //     if (current_position.symbol === symbol) {
        //       if (current_position.quantity !== quantity) {
        //         // Create Alert for Subscribers
        //         console.log(`Updating quantity for ${symbol} from ${current_position.quantity} to ${quantity}`);
        //         await db.statement('UPDATE positions SET quantity = ? WHERE symbol = ?', [quantity, symbol]);
        //       }
        //     } else {
        //       console.log(`Adding new position for ${symbol} with quantity ${quantity}`);
        //       await db.statement('INSERT INTO positions (user_id, symbol, quantity, asset_id) VALUES (?, ?, ?, ?)', [user.id, symbol, quantity, asset_id]);
        //     }
        //   }
        // }
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