from flask import Flask
from flask import Response
from flask import make_response
from flask import jsonify
from flask import request

from datetime import date
from datetime import datetime

import json

from trip import Trip
from country import Country

app = Flask(__name__)

def json_from_file(file):
    ret = None 
    with open(file, "r") as f:
        data = f.read()    
        ret = json.loads(data)

    return ret

@app.route("/")
def home():
    return "<style>body{background: black; color: white}</style><a href='/trips'>Trips endpoint</a>"

@app.route("/trips")
def trips():
    trips = json_from_file("./trips.json")
    return make_response(jsonify(trips), 200)

@app.route("/trip/<id>")
def trip(id):
    trips = json_from_file("./trips.json")
    
    for trip in trips:
        if(trip["id"] == id):
            return make_response(jsonify(trip), 200)
    
    return make_response("Trip not found", 204)
    


@app.route("/trip/add", methods=["POST"])
def add_trip():
    post_data = json.loads(request.data.decode('utf8').replace("'", '"'))

    trips = json_from_file("./trips.json")

    trip = None
    try:
        name = post_data["name"]
        from_date = post_data["from_date"]
        until_date = post_data["until_date"]

        date_formatter = "%Y-%m-%d"
        from_date_object = datetime.strptime(from_date, date_formatter).date()
        until_date_object = datetime.strptime(until_date, date_formatter).date()

        trip = Trip(name, from_date_object, until_date_object, 9999, "Ahoj")
    except Exception as e:
        return make_response("Nastala chyba :-(: " + str(e), 400)

    trips.append(trip.to_json())

    with open("./trips.json", "w") as trips_file:
        trips_file.write(json.dumps(trips, indent=4, sort_keys=True, default=str))

    return make_response(jsonify(trips), 200)


if __name__ == '__main__':
    app.run()
