from flask import Flask, render_template, request, jsonify
import os
import urllib.parse
import sys
import string
import requests

ROOT_PATH = os.path.dirname(os.path.realpath(__file__))

FIXER_API_KEY = "bf97b943316e71b57a2bac4b3959c450"

app = Flask(__name__)

@app.route("/")
def index():
    placeholder = "static/images/tours/around%20ollantaytambo/inti%20punku/link/inti%20punku.jpg"
    galley_dir = "static/images/front-page-slides-show/"
    files = os.listdir(galley_dir)
    galley = []
    valid_images = (".jpg",".gif",".png",".tga")
    for file in files:
        if file.endswith(valid_images):
            galley.append(urllib.parse.quote(galley_dir+str(file)))

    blocks = []
    #print(galley)
    for i in range(10):
        blocks.append({'content': "block number" + str(i)})
    return render_template("index.html", blocks = blocks, galley = galley, page_top_slideshow = True, placeholder = placeholder)#

@app.route("/tours/<division>/<tour_name>")
def tour_details(division, tour_name):
    page_path = "tours/"+ division + "/" +tour_name+ ".html"
    print(page_path)
    print(os.path.isfile("templates/"+page_path))
    if not os.path.isfile("templates/"+page_path) and False:
        return render_template("error.html", msg = "tour not found")
    galley_dir = "static/images/tours/"+ division + "/"+tour_name+"/"
    files = os.listdir(galley_dir)
    galley = []
    print(galley_dir, file=sys.stderr)

    valid_images = (".jpg",".gif",".png",".tga")
    for file in files:
        if file.endswith(valid_images):
            galley.append(urllib.parse.quote(galley_dir+str(file)))
    print(galley)
    #print(string.capwords(tour_name))
    return render_template("tour_layout.html", galley = galley, tour_name = string.capwords(tour_name), page_top_slideshow = True)

@app.route("/tours")
def tours():
    root = "static/images/tours/"
    divisions = os.listdir(root)
    divisions = map(string.capwords, divisions)
    tours = {}
    for key in divisions:
        #div = urllib.parse.quote(key)
        tours[key] = os.listdir(root+key+"/")
        #for tour in tours[key]:

        #tours[key] = map(string.capwords, tours[key])
        tours[key] = [(string.capwords(tour), os.listdir(root+key+"/"+tour+"/link")[0]) for tour in tours[key]]

    print(tours)
    return render_template("tours.html", tours = tours)

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/convert", methods=["POST"])
def convert_currency():
    print("TARGET")
    print(request.form.get("target_currency"), file=sys.stderr)
    target_currency = request.form.get("target_currency")
    result = requests.get("http://data.fixer.io/api/latest", params={'access_key':FIXER_API_KEY, "base":"EUR", "symbol":target_currency + ",PEN"})
    print(result.status_code, file=sys.stderr)
    if result.status_code != 200:
        return jsonify({"success": False})
    data = result.json()
    print(data, file=sys.stderr)
    if not data["success"]:
        return jsonify({"success": False})

    if target_currency not in data["rates"]:
        return jsonify({"success": False})

    if "PEN" not in data["rates"]:
        return jsonify({"success": False})


    return jsonify({"success":True, "rate":data["rates"][target_currency]/data["rates"]["PEN"]})

@app.route("/convert/symbols", methods=["GET"])
def get_available_symbols():
    print("result", file=sys.stderr)
    result = requests.get("http://data.fixer.io/api/symbols", params={'access_key':FIXER_API_KEY})
    print("result", file=sys.stderr)
    if result.status_code != 200:
        return jsonify({"success": False})
    data = result.json()

    print(data, file=sys.stderr)
    if not data["success"]:
        return jsonify({"success": False})
    try:
        data["symbols"].pop("CAD")
    except KeyError:
        raise KeyError

    first_on_list = ["USD", "EUR", "CNY", "JPY"]
    top_of_list = []
    for x in first_on_list:
        try:
            top_of_list.append({"label":x + " ( " + data["symbols"][x] + " )", "value":x})
            data["symbols"].pop(x)
        except KeyError:
            raise KeyError

    keys = list(data["symbols"].keys())
    result = [{"label": key + " ( " + data["symbols"][key] + " )", "value":key} for key in keys]
    return jsonify({"success":True, "source":top_of_list + result})
