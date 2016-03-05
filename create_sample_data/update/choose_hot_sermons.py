#!/usr/bin/env python3
from firebase import firebase
import logging
import pprint as pp
import json
BASEDIR = ""
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def get_hot_sermons(church_url, churches_list):
	# preserve order, essential for making 
	# reference to items in the db

	# list of LINKS to all sermons sorted by ranking
	serms_with_rank = [
			{
				"sermonReference":church_url + "/".join(['',str(chindex),"sermons",str(serindex)]),
				"level":((int(sermon["upvotes"])**2+int(sermon["downvotes"])**2)**(1/2)/int(sermon["attendance"]))
			}
		for chindex, church in enumerate(churches_list)
		for serindex, sermon in enumerate(church['sermons'])
		 ]
	sermons_by_controversy = sorted(serms_with_rank, key=lambda i: i["level"])[::-1]
	return sermons_by_controversy

def main():
	with open(BASEDIR+"settings.json") as f:
		settings = json.load(f)
	baseurl = settings['baseurl']
	fb = firebase.FirebaseApplication(baseurl,None)

	all_churches = fb.get(settings['locations']['churches']+settings['TESTING'],None)
	# logging.debug(pp.pformat(all_churches))
	hots = get_hot_sermons(settings['locations']['churches']+settings["TESTING"],all_churches)
	# logger.debug(pp.pformat(hots))
	logger.debug("PUTting hot sermons")
	response = fb.put("/",name="hot"+settings["TESTING"]+"/sermons/controversial",data=hots,connection=None)
	logger.info(pp.pformat(response))
	
if __name__ == '__main__':
	main()