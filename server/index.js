const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const massive = require('massive');
const axios = require('axios');
require("dotenv").config();
const authController = require('./controllers/authController');

massive(process.env.CONNECTION_STRING).then(dbInstance => {
    app.set("db", dbInstance);
    console.log("connected to db")
}).catch(error => console.log("error in massive connection", error));

const app = express();
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
}));

//Error handler
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500).json(err.message);
// });

//ENPOINTS
app.post("/auth/register", authController.register);
app.post("/auth/login", authController.login);

const PORT = 4003;
app.listen(PORT, console.log(`Server listening on port ${PORT}`));
