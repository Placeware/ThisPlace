Wordnet wordlist
================

This is a wordlist based on the lemmas in [WordNet][wordnet]. It
produces a list of words much less esoteric than the google ngram
list below.

Run `wordnet.py` to create the wordnet wordlist.


Creating the google word list
=============================

Download the corpus from [google ngram][googlengram] with:

    for a in a b c d e f g h i j k l m n o p q r s t u v w x y z; do
        wget http://storage.googleapis.com/books/ngrams/books/googlebooks-eng-all-1gram-20120701-$a.gz;
    done

[wordnet]: http://wordnet.princeton.edu/
[googlengram]: http://storage.googleapis.com/books/ngrams/books/datasetsv2.html

then you can filter the words like this:

    for L in a b c d e f g h i j k l m n o p q r s t u v w x y z; do
        gzcat googlebooks-eng-all-1gram-20120701-$L.gz | python ngram-filter.py > googlebooks-eng-all-1gram-20120701-$L-filtered;
    done

To get a list of the top 300 words:

    sort -n googlebooks-eng-all-1gram-20120701-*-filtered | tail -n 300

To create the wordlist used by `These3Words` run:

   sort -n googlebooks-eng-all-1gram-20120701-*-filtered | python normalise-words.py | sort | uniq | tail -n32768 > google-ngram-list

Check that your list is long enough by counting the lines
in `google-ngram-list`, you need exactly 32768 words
