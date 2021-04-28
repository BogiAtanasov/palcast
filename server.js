const express = require('express');
const pool = require("./db");
const app = express();
const bodyParser = require('body-parser');

app.get("/", (req,res) => res.send('API RUNNING'));

// pool.query("INSERT INTO users (name,email) VALUES ($1, $2)", ["Bogi", "ba_96@abv.bg"]);

//Init middleware

//Get data from req.body
app.use(express.json({extended: false}));

app.get('/', (req, res) => res.send('API RUNNING'));

// Define Routes
app.use("/api/users", require('./routes/api/users'));
app.use("/api/auth", require('./routes/api/auth'));
app.use("/api/profile", require('./routes/api/profile'));
app.use("/api/studio", require('./routes/api/studio'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`The server is up on a ${PORT}`));
