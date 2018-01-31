import urllib2
import urllib
import json
import os
import time
import re
from bs4 import BeautifulSoup

updateImages = True
skipAlreadyDownloadedImages = True

databasePostLink = "http://localhost:8080/api/heroes"
databasePostLinkAbilities = "http://localhost:8080/api/abilities"
itemPageLink = "https://www.dota2.com/items/"
heroPageLink = "http://www.dota2.com/hero/"
heroListLink = " https://api.opendota.com/api/heroes"

l = urllib2.urlopen(heroListLink).read()
l = json.loads(l)

for i in range(len(l)):
    #adds an empty list for abilities
    l[i]["abilities"] = []
    #adds an empty dict for stats
    l[i]["stats"] = {}

    l[i]["heroID"] = l[i]["id"]

    name = l[i]["name"].split("npc_dota_hero_")
    print(name[1] + " | " + heroPageLink + name[1] + "/")
    html = urllib2.urlopen(heroPageLink + name[1] + "/").read()
    soup = BeautifulSoup(html)
    #parses stats
    divs = soup.find_all("div", {"class": "overview_StatVal"})
    for div in divs:
        text = div.get_text().split("+")
        if div["id"] == "overview_IntVal":
            l[i]["stats"]["intBase"] = text[0].replace(" ","")
            l[i]["stats"]["intGain"] = text[1].replace(" ","")
            print("int: " + text[0] + " | gain: " + text[1])
        elif div["id"] == "overview_AgiVal":
            l[i]["stats"]["agiBase"] = text[0].replace(" ","")
            l[i]["stats"]["agiGain"] = text[1].replace(" ","")
            print("agi: " + text[0] + " | gain: " + text[1])
        elif div["id"] == "overview_StrVal":
            l[i]["stats"]["strBase"] = text[0].replace(" ","")
            l[i]["stats"]["strGain"] = text[1].replace(" ","")
            print("str: " + text[0] + " | gain: " + text[1] )
        elif div["id"] == "overview_SpeedVal":
            l[i]["stats"]["speedBase"] = div.get_text().replace(" ","")
            print("speed: " + div.get_text())
        elif div["id"] == "overview_AttackVal":
            l[i]["stats"]["damageBase"] = div.get_text().replace(" ","")
            print("damage: " + div.get_text())
        elif div["id"] == "overview_DefenseVal":
            l[i]["stats"]["armorBase"] = div.get_text().replace(" ","")
            print("armor: " + div.get_text())

    #parses spells
    divs = soup.find_all("div",{"class": "abilitiesInsetBoxContent"})
    for div in divs:
        abilityDict = {}
        desc = div.find_all("div", {"class": "abilityHeaderRowDescription"})
        for d in desc:
            x = d.find_all("h2")

            for y in x:
                #ability title
                print(y.get_text())
                abilityDict["name"] = y.get_text()
                #gets skill img
                if updateImages:
                    imgdivs = div.find_all("div", {"class": "abilityIconHolder2"})
                    for di in imgdivs:
                        im = di.find_all("img")
                        imageFileName = l[i]["name"] + "_" + y.get_text() + ".png"
                        abilityDict["icon"] = imageFileName
                        for lul in im:
                            abilityDict["liveIcon"] = lul["src"]
                            if (skipAlreadyDownloadedImages) and (os.path.isfile(imageFileName)):
                                print(imageFileName + " already exists, skipping...")
                            else:
                                print("fetching: " + lul["src"] )
                                imgfile = open(imageFileName, "w")
                                imgfile.write(urllib.urlopen(lul["src"]).read())
                                imgfile.close()
                                print("done fetching image, waiting 10 seconds to prevent server overload")
                                time.sleep(10)

            x = d.find("p")
            abilityDict["description"] = x.get_text()
        abilityData = div.find_all("div", {"class":"abilityFooterBox"})
        #gets ability data
        for x in abilityData:


            x = str(x).replace('</div>\n<div class="abilityFooterBoxRight">', '</div> | <div class="abilityFooterBoxRight">' )
            x =  BeautifulSoup(x)

            dataString = x.get_text().replace("\t","").replace("\n","").replace("\r","").replace('u\ ',"")
            splits = re.findall("[a-z][A-Z]|[0-9][A-Z]|[%][A-Z]", dataString)
            dataString = re.sub("[a-z][A-Z]|[0-9][A-Z]|[%][A-Z]", "###", dataString)

            for s in splits:
                s = s[0] + " | " + s[1]
                dataString = dataString.replace("###",s,1)

            print(dataString)

            abilityDict["data"] = dataString.split("|")


        #gets mana cost and cooldown
        manaDivs = div.find_all("div",{"class": "mana"})
        for manadiv in manaDivs:
            print(manadiv.get_text())
            abilityDict["mana"] = manadiv.get_text()
        cooldownDivs = div.find_all("div", {"class":"cooldown"})
        for cooldowndiv in cooldownDivs:
            print(cooldowndiv.get_text())
            abilityDict["cooldown"] = cooldowndiv.get_text()

        loreDivs = div.find_all("div", {"class": "abilityLore"})
        for loreDiv in loreDivs:
            print(loreDiv.get_text())
            abilityDict["lore"] = loreDiv.get_text()

        l[i]["abilities"].append(abilityDict)


with open('data.txt', 'w') as outfile:
    json.dump(l, outfile)

dataFile = open('data.txt', 'r')
content = dataFile.read()
l = json.loads(content)
dataFile.close()

for hero in l:
    data  = {}
    data["data"] = hero
    print(data)
    req = urllib2.Request(databasePostLink)
    req.add_header('Content-Type', 'application/json')
    response = urllib2.urlopen(req, json.dumps(data))

    print("---------------------")
    print(response)
    print("---------------------")

x = 1

for hero in l:
    for ability in hero["abilities"]:
            data  = {}
            ability["heroID"] = hero["heroID"]
            ability["id"] = x
            data["data"] = ability
            print(data)
            req = urllib2.Request(databasePostLinkAbilities)
            req.add_header('Content-Type', 'application/json')
            response = urllib2.urlopen(req, json.dumps(data))

            print("---------------------")
            print(response)
            print("---------------------")

            x = x + 1
