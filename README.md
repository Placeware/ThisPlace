These3Words
=============

Address any 3meter x 3meter square on earth with a unique three word name.

Inspired by http://what3words.com/


example
=======

    >>> import thesethreewords as these

    # the home of particle physics
    >>> CERN = (46.232355, 6.055419)

    >>> three = these.three_words(CERN)
    >>> print three
    'engirt-aleutic-canun'
    >>> these.decode(three)
    (46.232335567474365, 6.055419445037842)

Check out where this is on [google maps][cernmap].


requirements
============

You need to install the [geohash][geohash] and [bottle][bottlepy]
libraries:

    $ pip install geohash
    $ pip install bottle


six words
=========

There are a lot of 3x3m squares on the earth's surface. To encode
them in only three words requires a long wordlist, as a result
some fairly obscure words get on it. If you can live with
having to remember six words the wordlist is much shorter.
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

Each latitude/longitude pair is converted to a nine
character geohash. This provides about 3meter
resolution at all latitudes. The geohash is then
converted to an integer which is encoded as a string
of words.

The wordlist used to encode the `geohash` into just
three words uses your local computers dictionary. Some
attempts are made to remove really obscure words but
it could be better. You need to use the same wordlist
when encoding and decoding a `these-3-words` hash.

The `these-3-words` hash shares the
property of a `geohash` that nearby locations share
have similar `these-3-words` hashes

    >>> other_CERN_site = (46.256811, 6.056792)
    >>> six = these.six_words(other_CERN_site)
    >>> print six
    ''spaghetti-carolina-kentucky-utah-seventeen-neptune'
    >>> these.decode(six)
    (46.256797313690186, 6.056792736053467)

The other CERN site is [here][othercernmap].


webservice
==========

The file `server.py` provides a tiny webservice that allows to display a
location given by three words on a Google Maps map.

The server requires [bottle.py][bottlepy] to be installed. It can be run
locally by typing `./server.py` or `python server.py` respectively.


brought to you by [@betatim][betatim] and [@kdungs][kdungs] productions

[humanhash]: https://github.com/zacharyvoase/humanhash
[geohash]: https://code.google.com/p/python-geohash/
[cernmap]: https://www.google.ch/maps/place/46%C2%B013'56.4%22N+6%C2%B003'19.5%22E/@46.2323356,6.0554194,17z/data=!3m1!4b1!4m2!3m1!1s0x0:0x0
[othercernmap]: https://www.google.ch/maps/place/46%C2%B015'24.5%22N+6%C2%B003'24.4%22E/@46.256811,6.056792,14z/data=!4m2!3m1!1s0x0:0x0
[bottlepy]: http://bottlepy.org/
[betatim]: https://twitter.com/betatim
[kdungs]: https://twitter.com/kdungs
