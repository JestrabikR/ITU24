from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "root endpoint value"

if __name__ == '__main__':
    app.run()