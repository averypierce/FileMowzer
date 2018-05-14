import os, configparser, logging
import jwt as vanillajwt #aliasing because JWTManager uses 'jwt' name
from datetime import timedelta

from flask import Flask, jsonify, send_from_directory, request
from flask_restful import Resource, Api
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, jwt_optional
from flask_cors import CORS

LOG = logging.getLogger(__name__)
LOG.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("[%(levelname)s]  %(message)s"))
LOG.addHandler(handler)

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": ["http://192.168.0.138:3000","http://localhost:3000"]}})



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

#Returns a list of libraries that the logged in user is a member of
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

#Returns names of all files and folders in a directory as a list
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

#Returns object containing Files: and Folders:
class GetDir():
    @jwt_required
    def get(self,library=None,path=""):

        user = get_jwt_identity()
        path = '/' + path
        contents = {'folders': [], 'files': []}
        if not library:
            return "Library does not exist", 400
        if os.path.isfile(libraries[library]['path']+path):
            LOG.debug(libraries[library]['path']+path + " is a file")
            return "requested path is not a directory", 400
        if user in libraries[library]['users'].split(','):
            libraryPath = libraries[library]['path']+path
            listdirResults = os.listdir(libraryPath)
            
            for file in listdirResults:
                if os.path.isfile(libraryPath + file):
                    contents['files'].append(file)
                else:
                    contents['folders'].append(file)
        return contents

#set up to accept a temp token
class Downloader(Resource):
    @jwt_optional
    def get(self,library=None,path=""):
        user = get_jwt_identity()
        if user:
            #send back a token containing whatever information it is we need
            downloadToken = create_access_token({'library': library,'path': path,'user': user},expires_delta=timedelta(seconds=3))
            downloadToken = jsonify(access_token = downloadToken)
            downloadToken.status_code = 200
            return downloadToken

        else: #look for query string containing the token we just sent them

            token = request.args.get('jwt')
            dt = vanillajwt.decode(token,settings['JWT_SECRET_KEY'],algorithms=['HS256'])
            library = dt['identity']['library']
            path = dt['identity']['path']
            user = dt['identity']['user']
            try:
                if library in libraries.sections():
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