These3Words
===========

Remember a location anywhere in the world with just four words.

Try it: http://thisplace.herokuapp.com/

Some interesting locations:

* [Battery Park, NYC](http://thisplace.herokuapp.com/eating-stale-burney-raton)
* [Downtown San Francisco](http://thisplace.herokuapp.com/lounge-charge-lias-fort)
* [Sydney, Australia](http://thisplace.herokuapp.com/harris-medial-began-form)

This app was inspired by http://what3words.com/

We started with using three words as well but found that it required
obscure words, so we settled for four. See [words, words,
words](#words-words-words) for a discussion and use with shorter or
longer wordlists.


example
=======

    >>> import thesethreewords as these

    # the home of particle physics
    >>> CERN = (46.232355, 6.055419)

    >>> three = these.four_words(CERN)
    >>> print four
    'healer-danube-portal-custom'
    >>> these.decode(four)
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
this library also supports using three or six words.

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

    >>> six = these.six_words(CERN)
    >>> print six
    'spaghetti-carolina-kentucky-oscar-iowa-table'
    >>> these.decode(six)
    (46.232335567474365, 6.055419445037842)


how it works
============

Each latitude/longitude pair is converted to a nine character
geohash. This provides about 3meter resolution at all latitudes. The
geohash is then converted to an integer which is encoded as a string
of words.

The `these-3-words` hashes share the property of a `geohash` that
nearby locations have similar `these-3-words` hashes:

    >>> other_CERN_site = (46.256811, 6.056792)
    >>> six = these.six_words(other_CERN_site)
    >>> print six
    'spaghetti-carolina-kentucky-utah-seventeen-neptune'
    >>> these.decode(six)
    (46.256797313690186, 6.056792736053467)
    >>> print these.six_words(CERN)
    'spaghetti-carolina-kentucky-oscar-iowa-table'

The other CERN site is [here][othercernmap] on a map, it is indeed
close to the main [CERN site][cernmap].


webservice
==========

The file `server.py` provides a tiny webservice that allows to display a
location given by three words on a Google Maps map.

The server requires [bottle.py][bottlepy] to be installed. It can be run
locally by typing `./app.py` or `python app.py` respectively.


brought to you by [@betatim][betatim] and [@kdungs][kdungs] productions

[humanhash]: https://github.com/zacharyvoase/humanhash
[geohash]: https://code.google.com/p/python-geohash/
[cernmap]: http://thisplace.herokuapp.com/turks-yunnan-salant
[othercernmap]: http://thisplace.herokuapp.com/spaghetti-carolina-kentucky-utah-seventeen-neptune
[bottlepy]: http://bottlepy.org/
[betatim]: https://twitter.com/betatim
[kdungs]: https://twitter.com/kdungs
