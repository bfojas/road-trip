const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const massive = require('massive');
require("dotenv").config();
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const mapController = require('./controllers/mapController');

massive(process.env.CONNECTION_STRING).then(dbInstance => {
    app.set("db", dbInstance);
    console.log("connected to db")
}).catch(error => console.log("error in massive connection", error));

const app = express();

//Middleware
app.use(bodyParser.json());
app.use(session({
    store: new RedisStore({ url: process.env.REDIS_URI }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2
    }
}));

//Auth endpoints
app.post("/auth/register", authController.register);
app.post("/auth/login", authController.login);
app.get("/auth/user-data", authController.getUser);
app.post("/auth/logout", authController.logout);
//User endpoints
app.put("/api/user/:id", userController.updateUserInfo);
app.get("/api/user-trips", userController.getUserTrips);
//Map endpoints
app.post("/map/start", mapController.start);
app.put("/map/add", mapController.add);
app.delete("/map/new-trip", mapController.newTrip);

const PORT = 4000;
app.listen(PORT, console.log(`Server listening on port ${PORT}`));
