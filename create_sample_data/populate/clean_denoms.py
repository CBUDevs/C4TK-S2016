#!/usr/bin/env python3
import pprint as pp

def get_cleaned():
	with open("populate/bad-denominations.txt") as f:
		return [i.strip().split("(")[0] for i in f.read().strip().split('\n') if len(i) > 0]
	

def main():
	result = get_cleaned()
	pp.pprint(result)

	with open("populate/cleaned_denoms.txt",'w') as f:
		f.write('\n'.join(result))

if __name__ == '__main__':
	main()