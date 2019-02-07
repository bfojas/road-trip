const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const massive = require('massive');
require("dotenv").config();
const authController = require('./controllers/authController');
const mapController = require('./controllers/mapController')

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

//Auth endpoints
app.post("/auth/register", authController.register);
app.post("/auth/login", authController.login);
app.get("/auth/user-data", authController.getUser);
app.post("/auth/logout", authController.logout);

app.post('/map/start', mapController.start)

const PORT = 4000;
app.listen(PORT, console.log(`Server listening on port ${PORT}`));
