import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router';
import Reactable from 'reactable';
import Dropzone from 'react-dropzone';
import moment from 'moment';
import { PAGE_SIZE, MAX_FILE_SIZE } from '../constants';


class Loading extends Component {
  render() {
    return <div className="App-body">Loading...</div>
  }
}


export class WordsListPage extends Component {
  static propTypes = {
    check: PropTypes.string,
    words: PropTypes.array.isRequired,
  };

  render() {
    if (this.props.loading) {
      return <Loading/>
    }
    if (this.props.words === null) {
      this.props.actions.loadWords();
      return <Loading/>
    }
    let knownCount = 0;
    let knownSum = 0;
    let totalCount = 0;
    let totalSum = 0;
    for (let word of this.props.words) {
      if (word.known) {
        knownCount += 1;
        knownSum += word.times;
      }
      totalCount += 1;
      totalSum += word.times;
    }

    return <div className="App-body">
      <Link className="App-words-check-link" to={this.props.check || '/check'}>Check Words</Link>
      <p className="App-words-check-statistic">
        {knownCount} of {totalCount} unique words known ({(100 * knownCount / totalCount).toFixed(1)}%)
      </p>
      <p className="App-words-check-statistic">
        {knownSum} of {totalSum} all words known ({(100 * knownSum / totalSum).toFixed(1)}%)
      </p>
      <Reactable.Table
        className="App-words-table"
        columns={[
          {key: 'name', label: 'Word'},
          {key: 'times', label: 'Times'},
          {key: 'date_added', label: 'Date Added'},
        ]}
        itemsPerPage={PAGE_SIZE}
        sortable={true}>
        {this.props.words.map(word => <Reactable.Tr
          className={word.known ? 'App-words-known' : 'App-words-unknown'}
          data={{...word, 'date_added': moment(word.date_added).format('YYYY-MM-DD')}}
        />)}
      </Reactable.Table>
    </div>
  }
}


export class WordsCheckPage extends Component {
  static propTypes = {
    words: PropTypes.array.isRequired,
    translation: PropTypes.string.isRequired,
    settings: PropTypes.object.isRequired,
  };

  render() {
    if (this.props.loading) {
      return <Loading/>
    }
    if (this.props.settings === null) {
      this.props.actions.loadSettings();
      return <Loading/>
    }
    if (this.props.words === null) {
      this.props.actions.loadWords();
      return <Loading/>
    }

    for (let word of this.props.words) {
      if (!word.known && !word.skipped) {
        let linkToGoogleTranslate = 'https://translate.google.com/#' +
          this.props.settings.translation.from + '/' + this.props.settings.translation.to + '/' + word.name;
        return <div className="App-body">
          <b className="App-words-check-word">{word.name}</b>
          {this.props.translation
            ? <p><a href={linkToGoogleTranslate} target="_blank">{ this.props.translation}</a></p>
            : ''}
          <button className="App-words-check-translate" onClick={this.props.actions.translateWord.bind(
            this, word, this.props.settings.translation)}>
            Translate
          </button>
          <button className="App-words-check-known" onClick={this.props.actions.markWordKnown.bind(this, word)}>
            Known
          </button>
          <button className="App-words-check-skip" onClick={this.props.actions.skipWordNow.bind(this, word)}>
            Skip
          </button>
        </div>
      }
    }
    return <div>You checked all words!</div>
  }
}


export class TitlesListPage extends Component {
  static propTypes = {
    titles: PropTypes.array.isRequired,
  };

  render() {
    if (this.props.loading) {
      return <Loading/>
    }
    if (this.props.titles === null) {
      this.props.actions.loadTitles();
      return <Loading/>
    }

    return <div className="App-body">
      <Dropzone className="App-titles-upload"
                multiple={false} maxSize={MAX_FILE_SIZE} onDrop={this.props.actions.addTitle}>
        Upload new title
      </Dropzone>
      <Reactable.Table
        className="App-titles-table"
        columns={[
          {key: 'name', label: 'Name'},
          {key: 'total_words', label: 'Total Words'},
          {key: 'unique_words', label: 'Unique Words'},
          {key: 'date_added', label: 'Date Added'},
          {key: 'link', label: ''},
        ]}
        itemsPerPage={PAGE_SIZE}
        sortable={true}
        data={this.props.titles.map(title => ({...title,
          'date_added': moment(title.date_added).format('YYYY-MM-DD'),
          'link': <Link className="App-titles-word-check-link" to={'/titles/' + title.uuid}>check</Link>
        }))}/>
    </div>
  }
}


export class TitlesDetailPage extends Component {
  static propTypes = {
    activeTitle: PropTypes.string.isRequired,
    titleWords: PropTypes.array.isRequired,
  };

  render() {
    if (this.props.loading) {
      return <Loading/>
    }
    if (this.props.activeTitle === null || this.props.activeTitle.uuid !== this.props.params.titleUUID) {
      this.props.actions.loadTitleWords(this.props.params.titleUUID);
      return <Loading/>
    }
    return <WordsListPage
      loading={this.props.loading}
      words={this.props.titleWords}
      check={'/titles/' + this.props.activeTitle.uuid + '/check'}
      actions={this.props.actions}/>
  }
}


export class TitlesDetailWordsCheckPage extends Component {
  static propTypes = {
    activeTitle: PropTypes.string.isRequired,
    titleWords: PropTypes.array.isRequired,
    translation: PropTypes.string.isRequired,
    settings: PropTypes.object.isRequired,
  };

  render() {
    if (this.props.loading) {
      return <Loading/>
    }
    if (this.props.activeTitle === null || this.props.activeTitle.uuid !== this.props.params.titleUUID) {
      this.props.actions.loadTitleWords(this.props.params.titleUUID);
      return <Loading/>
    }
    return <WordsCheckPage
      loading={this.props.loading}
      words={this.props.titleWords}
      translation={this.props.translation}
      settings={this.props.settings}
      actions={this.props.actions}/>
  }
}
