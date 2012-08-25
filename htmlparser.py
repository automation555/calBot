from HTMLParser import HTMLParser
from urllib import urlopen
from re import sub
from sys import stderr
from traceback import print_exc
import fileinput

class _DeHTMLParser(HTMLParser):
	def __init__(self):
		HTMLParser.__init__(self)
		self.__text = []

	def handle_data(self, data):
		text = data.strip()
		print text
		if len(text) > 0:
			text = sub('[ \t\r\n]+', ' ', text)
			if not "<!--" in text :
				self.__text.append(text + ' ')

	def handle_starttag(self, tag, attrs):
		if tag == 'p':
			self.__text.append('\n\n')
		elif tag == 'br':
			self.__text.append('\n')
	def handle_startendtag(self, tag, attrs):
		if tag == 'br':
			self.__text.append('\n\n')

	def text(self):
		return ''.join(self.__text).strip()


def dehtml(text):
	try:
		parser = _DeHTMLParser()
		parser.feed(text)
		parser.close()
		return parser.text()
	except:
		print_exc(file=stderr)
		return text

def proper_date(word):
	date = (((word - currDay) % 7) + currDate - 1) % monthLength[currMonth] + 1
	if(date < currDate):
		return date + "/" + proper_nameMonth[currMonth + 1] + "/" + currYear
	else:
		return date + "/" + proper_nameMonth[currMonth] + "/" + currYear

def absolute(word):
	if word in days:
		word = normalize(word)
		return proper_date(word)
	elif word in months:
		return proper_nameMonth[word]

def construct(line, i):
	if i==len(line)-1:
		return line
	try:
		int(line[i])
		if line[i+1] in ["days","weeks","day","week"]:
			return replace(line, i)
	except ValueError:
		if line[i+1] in timeKeyWords:
		  return replace(line, i)
	return line

def temporal(line, timeKeyWords):
	for i in range(0, len(line)):
		if line[i] in timeKeyWords:
			line[i] = absolute(line[i])
		elif line[i] in relativeTimeKeyWords:
			line = construct(line,i)
	return line

def main():
	foo = open("timeKeyWords.txt", "r")
	timeKeyWords = foo.readlines()
	foo.close()
	foo = open("relativeTimeKeywords", "r")
	relativeTimeKeyWords = foo.readlines()
	foo.close()
	for line in timeKeyWords:
		print line,
	fileNumber = 0
	url = ""
	for line in fileinput.input():
		url = url + line
	print url
	print "Confirm URL again"
	url = raw_input()
	#html = urlopen(url).read()
	html = url
	rawText = dehtml(html)
	print "rawText is", rawText
	chunks = rawText.split('.')
	for i in range(0, len(chunks)):
		print "line is", chunks[i]
		chunks[i] = chunks[i].split()
	foo = open("chunk.txt","w")
	for line in chunks :
		resetCurrDate()
		res = temporal(line, timeKeyWords)
		if not res == None:
			for word in res:
				foo.write(word + " ")
		foo.write(".")
	foo.close()

if __name__ == '__main__':
	main()
