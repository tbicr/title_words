import datetime
import logging.handlers
import uuid

from flask import Flask, request, redirect, url_for, jsonify
from flask import abort
from flask.json import JSONEncoder
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_oauth2_login import GoogleLogin

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import joinedload

from app.file_parser import parse


app = Flask(__name__, static_folder='../build', static_url_path='')
app.config.from_object('settings')

db = SQLAlchemy(app)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)
google_login = GoogleLogin(app)

stream_handler = logging.StreamHandler()
stream_handler.setLevel(logging.INFO)
app.logger.addHandler(stream_handler)


class ModelJSONEncoder(JSONEncoder):
    def default(self, obj):
        if hasattr(obj, 'serialize'):
            return obj.serialize()
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        return super().default(obj)


app.json_encoder = ModelJSONEncoder


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
    email = db.Column(db.String(64), unique=True, nullable=False)

    def serialize(self):
        return {
            'uuid': self.uuid,
            'email': self.email,
        }


class Title(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('titles'))
    name = db.Column(db.String(32), nullable=False)
    total_words_count = db.Column(db.Integer, default=0, nullable=False)
    unique_words_count = db.Column(db.Integer, default=0, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.datetime.utcnow, nullable=False)

    def serialize(self):
        return {
            'uuid': self.uuid,
            'name': self.name,
            'total_words': self.total_words_count,
            'unique_words': self.unique_words_count,
            'date_added': self.date_added,
        }


class TitleWord(db.Model):
    title_id = db.Column(db.Integer, db.ForeignKey('title.id'), primary_key=True)
    title = db.relationship('Title', backref=db.backref('words'))
    word_id = db.Column(db.Integer, db.ForeignKey('word.id'), primary_key=True)
    word = db.relationship('Word')
    times = db.Column(db.Integer, default=0, nullable=False)

    def serialize(self):
        return {
            'uuid': self.word.uuid,
            'name': self.word.word,
            'times': self.times,
            'known': self.word.known,
            'date_added': self.word.date_added,
            'date_known': self.word.date_known,
        }


class Word(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('words'))
    word = db.Column(db.String(32), nullable=False)
    times = db.Column(db.Integer, default=0, nullable=False)
    known = db.Column(db.Boolean, default=False, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.datetime.utcnow, nullable=False)
    date_known = db.Column(db.DateTime, nullable=True)

    __table_args__ = (db.UniqueConstraint('user_id', 'word'),)

    def serialize(self):
        return {
            'uuid': self.uuid,
            'name': self.word,
            'times': self.times,
            'known': self.known,
            'date_added': self.date_added,
            'date_known': self.date_known,
        }


login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@app.route('/')
@login_required
def index():
    return redirect(url_for('static', filename='index.html'))


@app.route('/words')
@login_required
def load_words():
    return jsonify(Word.query.filter_by(user=current_user).order_by(Word.times.desc()).all())


@app.route('/titles')
@login_required
def load_titles():
    return jsonify(Title.query.filter_by(user=current_user).order_by(Title.date_added.desc()).all())


@app.route('/titles/<title_uuid>/words')
@login_required
def load_title_words(title_uuid):
    title = Title.query.filter_by(uuid=title_uuid, user=current_user).first()
    if not title:
        abort(404)
    return jsonify({
        'title': title,
        'words': (TitleWord.query.
                  filter_by(title=title).
                  options(joinedload('word')).
                  order_by(TitleWord.times.desc()).
                  all()),
    })


@app.route('/upload', methods=['POST'])
@login_required
def upload_new_title():
    file = request.files.get('file')
    stat = parse(file)
    title = Title(user=current_user, name=file.filename,
                  total_words_count=sum(stat.values()),
                  unique_words_count=len(stat))
    db.session.add(title)
    words = Word.query.filter(Word.user == current_user, Word.word.in_(stat.keys()))
    word_instance_map = {word.word: word for word in words}
    for word, count in stat.items():
        word_instance = word_instance_map.get(word)
        if word_instance:
            word_instance.times += count
        else:
            word_instance = Word(user=current_user, word=word, times=count)
        db.session.add(word_instance)
        title_word = TitleWord(title=title, word=word_instance, times=count)
        db.session.add(title_word)
    db.session.commit()
    return jsonify(title)


@app.route('/words/<word_uuid>/mark-known', methods=['POST'])
@login_required
def mark_word_as_known(word_uuid):
    word = Word.query.filter_by(uuid=word_uuid, user=current_user).first()
    if not word:
        abort(404)
    word.known = True
    db.session.add(word)
    db.session.commit()
    return jsonify(word)


@app.route('/login')
def login():
    return redirect(google_login.authorization_url())


@app.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return redirect(url_for('login'))


@google_login.login_success
def google_get_or_create_user(token, userinfo, **params):
    email = userinfo['email']
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(email=email)
        db.session.add(user)
        db.session.commit()
    login_user(user)
    return redirect(url_for('index'))


@google_login.login_failure
def google_login_failure(e):
    return jsonify(error=str(e))
