from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import os
import urllib.parse
import sys
import string
import requests
import json
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from shutil import copyfile
import utilities.utilities
#if not os.getenv("DATABASE_URL"):
#    raise RuntimeError("DATABASE_URL is not set")


app = Flask(__name__)
app.config["SESSION_PERMANENT"] = True
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


ROOT_PATH = os.path.dirname(os.path.realpath(__file__))

FIXER_API_KEY = "bf97b943316e71b57a2bac4b3959c450"



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
    page_path_root = "html/tours/"+ tour_name+"/"
    print(page_path_root)
    #print(os.path.isfile("templates/"+page_path))
    #if not os.path.isfile("templates/"+page_path) and False:
    #    return render_template("error.html", msg = "tour not found")
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

    if not os.path.isdir('static/html/tours/'+tour_name):
        if session.get("admin_login"):
            os.mkdir('static/html/tours/'+tour_name)
        else:
            return render_template("error.html", msg="Error acessing file")

    tabs = []
    files = os.listdir("static/"+page_path_root)
    if len(files) == 0:
        try:
            copyfile("content/empty.html", "static/"+page_path_root+tour_name+".html")
        except FileNotFoundError:
            return render_template("error.html", msg="Error acessing file")
    for file in files:
        if file.endswith(".html"):
            tabs.append([file[0:-5], file[0:-5].replace(" ", ""), page_path_root+str(file)])
            print(page_path_root+str(file))
    print(tabs)
    return render_template("tour_layout.html", tabs = tabs, galley = galley, tour_name = string.capwords(tour_name), page_top_slideshow = True)

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
    #print("TARGET")
    #print(request.form.get("target_currency"), file=sys.stderr)
    target_currency = request.form.get("target_currency")
    result = requests.get("http://data.fixer.io/api/latest", params={'access_key':FIXER_API_KEY, "base":"EUR", "symbol":target_currency + ",PEN"})
    #print(result.status_code, file=sys.stderr)
    if result.status_code != 200:
        return jsonify({"success": False})
    data = result.json()
    #print(data, file=sys.stderr)
    if not data["success"]:
        return jsonify({"success": False})

    if target_currency not in data["rates"]:
        return jsonify({"success": False})

    if "PEN" not in data["rates"]:
        return jsonify({"success": False})


    return jsonify({"success":True, "rate":data["rates"][target_currency]/data["rates"]["PEN"]})

@app.route("/convert/symbols", methods=["GET"])
def get_available_symbols():
    #print("result", file=sys.stderr)
    result = requests.get("http://data.fixer.io/api/symbols", params={'access_key':FIXER_API_KEY})
    #print("result", file=sys.stderr)
    if result.status_code != 200:
        return jsonify({"success": False})
    data = result.json()

    #print(data, file=sys.stderr)
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

@app.route("/save_content", methods=["POST"])
def save_content():
    print("test0", file=sys.stderr)
    content = request.form.get("data")
    file_name = request.form.get("file_name")
    absolute_path = request.form.get("absolute_path")
    #data = jsonify({"content":content})
    print(content, file=sys.stderr)
    print(f"raw file name:{file_name}")
    if not absolute_path:
        file_name = 'content/'+file_name+'.html'
    else:
        file_name = utilities.utilities.get_relative_path(file_name.replace("%20", " "))
        print(f"file name:{file_name}")
    try:
        file = open(file_name, 'w')
        file.write(content)
        file.close()
    except:
        return jsonify({"success":False, "message":"Error occur when trying to access the file "+str(file_name)})
    #with open('file_name.json', 'w', encoding='utf-8') as f:
    #    json.dump(data, f, ensure_ascii=False, indent=4)
    return jsonify({"success":True})

@app.route("/calendar")
def calendar():
    return render_template("calendar.html")

@app.route("/load_content/<file_name>", methods=["GET"])
def load_content(file_name):
    print("test1", file=sys.stderr)
    #file_name = request.form.get("file_name")
    print(file_name, file=sys.stderr)
    #data = jsonify({"content":content})
    try:
        file = open('content/'+file_name+'.html', 'r')
        data = file.read()
        file.close()
    except:
        return jsonify({"success":False, "message":"Error occur when trying to access the file "+str(file_name)})
    #with open('file_name.json', 'w', encoding='utf-8') as f:
    #    json.dump(data, f, ensure_ascii=False, indent=4)
    return jsonify({"success":True, "iframe_document":data})


@app.route("/login", methods=["GET", "POST"])
def login():

    if(session.get("admin_login")!= None):
        return jsonify({"success":True, "message":"Already logged in"})
        return redirect(url_for("index"))
    if request.method == "GET":
        return render_template("login.html")

    try:
        username = request.form.get("username")
        password = request.form.get("password")
    except Exception:
        #return render_template("error.html", msg = "Error occur when trying to access the input data")
        return jsonify({"success":False, "message":"Error occur when trying to access the input data"})

    try:
        with open('reg.txt') as json_file:
            data = json.load(json_file)
    except:
        #return render_template("error.html", msg = "Error occur when trying to access the reg")
        return jsonify({"success":False, "message":"Error occur when trying to access the reg"})
    if(not username in data):
        #return render_template("error.html", msg = "Username not found")
        return jsonify({"success":False, "message":"Username not found"})
    if(int.from_bytes(utilities.utilities.password_hash(password, data[username]["salt"].to_bytes(32, byteorder='big', signed=False)), byteorder='big', signed=False)!= data[username]["key"]):
        #return render_template("error.html", msg = "Incorrect password")
        return jsonify({"success":False, "message":"Incorrect password"})
    print("test")
    session["admin_login"] = True
    return jsonify({"success":True})
    return redirect(url_for("index"))
