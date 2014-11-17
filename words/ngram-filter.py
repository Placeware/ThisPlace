"""Filter and reformat the google ngram corpus"""
import string
import fileinput

for line in fileinput.input():
    word, year, count, _ = line.strip().split()

    if year != "2008":
        continue
        
    count = int(count)
    if count < 40:
        continue

    if not (4 <= len(word) < 7):
        continue

    if word.upper() == word or word[:2].upper() == word[:2]:
        continue

    if any(c in word for c in string.punctuation + string.digits):
        continue
        
    print count, word
