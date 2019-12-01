import os

def __main__(self,*arg):
    print("test")
    ##for root, dirs, files in os.walk("/mydir"):
    files = os.listdir("static/images")
    for file in files:
        if file.endswith(".png"):
            print(os.path.join(file))
