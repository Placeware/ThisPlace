"""
thesethreewords: Human-readable addresses for every 3x3m square of the earth's surface.
The simplest ways to use this module are the `three_words` and `decode`
functions. For more see `WordHasher`.
"""
import random

import geohash


def get_words(fname):
    lines = open(fname)
    words = []
    for word in lines:
        words.append(word.strip())

    lines.close()
    random.seed(634634)
    random.shuffle(words)
    words = words[:2**15]
    assert len(words) == len(set(words))
    return words

# These read like alien races from a sci-fi book
GOOGLE_WORDLIST = get_words("words/google-ngram-list")
# shorter list with only 4096 words
GOOGLE_4096WORDS = get_words("words/google-ngram-list-4096")
# current best list for the three word hash
WORDNET_LEMMAS = get_words("words/wordnet-list")

# Human friendly word list, taken directly from humanhash project
# these are the best words but there are not enough of
# them so we only use them for the six word hash
HUMAN_WORDLIST = (
        'ack', 'alabama', 'alanine', 'alaska', 'alpha', 'angel', 'apart', 'april',
        'arizona', 'arkansas', 'artist', 'asparagus', 'aspen', 'august', 'autumn',
        'avocado', 'bacon', 'bakerloo', 'batman', 'beer', 'berlin', 'beryllium',
        'black', 'blossom', 'blue', 'bluebird', 'bravo', 'bulldog', 'burger',
        'butter', 'california', 'carbon', 'cardinal', 'carolina', 'carpet', 'cat',
        'ceiling', 'charlie', 'chicken', 'coffee', 'cola', 'cold', 'colorado',
        'comet', 'connecticut', 'crazy', 'cup', 'dakota', 'december', 'delaware',
        'delta', 'diet', 'don', 'double', 'early', 'earth', 'east', 'echo',
        'edward', 'eight', 'eighteen', 'eleven', 'emma', 'enemy', 'equal',
        'failed', 'fanta', 'fifteen', 'fillet', 'finch', 'fish', 'five', 'fix',
        'floor', 'florida', 'football', 'four', 'fourteen', 'foxtrot', 'freddie',
        'friend', 'fruit', 'gee', 'georgia', 'glucose', 'golf', 'green', 'grey',
        'hamper', 'happy', 'harry', 'hawaii', 'helium', 'high', 'hot', 'hotel',
        'hydrogen', 'idaho', 'illinois', 'india', 'indigo', 'ink', 'iowa',
        'island', 'item', 'jersey', 'jig', 'johnny', 'juliet', 'july', 'jupiter',
        'kansas', 'kentucky', 'kilo', 'king', 'kitten', 'lactose', 'lake', 'lamp',
        'lemon', 'leopard', 'lima', 'lion', 'lithium', 'london', 'louisiana',
        'low', 'magazine', 'magnesium', 'maine', 'mango', 'march', 'mars',
        'maryland', 'massachusetts', 'may', 'mexico', 'michigan', 'mike',
        'minnesota', 'mirror', 'mississippi', 'missouri', 'mobile', 'mockingbird',
        'monkey', 'montana', 'moon', 'mountain', 'muppet', 'music', 'nebraska',
        'neptune', 'network', 'nevada', 'nine', 'nineteen', 'nitrogen', 'north',
        'november', 'nuts', 'october', 'ohio', 'oklahoma', 'one', 'orange',
        'oranges', 'oregon', 'oscar', 'oven', 'oxygen', 'papa', 'paris', 'pasta',
        'pennsylvania', 'pip', 'pizza', 'pluto', 'potato', 'princess', 'purple',
        'quebec', 'queen', 'quiet', 'red', 'river', 'robert', 'robin', 'romeo',
        'rugby', 'sad', 'salami', 'saturn', 'september', 'seven', 'seventeen',
        'shade', 'sierra', 'single', 'sink', 'six', 'sixteen', 'skylark', 'snake',
        'social', 'sodium', 'solar', 'south', 'spaghetti', 'speaker', 'spring',
        'stairway', 'steak', 'stream', 'summer', 'sweet', 'table', 'tango', 'ten',
        'tennessee', 'tennis', 'texas', 'thirteen', 'three', 'timing', 'triple',
        'twelve', 'twenty', 'two', 'uncle', 'undress', 'uniform', 'uranus', 'utah',
        'vegan', 'venus', 'vermont', 'victor', 'video', 'violet', 'virginia',
        'washington', 'west', 'whiskey', 'white', 'william', 'winner', 'winter',
        'wisconsin', 'wolfram', 'wyoming', 'xray', 'yankee', 'yellow', 'zebra',
        'zulu')


