import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import * as actions from './actions';
import logo from './logo-white.svg';
import './App.css';


class App extends Component {
  render() {
    return <div className="App">
      <div className="App-header">
        <h2><img src={logo} className="App-logo" alt="logo" />Title words learning</h2>
      </div>
      <div className="App-navigation">
        <Link to="/" className="App-navigation-tab">Words</Link>
        <Link to="/titles" className="App-navigation-tab">Titles</Link>
      </div>
      {React.cloneElement(this.props.children, {...this.props})}
    </div>
  }
}


function mapStateToProps (state) {
  return state;
}


function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
