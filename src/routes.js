import React from 'react';
import { Route, Switch } from 'react-router-dom';
import JoinLogin from './components/JoinLogin/JoinLogin';
import map from './components/mapRender/mapRender';

export default (
    <Switch>
        <Route path="/register" component={JoinLogin} />
        <Route path="/login" component={JoinLogin} />
        <Route path="/map" component={map} />
    </Switch>
);