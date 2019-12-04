import os
import urllib.parse

def main():
    print("test")
    ##for root, dirs, files in os.walk("/mydir"):
    files = os.listdir("static/images/front-page-slides-show/")
    for file in files:
        if file.endswith(".jpg"):
            print(urllib.parse.quote(str(file)))
if __name__ == "__main__":
    main()
