const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.enable('trust proxy');
app.use(bodyParser.json());


app.use('/user', require('./routes/userRoutes'));
app.use('/auth', require('./routes/authRoutes'));
// app.use(cors());

// set the PORT and listen
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});