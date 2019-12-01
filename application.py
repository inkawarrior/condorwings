from flask import Flask, render_template
import os
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 300

@app.route("/")
def index():
    files = os.listdir("static/images")
    galley = []
    for file in files:
        if file.endswith(".jpg"):
            galley.append("static/images/"+str(file))
    return render_template("index.html", galley = galley)

@app.route("/tours")
def more():
    return render_template("tours.html")

@app.after_request
def add_header(response):
    response.cache_control.max_age = 300
    return response

@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                 endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)
