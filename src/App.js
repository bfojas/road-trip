import React, { Component } from 'react';
import routes from './routes';
import { withRouter } from 'react-router-dom'
import './App.scss';
import Header from './components/Header/Header'
import {connect} from 'react-redux'

class App extends Component {
  render() {
    return (
      // this.props.currentTrip
      // ?
      <div className="App">
        <Header/>
        { routes }
      </div>
      // :
      // <div>loading...</div>
    );
  }
}

const mapStateToProps = (state) =>{
  return {
    user: state.user,
    currentTrip: state.currentTrip
  }
}

export default withRouter(connect(mapStateToProps)(App));
