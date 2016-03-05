#!/usr/bin/env python3
import random
import pprint as pp
import string
import populate.gen_sermons
import json


with open("settings.json") as f:
	settings = json.load(f)

with open("populate/churchname_templates.txt") as f:
	templates = f.read().strip().split('\n')

with open("populate/cleaned_cities.txt") as f:
	cities = f.read().split('\n')

with open("populate/cleaned_denoms.txt") as f:
	denoms = f.read().split('\n')

def get_churches(n):

	cout = []
	for i in range(n):
		denom = random.choice(denoms)
		secret = random.randint(0,10000)
		myid = str(random.randint(0,10000))
		title = random.choice(templates).format(
					church=random.choice(denom),
					city=random.choice(cities),
					denom=denom
				)
		# zipcode = ''.join([str(random.randint(0,9)) for i in range(5)])
		zipcode = str(random.randint(1,4))*5
		myhash = ''.join([i[0] for i in title.split(' ') if len(i) > 0])

		all_sermons = populate.gen_sermons.get_sermons(denom,15)

		ups = sum([item["upvotes"] for index, item in enumerate(all_sermons)])
		downs = sum([item["downvotes"] for indes, item in enumerate(all_sermons)])
		cout.append(
			{
				"denomination":denom,
				"description":"We are {title} and we teach {denom}.".format(title=title,denom=denom),
				"email":myhash+myid+"@example.com",
				"followers":random.randint(0,500),
				"link":"www." + ''.join([i for i in title if i not in string.punctuation+" "]) + myid + ".com",
				"password":myhash + str(secret),
				"sermons":all_sermons,
				"title":title,
				"totalDownvotes":downs,
				"totalUpvotes":ups,
				"username":myhash + myid,
				"zipcode":zipcode
			}

		)
	return cout


def main():
	pp.pprint(get_churches(10))

if __name__ == '__main__':
	main()