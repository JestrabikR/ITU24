from flask import Flask
from flask import Response
from flask import make_response
from flask import jsonify
from flask import request

from datetime import date
from datetime import datetime

import json

from trip import Trip, Subtrip
from country import Country

app = Flask(__name__)

def json_from_file(file):
    ret = None 
    with open(file, "r", encoding="utf-8") as f:
        data = f.read()    
        ret = json.loads(data)

    return ret

#---------------root page---------------
@app.route("/")
def home():
    return """
    <style>body{background: black; color: white}</style>
    <a href='/trips'>Trips endpoint</a><br>
    <a href='/countries'>Countries endpoint</a>
    """

#----------------/trips----------------
@app.route("/trips")
def trips():
    trips = json_from_file("./trips.json")
    return make_response(jsonify(trips), 200)

#---------------/trip/<id>---------------
@app.route("/trip/<id>")
def get_trip(id):
    trips = json_from_file("./trips.json")
    
    for trip in trips:
        if(trip["id"] == id):
            # trip_obj = Trip(**trip) # Trip object can be created this way directly from json
            return make_response(jsonify(trip), 200)
    
    return make_response("Trip not found", 204)

#---------------/trip/update/<id>---------------
@app.route("/trip/update/<id>", methods=["PUT"])
def update_trip(id):
    put_data = json.loads(request.data.decode('utf8').replace("'", '"'))

    trips = json_from_file("./trips.json")
    
    for i, trip in enumerate(trips):
        if(trip["id"] == id):
            new_trip = Trip(**put_data)
            trips[i] = new_trip.__dict__
    
    with open("./trips.json", "w", encoding="utf-8") as trips_file:
        trips_file.write(json.dumps(trips, indent=4, sort_keys=True, default=str))

    return make_response("Successfully updated trip", 200) # no need to return anything

#---------------/trip/add---------------
@app.route("/trip/add", methods=["POST"])
def add_trip():
    post_data = json.loads(request.data.decode('utf8').replace("'", '"'))

    trips = json_from_file("./trips.json")

    trip = None
    try:
        trip = Trip(**post_data)
    except Exception as e:
        return make_response("Nastala chyba :-( :" + str(e), 400)

    trips.append(trip.__dict__) # no need for to_json method because we only need dictionary

    with open("./trips.json", "w", encoding="utf-8") as trips_file:
        trips_file.write(json.dumps(trips, indent=4, sort_keys=True, default=str))

    return make_response("Successfully added trip", 200) # no need to return anything

#---------------/trip/del/<id>---------------
@app.route("/trip/del/<id>", methods=["DELETE"])
def delete_trip(id):
    trips = json_from_file("./trips.json")
    trips_ = [] 

    for trip in trips:
        if(trip["id"] == id):
            continue
        else:
            trips_.append(trip)

    with open("./trips.json", "w", encoding="utf-8") as trips_file:
        trips_file.write(json.dumps(trips_, indent=4, sort_keys=True, default=str))

    return make_response("Correctly deleted " + str(id), 200)

#---------------/countries---------------
@app.route("/countries")
def countries():
    countries = json_from_file("./countries.json")
    return make_response(jsonify(countries), 200)

#---------------/country/<code>---------------
@app.route("/country/<code>")
def get_country(code):
    countries = json_from_file("./countries.json")
    
    for country in countries:
        if(country["code"] == code):
            return make_response(jsonify(country), 200)
    
    return make_response("Country not found", 204)

#---------------/country/update/<code>---------------
@app.route("/country/update/<code>", methods=["PUT"])
def update_country(code):
    put_data = json.loads(request.data.decode('utf8').replace("'", '"'))

    countries = json_from_file("./countries.json")
    
    for i, country in enumerate(countries):
        if(country["code"] == code):
            new_country = Country(**put_data)
            countries[i] = new_country.__dict__
    
    with open("./countries.json", "w", encoding="utf-8") as country_file:
        country_file.write(json.dumps(countries, indent=4, sort_keys=True, default=str))

    return make_response("Successfully updated country", 200)

#---------------/country/add---------------
@app.route("/country/add", methods=["POST"])
def add_country():
    post_data = json.loads(request.data.decode('utf8').replace("'", '"'))

    countries = json_from_file("./countries.json")

    country = None
    try:
        country = Country(**post_data)
    except Exception as e:
        return make_response("Nastala chyba :-( :" + str(e), 400)

    countries.append(country.__dict__)

    with open("./countries.json", "w", encoding="utf-8") as countries_file:
        countries_file.write(json.dumps(countries, indent=4, sort_keys=True, default=str))

    return make_response("Successfully added country", 200)

if __name__ == '__main__':
    app.run(debug=True) # TODO: debug=True oddelat
