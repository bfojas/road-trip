import React from "react";
import { Route, Switch } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import JoinLogin from "./components/JoinLogin/JoinLogin";
import MapView from "./components/MapView/MapView";
import Profile from "./components/Profile/Profile";

export default (
    <Switch>
        <Route path="/" component={Homepage} exact />
        <Route path="/register" component={JoinLogin} />
        <Route path="/login" component={JoinLogin} />
        <Route path="/map" component={MapView} />
        <Route path="/profile/:id/following" component={Profile} />
        <Route path="/profile/:id/saved" component={Profile} />
        <Route path="/profile/:id" component={Profile} exact />
    </Switch>
);