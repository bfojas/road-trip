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
    console.log("connected to db");
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
app.get("/api/trips/:id", userController.getTrips);
app.put("/api/trips", userController.updateTrip);
app.delete("/api/trips/:id", userController.deleteTrip);
app.get("/api/creator/:id", userController.getCreator);
app.put("/api/like-trip/:id", userController.likeTrip);
app.get("/api/get-liked/:id", userController.getLikedTrips);
app.get("/user/get-profile/:id", userController.getProfile)
//Map endpoints
app.post("/api/start-trip", mapController.start);
app.post("/api/add-stop", mapController.add);
app.delete("/api/new-trip", mapController.newTrip);
app.post("/api/stopOrder", mapController.setOrder);
app.put("/api/delete-stop/:id", mapController.deleteStop)
app.get("/api/retrieve-trip/:id", mapController.retrieveTrip);



const PORT = 4000;
app.listen(PORT, console.log(`Server listening on port ${PORT}`));
