from flask import Flask, render_template
import os
import urllib.parse
import sys

ROOT_PATH = os.path.dirname(os.path.realpath(__file__))

app = Flask(__name__)

@app.route("/")
def index():
    files = os.listdir("static/images/front-page-slides-show/")
    galley = []
    valid_images = (".jpg",".gif",".png",".tga")
    for file in files:
        if file.endswith(valid_images):
            galley.append(urllib.parse.quote("static/images/front-page-slides-show/"+str(file)))
    return render_template("index.html", galley = galley)

@app.route("/tours/<tour_name>")
def tour_details(tour_name):
    page_path = "tours/" +tour_name+ ".html"
    if not os.path.isfile("templates/"+page_path):
        render_template("error.html", msg = "tour not found")
    galley_dir = "static/images/tours/"+tour_name+"/"
    files = os.listdir(galley_dir)
    galley = []
    print(galley_dir, file=sys.stderr)

    valid_images = (".jpg",".gif",".png",".tga")
    for file in files:
        if file.endswith(valid_images):
            galley.append(urllib.parse.quote(galley_dir+str(file)))
    return render_template(page_path, galley = galley, tour_name = tour_name)

@app.route("/tours")
def tours():
    tours = os.listdir("static/images/tours/")
    for i in range(len(tours)):
        tours[i] = tours[i].capitalize()
    return render_template("tours.html", tours = tours)

@app.route("/about")
def about():
    return render_template("about.html")
