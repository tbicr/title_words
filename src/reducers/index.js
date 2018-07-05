import {
  LOADING_ACTION, LOAD_SETTINGS_ACTION, LOAD_WORDS_ACTION, LOAD_TITLES_ACTION, LOAD_TITLE_WORDS_ACTION,
  TRANSLATE_WORD_ACTION, MARK_WORD_KNOWN_ACTION, SKIP_WORD_NOW_ACTION, ADD_TITLE_ACTION,
} from '../constants';


const initialState = {
  loading: false,
  words: null,
  titles: null,
  titleWords: null,
  activeTitle: null,
  activeWord: null,
  translation: null,
  settings: null,
};


export default function rootReducer(state=initialState, {type, payload}) {
  switch (type) {
    case LOADING_ACTION:
      return {...state, loading: true};
    case LOAD_SETTINGS_ACTION:
      return {...state, loading: false, settings: payload};
    case LOAD_WORDS_ACTION:
      return {...state, loading: false, words: payload, translation: null};
    case LOAD_TITLES_ACTION:
      return {...state, loading: false, titles: payload};
    case LOAD_TITLE_WORDS_ACTION:
      return {
        ...state,
        loading: false,
        titleWords: payload.words,
        activeTitle: payload.title,
        translation: null,
      };
    case ADD_TITLE_ACTION:
      return {...state, loading: false, words: null, titles: [payload].concat(state.titles)};
    case TRANSLATE_WORD_ACTION:
      return {...state, translation: payload};
    case MARK_WORD_KNOWN_ACTION:
      return {
        ...state,
        words: state.words && [...state.words],
        titleWords: state.titleWords && [...state.titleWords],
        translation: null,
      };
    case SKIP_WORD_NOW_ACTION:
      return {
        ...state,
        words: state.words && [...state.words],
        titleWords: state.titleWords && [...state.titleWords],
        translation: null,
      };
    default:
      return state;
  }
}
