import React from 'react';
import { Route, Switch } from 'react-router-dom';
import JoinLogin from './components/JoinLogin/JoinLogin';
import MapView from './components/MapView/MapView';

export default (
    <Switch>
        <Route path="/register" component={JoinLogin} />
        <Route path="/login" component={JoinLogin} />
        <Route path="/map" component={MapView} />
    </Switch>
);