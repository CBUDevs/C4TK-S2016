#!/usr/bin/env python3
import pprint as pp
import simplejson as json
from firebase import firebase
import populate.gen_users
import logging
import populate.gen_churches
import math

BASEDIR = ""

# logging.basicConfig(level=logging.DEBUG)
# logger = logging.Logger()
logger = logging.getLogger(__name__)
logger.propagate = True
def ncr(n,k):
	return math.factorial(n)/(math.factorial(k)*(math.factorial(n-k)))

def pbin():
	pass

def main():
	logger.debug("Getting settings.")
	
	with open(BASEDIR+"settings.json") as f:
		settings = json.load(f)
	baseurl = settings['baseurl']
	fb = firebase.FirebaseApplication(baseurl, authentication=None)

	# result = fb.get('/users', None, {'print': 'pretty'})
	# print(result)
	# pp.pprint(all_users)

	logger.debug("Generating churches.")
	all_churches = populate.gen_churches.get_churches(7)
	logger.debug("PUTting churches.")
	response = fb.put("/",name="churches"+settings["TESTING"],data=all_churches,connection=None)
	
	logger.debug("Generating users.")
	all_users = populate.gen_users.get_users(10)
	logger.debug("PUTting users.")
	response = fb.post("/""users"+settings["TESTING"],data=all_users,connection=None)

	logger.debug("Generating attendance history")

	logger.info("DONE!")

if __name__ == '__main__':
	main()