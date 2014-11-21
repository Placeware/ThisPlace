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

Filter out unpopular words, not between four and seven characters,
containing punctuation and numbers, etc like this:

    for L in a b c d e f g h i j k l m n o p q r s t u v w x y z; do
        gzcat googlebooks-eng-all-1gram-20120701-$L.gz | python ngram-filter.py > googlebooks-eng-all-1gram-20120701-$L-filtered;
    done

To get a list of the top 300 words:

    sort -n googlebooks-eng-all-1gram-20120701-*-filtered | tail -n 300

Final step in creating a wordlist useable by `These3Words` is to run:

   sort -n googlebooks-eng-all-1gram-20120701-*-filtered | python normalise-words.py | sort -k 2 | uniq -f 1 | sort -n | tail -n32768 | awk '{print $2}' > google-ngram-list

Check that your list is long enough by counting the lines
in `google-ngram-list`, you need exactly 32768 words.
