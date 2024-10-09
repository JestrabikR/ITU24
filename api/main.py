from flask import Flask
from flask import Response
from flask import make_response
from flask import jsonify
from flask import request
from datetime import date
import json

from trip import Trip
from country import Country

app = Flask(__name__)

@app.route("/")
def home():
    return "<style>body{background: black; color: white}</style><a href='/trips'>Trips endpoint</a>"

@app.route("/trips")
def trip():
    t = Trip("test", date(2022, 3, 3), date(2022, 4, 4), 9999, "Ahoj")
    r = Response(response=t.to_json(), status=200, mimetype="application/json")
    return r

@app.route("/trip/add", methods=["POST"])
def add_trip():
    trips = []
    with open("./trips.json", "r") as trips_file:
        data = trips_file.read()    
        trips = json.loads(data)

    post_data = json.loads(request.data.decode('utf8').replace("'", '"'))

    try:
        name = post_data["name"]
        #from_date = 
        #until_date = 
    except Exception:
        return make_response("Nastala chyba :-(", 400)

    print(name)
    with open("./trips.json", "w") as trips_file:
        trips_file.write(json.dumps(trips, indent=4))

    return make_response(jsonify(trips), 200)


if __name__ == '__main__':
    app.run()
