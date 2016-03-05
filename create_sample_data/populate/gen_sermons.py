#!/usr/bin/env python3
import random
import pprint as pp

def get_sermons(denom, n):
	with open("populate/sermon_templates.txt") as f:
		templates = f.read().split('\n')
	cout = []
	voteratio = random.randint(3,9)/10
	# print(voteratio)
	popmin = 10
	popmax = 200
	pop = random.randint(popmin,popmax)
	popdev = pop//random.randint(2,5)
	for i in range(n):
		attend = random.randint(pop - popdev, pop + popdev)
		ups = random.randint(0,int(attend*voteratio))
		downs = random.randint(0,int(attend*(1-voteratio)))
		time = random.randint(946080000,1450656000)
		# denom = random.choice(denoms)
		title,notes = random.choice(templates).format(
				n = random.randint(0,100000),
				denom=denom
			).split(":")

		cout.append(
				{
				"attendance":attend,
				"upvotes":ups,
				"downvotes":downs,
				"notes":notes,
				"parent"
				"time":time,
				"title":title
				}
			)
	return cout 


def main():
	pp.pprint(get_sermons("test denom",10))

if __name__ == '__main__':
	main()