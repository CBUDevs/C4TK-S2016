#!/usr/bin/env python3
import populate.upload
import update.choose_hot_sermons
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.setLevel("DEBUG")
def main():
	populate.upload.main()
	update.choose_hot_sermons.main()
if __name__ == '__main__':
	main()