class WordHasher(object):
    def __init__(self):
        """Convert latitude and longitudes into human readable strings."""
        self._symbols = "0123456789bcdefghjkmnpqrstuvwxyz"
        self._decode_symbols = dict((ch, i) for (i, ch) in enumerate(self._symbols))
        self._encode_symbols = dict((i, ch) for (i, ch) in enumerate(self._symbols))
        self.six_wordlist = HUMAN_WORDLIST
        self.four_wordlist = GOOGLE_4096WORDS
        self.three_wordlist = GOOGLE_WORDLIST
        
    def three_words(self, (lat, lon)):
        """Convert coordinate to a combination of three words

        The coordinate is defined by latitude and longitude
        in degrees.
        """
        gh = geohash.encode(lat, lon, 9)
        words = "-".join(self.three_wordlist[p] for p in self.to_rugbits(self.geo_to_int(gh)))
        return words

    def four_words(self, (lat, lon)):
        """Convert coordinate to a combination of four words

        The coordinate is defined by latitude and longitude
        in degrees.
        """
        gh = geohash.encode(lat, lon, 9)
        words = "-".join(self.four_wordlist[p] for p in self.to_quads(self.pad(gh)))
        return words

    def six_words(self, (lat, lon)):
        """Convert coordinate to a combination of six words

        The coordinate is defined by latitude and longitude
        in degrees.

        With six words the word list contains only words
        which are short, easy to pronounce and easy distinguish.
        """
        gh = geohash.encode(lat, lon, 9)
        words = "-".join(self.six_wordlist[p] for p in self.to_bytes(self.pad(gh)))
        return words

    def decode(self, words):
        """Decode `words` to latitude and longitude"""
        words = words.split("-")
        if len(words) == 3:
            i = self.rugbits_to_int([self.three_wordlist.index(w) for w in words])

        elif len(words) == 4:
            i = self.quads_to_int([self.four_wordlist.index(w) for w in words])
            i = self.unpad(i)

        elif len(words) == 6:
            i = self.bytes_to_int([self.six_wordlist.index(w) for w in words])
            i = self.unpad(i)

        else:
            raise RuntimeError("Do not know how to decode a set of %i words."%(len(words)))

        geo_hash = self.int_to_geo(i)
        return geohash.decode(geo_hash)

    def geo_to_int(self, geo_hash):
        """Decode `geo_hash` to an integer"""
        base = len(self._symbols)
        number = 0
        for symbol in geo_hash:
            number = number*base + self._decode_symbols[symbol]
        
        return number

    def int_to_geo(self, integer):
        """Encode `integer` to a geo hash"""
        base = len(self._symbols)
        symbols = []
        while integer > 0:
            remainder = integer % base
            integer //= base
            symbols.append(self._encode_symbols[remainder])
            
        return ''.join(reversed(symbols))

    def pad(self, geo_hash):
        """Pad nine character `geo_hash` to 48bit integer"""
        assert len(geo_hash) == 9
        return self.geo_to_int(geo_hash) * 8

    def unpad(self, integer):
        """Remove 3bit of padding to get 45bit geo hash"""
        return integer>>3
    
    def to_bytes(self, integer):
        """Convert a 48bit `integer` to a list of 6bytes"""
        bytes = [integer & 0b11111111]
        for n in xrange(1,6):
            div = 2**(n*8)
            bytes.append((integer/div) & 0b11111111)
        
        bytes.reverse()
        return bytes

    def bytes_to_int(self, bytes):
        """Convert a list of 6`bytes` to an integer"""
        assert len(bytes) == 6
        N = 0
        bytes.reverse()
        for n,b in enumerate(bytes):
            N += b * (2**(8*(n)))
            
        return N

    def to_quads(self, integer):
        """Convert a 48bit `integer` to a list of 4 quads"""
        quads = [integer & 0b111111111111]
        for n in xrange(1,4):
            div = 2**(n*12)
            quads.append((integer/div) & 0b111111111111)
        
        quads.reverse()
        return quads

    def quads_to_int(self, quads):
        """Convert a list of four 12bit values to an integer"""
        assert len(quads) == 4
        N = 0
        quads.reverse()
        for n,b in enumerate(quads):
            N += b * (2**(12*(n)))
            
        return N

    def to_rugbits(self, integer):
        """Convert a 45bit `integer` to a list of 3rugbits
    
        A rugbit is like a byte but with 15bits instead of eight.
        """
        fifteen_bits = 0b111111111111111
        rugbits = [(integer/(2**30)) & fifteen_bits,
                   (integer/(2**15)) & fifteen_bits,
                   integer & fifteen_bits]
        return rugbits

    def rugbits_to_int(self, rugbits):
        """Convert a list of `rugbits` to an integer"""
        assert len(rugbits) == 3
        return (rugbits[0] *(2**30)) + (rugbits[1] *(2**15)) + (rugbits[2])


DEFAULT_HASHER = WordHasher()
three_words = DEFAULT_HASHER.three_words
four_words = DEFAULT_HASHER.four_words
six_words = DEFAULT_HASHER.six_words
decode = DEFAULT_HASHER.decode
