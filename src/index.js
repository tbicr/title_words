import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import configureStore from './store';
import App from './App';
import {
  WordsListPage, WordsCheckPage, TitlesListPage, TitlesDetailPage, TitlesDetailWordsCheckPage,
} from './components';
import './index.css';


ReactDOM.render(
  <Provider store={configureStore()}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={WordsListPage}/>
        <Route path="/check" component={WordsCheckPage}/>
        <Route path="/titles" component={TitlesListPage}/>
        <Route path="/titles/:titleUUID" component={TitlesDetailPage}/>
        <Route path="/titles/:titleUUID/check" component={TitlesDetailWordsCheckPage}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
