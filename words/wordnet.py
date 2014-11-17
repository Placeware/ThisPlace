import nltk
import string


lemmas = nltk.corpus.wordnet.all_lemma_names()
wordnet_lemmas = list(w.lower() for w in lemmas if 4<=len(w)<9 and
                      not any(c in string.punctuation for c in w) and
                      not any(c in string.digits for c in w))
assert len(wordnet_lemmas) == len(set(wordnet_lemmas))

f = open("wordnet-list", "w")
f.write("\n".join(wordnet_lemmas))
f.close()
