import React from 'react';
import { Route, Switch } from 'react-router-dom';
import JoinLogin from './components/JoinLogin/JoinLogin';

export default (
    <Switch>
        <Route path="/register" component={JoinLogin} />
        <Route path="/login" component={JoinLogin} />
    </Switch>
);