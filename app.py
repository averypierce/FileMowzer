from flask import Flask, jsonify, send_from_directory, request
from flask_restful import Resource, Api
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
from flask_cors import CORS

import configparser
import os

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
settings = loadConfig(rootdir+r'/settings.ini')['DEFAULT']
users = loadConfig(rootdir+r'/users.ini')
libraries = loadConfig(rootdir+r'/libraries.ini')

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
            return "Invalid username or password", 401

        #Identity can be any data that is json serializable
        access_token = create_access_token(identity = username)
        access_token = jsonify(access_token = access_token)
        access_token.status_code = 200
        return access_token

class HomeDir(Resource):
    @jwt_required
    def get(self):
        foo = []
        current_identity = get_jwt_identity()
        for section in libraries.sections():
            if dict(current_identity)["user_id"] in libraries[section]['users'].split(','):
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
            print("IS FILE " + path)
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
                print(user + " requesting file download")
                if user not in libraries[library]['users']:
                    print("Denyed")
                    return "You do not have permission to access this resource", 403
                print("library: " + library)
                print(libraries[library]['path'])
                print(path)
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