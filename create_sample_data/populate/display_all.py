#!/usr/bin/env python3
from firebase import firebase
import json
import pprint as pp
with open("settings.json") as f:
	settings = json.load(f)
urls = settings['locations']
print("Settings: ")
pp.pprint(settings)

# instantiate connection to db
baseurl = settings['baseurl']
fb = firebase.FirebaseApplication(baseurl, None)
pp.pprint(fb.get(baseurl,None))
# # sample of data retrieval
# all_churches = firebase.get(urls['churches'],None) #takes URL and index of snapshot you get back
# # a second argument of None returns a JSON array of everything in that url
# print("Churches: ")
# pp.pprint(all_churches)

# all_users = firebase.get(urls['users'],None)
# print("Users: ")
# pp.pprint(all_users)
