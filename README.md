ThisPlace
=========

Remember a location anywhere in the world with just four words.

Try it: http://thisplace.herokuapp.com/

Some interesting locations:

* [Battery Park, NYC](http://thisplace.herokuapp.com/lawful-lazily-brute-brody)
* [Downtown San Francisco](http://thisplace.herokuapp.com/look-wander-guinea-madden)
* [Sydney, Australia](http://thisplace.herokuapp.com/sting-metz-wyoming-nineteen)

This app was inspired by http://what3words.com/

We started with using three words as well but found that it required
obscure words, so we settled for four. See [words, words,
words](#words-words-words) for a discussion and how to use this with
shorter or longer wordlists.


example
=======

    >>> import thisplace

    # the home of particle physics
    >>> CERN = (46.232355, 6.055419)

    >>> four = thisplace.four_words(CERN)
    >>> print four
    'graham-ingram-sphere-rash'
    >>> thisplace.decode(four)
    (46.232335567474365, 6.055419445037842)

See where this is on [ThisPlace map][cernmap].


requirements
============

You need to install the [geohash][geohash] and [bottle][bottlepy]
libraries:

    $ pip install geohash
    $ pip install bottle


words, words, words
===================

There are a lot of 3x3m squares on the earth's surface.

By default we use four words to address every square. However
this library also supports using three or six words. Below some
reasoning why we made this choice.

To encode every square in only three words requires a long wordlist,
as a result some fairly obscure words get on it. If you can live with
having to remember more words the wordlist is much shorter and
simpler.

The methods to encode latitude and longitude in a different number of
words are sensibly named: `three_words`, `four_words` and
`six_words`. All of them can be decoded by the `decode` method.

The six word wordlist comes from the amazing [humanhash][humanhash]
library. Words were chosen to maximise clarity in human
communication, they should be more familiar than the words
on the three wordlist:

    >>> six = thisplace.six_words(CERN)
    >>> print six
    'spaghetti-carolina-kentucky-oscar-iowa-table'
    >>> thisplace.decode(six)
    (46.232335567474365, 6.055419445037842)


how it works
============

Each latitude/longitude pair is converted to a nine character
geohash. This provides about 3meter resolution at all latitudes. The
geohash is then converted to an integer which is encoded as a string
of words.

The `ThisPlace` hashes share the property of a `geohash` that
nearby locations have similar `ThisPlace` hashes:

    >>> other_CERN_site = (46.256811, 6.056792)
    >>> six = thisplace.six_words(other_CERN_site)
    >>> print six
    'spaghetti-carolina-kentucky-utah-seventeen-neptune'
    >>> thisplace.decode(six)
    (46.256797313690186, 6.056792736053467)
    >>> print thisplace.six_words(CERN)
    'spaghetti-carolina-kentucky-oscar-iowa-table'

The other CERN site is [here][othercernmap] on a map, it is indeed
close to the main [CERN site][cernmap].


webservice
==========

The file `app.py` provides a tiny webservice that allows to display a
location given by three words on a Google Maps map.

The server requires [bottle.py][bottlepy] to be installed. It can be run
locally by typing `./app.py` or `python app.py` respectively.


brought to you by [@betatim][betatim] and [@kdungs][kdungs] productions

[humanhash]: https://github.com/zacharyvoase/humanhash
[geohash]: https://code.google.com/p/python-geohash/
[cernmap]: http://thisplace.herokuapp.com/graham-ingram-sphere-rash
[othercernmap]: http://thisplace.herokuapp.com/spaghetti-carolina-kentucky-utah-seventeen-neptune
[bottlepy]: http://bottlepy.org/
[betatim]: https://twitter.com/betatim
[kdungs]: https://twitter.com/kdungs
