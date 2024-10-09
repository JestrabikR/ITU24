from flask import Flask
from flask import Response
from datetime import date
import json

from trip import Trip
from country import Country

app = Flask(__name__)

@app.route("/")
def home():
    t = Trip("test", date(2022, 3, 3), date(2022, 4, 4), 9999, "Ahoj")
    r = Response(response=t.to_json(), status=200, mimetype="application/json")
    return r

if __name__ == '__main__':
    app.run()
