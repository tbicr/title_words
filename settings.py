SQLALCHEMY_DATABASE_URI = ''

SECRET_KEY = ''

MAX_CONTENT_LENGTH = 5 * 1024 * 1024

GOOGLE_LOGIN_CLIENT_ID = ''
GOOGLE_LOGIN_CLIENT_SECRET = ''
GOOGLE_LOGIN_REDIRECT_PATH = ''
GOOGLE_LOGIN_AUTH_URI = 'https://accounts.google.com/o/oauth2/auth'
GOOGLE_LOGIN_TOKEN_URI = 'https://accounts.google.com/o/oauth2/token'
GOOGLE_LOGIN_USER_INFO = 'https://www.googleapis.com/userinfo/v2/me'


try:
    from settings_local import *
except ImportError:
    pass
