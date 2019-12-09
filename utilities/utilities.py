import re
import os
import hashlib
import sys
import struct

pattern_name = re.compile("(?!.*[ ]{2})(?!.*[-]{2})[a-zA-Z][-a-zA-Z ]*[a-zA-Z]")
pattern_email = re.compile("[a-zA-Z0-9][a-zA-Z0-9!#%^$*+\-/=?_{'|]*@([a-zA-Z0-9-]+[.])+[a-zA-Z0-9]+")



def name(s):
    return pattern_name.fullmatch(s)

def email(s):
    return pattern_email.fullmatch(s)

'''
def password_hash(password):
    salt = os.urandom(32)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return key, salt
'''
def password_hash(password, salt = None):
    if salt == None:
        salt = os.urandom(32)
        key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
        return key, salt
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return key

def get_relative_path(file_name, root = "static"):
    match_obj = re.search(root, file_name)
    #print(match_obj.group())
    #print(match_obj.start())
    index = match_obj.start()
    return file_name[index:]

def main():
    print("Username:")
    username = input()
    print("Password:")
    password = input()
    key, salt = password_hash(password)
    print(salt)
    data = {username: {"key":int.from_bytes(key, byteorder='big', signed=False), "salt":int.from_bytes(salt, byteorder='big', signed=False)}}
    print(data)
    print(data[username]["salt"].to_bytes(32, byteorder='big', signed=False))
    import json
    with open("../reg.txt", 'w') as outfile:
        json.dump(data, outfile)
if __name__ == "__main__":
    main()
