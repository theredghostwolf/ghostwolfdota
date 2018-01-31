import urllib2
import urllib
import json
import os


heroListLink = " https://api.opendota.com/api/heroes"
filesToCreate = ["intro.html","items.html","drafting.html","skills.html","playstyle.html","skillbuild.html"]


l = urllib2.urlopen(heroListLink).read()
l = json.loads(l)

for i in range(len(l)):
        heroName = l[i]["localized_name"].replace(" ","").lower()
        print(heroName)
        if (not os.path.isdir(heroName)):
            os.mkdir(heroName)
            print("created folder for: " + heroName)
        for f in filesToCreate:
            if (not os.path.exists(heroName + "/" + f)):
                htmlFile = open(heroName + "/" + f, "w")
                htmlFile.write("<pre>" + f.replace(".html","") + "</pre>")
                htmlFile.close()
                print("created " + f + " for: " + heroName)

print("done!")
