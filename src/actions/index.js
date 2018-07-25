import fetch from 'isomorphic-fetch';
import {
  LOGIN_ACTION, LOGOUT_ACTION, LOADING_ACTION, LOAD_SETTINGS_ACTION, LOAD_WORDS_ACTION, LOAD_TITLES_ACTION,
  LOAD_TITLE_WORDS_ACTION, TRANSLATE_WORD_ACTION, MARK_WORD_KNOWN_ACTION, MARK_WORD_AS_NAME_ACTION,
  MARK_WORD_AS_TOPONYM_ACTION,  SKIP_WORD_NOW_ACTION, ADD_TITLE_ACTION,
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


export function loadSettings() {
  return function (dispatch) {
    dispatch({
      type: LOADING_ACTION,
    });
    fetch('/settings', {credentials: 'same-origin'})
      .then(response => response.json())
      .then(data => dispatch({
        type: LOAD_SETTINGS_ACTION,
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


export function translateWord(word, translationSettings) {
  return function (dispatch) {
    fetch('https://translation.googleapis.com/language/translate/v2?key=' + translationSettings.api_key, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body:  JSON.stringify({
        q: [word.name],
        format: 'text',
        model: 'base',
        source: translationSettings.from,
        target: translationSettings.to,
      }),
    })
      .then(response => response.json())
      .then(data => dispatch({
        type: TRANSLATE_WORD_ACTION,
        payload: data.data.translations[0].translatedText,
      }));
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


export function markWordAsName(word) {
  return function (dispatch) {
    word.is_name = true;
    fetch('/words/' + word.uuid + '/mark-as-name', {credentials: 'same-origin', method: 'POST'});
    dispatch({
      type: MARK_WORD_AS_NAME_ACTION,
    });
  }
}


export function markWordAsToponym(word) {
  return function (dispatch) {
    word.is_toponym = true;
    fetch('/words/' + word.uuid + '/mark-as-toponym', {credentials: 'same-origin', method: 'POST'});
    dispatch({
      type: MARK_WORD_AS_TOPONYM_ACTION,
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
    let data = new FormData();
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
