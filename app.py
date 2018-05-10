import os, configparser, logging
from flask import Flask, jsonify, send_from_directory, request
from flask_restful import Resource, Api
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_cors import CORS

LOG = logging.getLogger(__name__)
LOG.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("[%(levelname)s]  %(message)s"))
LOG.addHandler(handler)

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "http://192.168.0.138:3000"}})

def loadConfig(filename):
    config = configparser.ConfigParser()
    try:
        config.read(filename)
    except:
        print(filename+"is missing or corrupt")
    return config

rootdir = os.path.dirname(os.path.abspath(__file__))
settings = loadConfig(f'{rootdir}/settings.ini')['DEFAULT']
users = loadConfig(f'{rootdir}/users.ini')
libraries = loadConfig(f'{rootdir}/libraries.ini')

app.config['SECRET_KEY'] = settings['SECRET_KEY']
app.config['JWT_SECRET_KEY'] = settings['JWT_SECRET_KEY']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False

downloadApi = Api(app,prefix="/download")
api = Api(app, prefix="/api/v1")
authApi = Api(app)
jwt = JWTManager(app)


class Auth(Resource):
    def post(self):

        username = request.json.get('username', None)
        password = request.json.get('password', None)
        if not username:
            return "missing username parameter", 400
        if not password:
            return "missing password parameter", 400

        if users[username]["password"] != password:
            LOG.warning(f"user {username} invalid login attempt")
            return "Invalid username or password", 401

        LOG.info(f"user {username} logged in")
        access_token = create_access_token(identity = username)
        access_token = jsonify(access_token = access_token)
        access_token.status_code = 200
        return access_token

class HomeDir(Resource):
    @jwt_required
    def get(self):
        LOG.info("HomeDir() called")
        foo = []
        user = get_jwt_identity()
        for section in libraries.sections():
            if user in libraries[section]['users'].split(','):
                foo.append(section)
        return jsonify(foo)

class ListDir(Resource):
    @jwt_required
    def get(self,library=None,path=""):
        user = get_jwt_identity()
        path = '/' + path
        if not library:
            return False
        if os.path.isfile(libraries[library]['path']+path):
            LOG.debug(libraries[library]['path']+path + " is a file")
            return [path]
        if user in libraries[library]['users'].split(','):
            return os.listdir(libraries[library]['path']+path)
        return ["not found"]

class Downloader(Resource):
    @jwt_required
    def get(self,library=None,path=""):

        try:
            if library in libraries.sections():
                user = get_jwt_identity()
                LOG.info(f"{user} requesting download: {library}/{path}")
                LOG.debug(f"real path: {libraries[library]['path']}/{path}")

                if user not in libraries[library]['users']:
                    LOG.info(f"Denied access to {user}")
                    return "You do not have permission to access this library", 403

                LOG.info(f"Granted access to {user}")
                return send_from_directory(libraries[library]['path'],path,as_attachment=True)
            else:
                return "invalid or DNE", 401

        except Exception as e:
            return str(e)

downloadApi.add_resource(Downloader, '/<library>/<path:path>')
authApi.add_resource(Auth,"/auth")
api.add_resource(HomeDir, '/home')
api.add_resource(ListDir,
    '/<library>/<path:path>',
    '/<library>')
if __name__ == '__main__':
    app.run(host='192.168.0.138',debug=True)