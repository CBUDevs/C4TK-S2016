#!/usr/bin/env python3
import random
import pprint as pp
import populate.clean_denoms

def get_users(n):
	with open("populate/names.txt") as f:
		# lines of FIRST LAST
		contents = [i.strip().split(' ') for i in f.read().strip().split('\n')]
	# print(contents)
	# append random email address

	all_denoms = populate.clean_denoms.get_cleaned()
	with open("populate/default_users.txt") as f:
		defaults = eval(f.read())

	user_list = defaults[:]

	for x in range(n):
		i = random.choice(contents)
		first = i[0]
		last = i[1]
		denom = random.choice(all_denoms)
		fullname = i[0] + " " + i[1]
		secret = str(random.randint(0,10000))
		myid = str(random.randint(0,10000))
		email = "{}.{}{}@example.com".format(first,last,myid)
		user_list.append(
			{
			"denomination":denom,
			"downvoted":[""],
			"email":email,
			"following": [""],
			"password":i[1] + secret + i[0],
			"seen":[""],
			"name":fullname,
			"picture":"http://memesvault.com/wp-content/uploads/Wat-Meme-Tumblr-04.jpg",
			"upvoted":[""],
			"username":i[0] + "_" + i[1] + myid,
			"bio":"My name is {} and I subscribe to {}.".format(fullname, denom)
			}
		)
	return user_list

def main():

	user_list = get_users(-1)
	pp.pprint(user_list)
	print(len(user_list),"users generated")
	with open("users.txt",'w') as f:
		f.write(str(pp.pformat(user_list)))

if __name__ == '__main__':
	main()