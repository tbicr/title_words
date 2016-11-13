import collections
import re

from bs4 import BeautifulSoup
from nltk import TreebankWordTokenizer
from nltk.tokenize import sent_tokenize


class SimpleTreebankWordTokenizer(TreebankWordTokenizer):
    ENDING_QUOTES = [
        (re.compile(r'"'), " '' "),
        (re.compile(r'(\S)(\'\')'), r'\1 \2 '),
    ]
    CONTRACTIONS2 = []
    CONTRACTIONS3 = []
    CONTRACTIONS4 = []


tokenize = SimpleTreebankWordTokenizer().tokenize


def word_tokenize(text):
    return [token
            for sent in sent_tokenize(text)
            for token in tokenize(sent)
            if any(c.isalpha() for c in token)]


def parse(file):
    results = collections.Counter()
    text = BeautifulSoup(file.read().decode('utf8'), 'lxml').get_text()
    results.update(word_tokenize(text))
    for word, count in list(results.items()):
        if not word.islower():
            lower_word = word.lower()
            if lower_word in results:
                results.update({lower_word: count})
                del results[word]
    return results
