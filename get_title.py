import urllib2
import csv
from bs4 import BeautifulSoup

rows = [['DATE', 'LAT', 'LONG', 'HUMANNAME', 'COUNT', 'GOLDSTEIN', 'SAMPLEURL', 'TITLE']]

with open("data/violent.csv", "r") as f:
	reader = csv.reader(f)

	next(reader)

	for row in reader:
		# print row[0]

		try:
			soup = BeautifulSoup(urllib2.urlopen(row[6]))

			row.append(str(soup.title.string.encode("utf-8").strip()))
			print soup.title.string.strip()
		except Exception, e:
			row.append("none")
			print "none"

		rows.append(row)


with open("data/violent_titles.csv", "w") as output:
	writer = csv.writer(output, lineterminator="\n", quoting=csv.QUOTE_NONNUMERIC)
	writer.writerows(rows)

