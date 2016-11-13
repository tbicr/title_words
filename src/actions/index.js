import fetch from 'isomorphic-fetch';
import {
  LOGIN_ACTION, LOGOUT_ACTION, LOADING_ACTION, LOAD_DASHBOARD, LOAD_WORDS_ACTION, LOAD_TITLES_ACTION,
  LOAD_TITLE_WORDS_ACTION, MARK_WORD_KNOWN_ACTION,  SKIP_WORD_NOW_ACTION, ADD_TITLE_ACTION,
} from '../constants';


export function login() {
  return {
    type: LOGIN_ACTION,
  }
}


export function logout() {
  return {
    type: LOGOUT_ACTION,
  }
}


export function loadDashboard() {
  return function (dispatch) {
    dispatch({
      type: LOADING_ACTION,
    });
    fetch('/dashboard', {method: 'POST', credentials: 'same-origin'})
      .then(response => response.json())
      .then(data => dispatch({
        type: LOAD_DASHBOARD,
        payload: data,
      })
    );
  }
}


export function loadWords() {
  return function (dispatch) {
    dispatch({
      type: LOADING_ACTION,
    });
    fetch('/words', {credentials: 'same-origin'})
      .then(response => response.json())
      .then(data => dispatch({
        type: LOAD_WORDS_ACTION,
        payload: data,
      })
    );
  }
}


export function loadTitles() {
  return function (dispatch) {
    dispatch({
      type: LOADING_ACTION,
    });
    fetch('/titles', {credentials: 'same-origin'})
      .then(response => response.json())
      .then(data => dispatch({
        type: LOAD_TITLES_ACTION,
        payload: data,
      })
    );
  }
}


export function loadTitleWords(titleUUID) {
  return function (dispatch) {
    dispatch({
      type: LOADING_ACTION,
    });
    fetch('/titles/' + titleUUID + '/words', {credentials: 'same-origin'})
      .then(response => response.json())
      .then(data => dispatch({
        type: LOAD_TITLE_WORDS_ACTION,
        payload: data,
      })
    );
  }
}


export function markWordKnown(word) {
  return function (dispatch) {
    word.known = true;
    fetch('/words/' + word.uuid + '/mark-known', {credentials: 'same-origin', method: 'POST'});
    dispatch({
      type: MARK_WORD_KNOWN_ACTION,
    });
  }
}


export function skipWordNow(word) {
  return function (dispatch) {
    word.skipped = true;
    dispatch({
      type: SKIP_WORD_NOW_ACTION,
    });
  }
}


export function addTitle(files) {
  return function (dispatch) {
    dispatch({
      type: LOADING_ACTION,
    });
    var data = new FormData();
    data.append('file', files[0]);
    fetch('/upload', {method: 'POST', body: data, credentials: 'same-origin'})
      .then(response => response.json())
      .then(data => dispatch({
        type: ADD_TITLE_ACTION,
        payload: data,
      })
    );
  }
}
