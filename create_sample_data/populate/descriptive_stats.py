#!/usr/bin/env python3
from firebase import firebase
import logging
BASEDIR = "../"
logging.basicConfig(level=logging.DEBUG)

def main():
	with open(BASEDIR+"settings.json") as f:
		settings = json.load(f)
	baseurl = settings['baseurl']

if __name__ == '__main__':
	main()