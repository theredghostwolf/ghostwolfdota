import urllib2
import urllib
import json
import os
import time
import re
import sys
from bs4 import BeautifulSoup

databasePostLink = "http://localhost:8080/api/guides"

heroListLink = " https://api.opendota.com/api/heroes"

l = urllib2.urlopen(heroListLink).read()
l = json.loads(l)

def readFile (f):
    openedFile = open(f,"r")
    text = openedFile.read()
    openedFile.close()
    return text

for hero in l:
    if hero["id"] == int(sys.argv[1]):
        folder = hero["localized_name"].replace(" ", "").lower()
        guide = {}
        guide["intro"] = readFile(folder +"/intro.html")
        guide["skills"] = readFile(folder +"/skills.html")
        guide["playstyle"] = readFile(folder +"/playstyle.html")
        guide["itemization"] = readFile(folder +"/items.html")
        guide["drafting"] = readFile(folder + "/drafting.html")
        guide["skillbuild"] = []

        builds = readFile(folder + "/skillbuild.html")

        build = builds.split('-')
        for x in build:

            parts = x.split(":")

            b = {}
            b["title"] = parts[0]
            b["notes"] = parts[1]
            b["build"] = parts[2].split(",")
            b["desc"] = parts[3]

            guide["skillbuild"].append(b)




        guide["heroID"] = hero["id"]

        data = {}
        data["data"] = guide

        req = urllib2.Request(databasePostLink)
        req.add_header('Content-Type', 'application/json')
        response = urllib2.urlopen(req, json.dumps(data))

        print("---------------------")
        print(response)
        print("---------------------")
