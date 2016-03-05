#!/usr/bin/env python3
import pprint as pp

def get_cleaned():
	with open("cities.txt") as f:
		return [i.strip().split(" \t")[1] for i in f.read().split('\n') if len(i) > 0]


def main():
	contents = get_cleaned()
	pp.pprint(contents)
	with open("cleaned_cities.txt",'w') as f:
		f.write('\n'.join(contents))
if __name__ == '__main__':
	main()