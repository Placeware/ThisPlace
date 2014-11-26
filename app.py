#!/usr/bin/env python

import bottle
from bottle import (
    get,
    run,
    static_file,
    template
)

import thesethreewords as these


example_locs = [("sydney", (-33.867480754852295, 151.20700120925903)),
                ("battery", (40.70329427719116, -74.0170168876648)),
                ("san_fran", (37.790114879608154, -122.4202036857605))]
example_locs = dict((name,these.four_words(pos)) for name,pos in example_locs)

@get('/static/<filename:path>')
def serve_static(filename):
    return static_file(filename, root='static')


@get('/')
def index():
    return template('index', err=None, **example_locs)


@get('/<threewords>')
def showMap(threewords):
    try:
        lat, lng = these.decode(threewords)
        return template('map', lat=lat, lng=lng, threewords=threewords)
    except:
        return template('index',
                        err="Could not find location {}".format(threewords),
                        **example_locs)


@get('/latlng/<lat:float>,<lng:float>')
def showMapFromLatLng(lat, lng):
    try:
        threewords = these.four_words((lat, lng))
        return template('map', lat=lat, lng=lng, threewords=threewords)
    except:
        return template('index',
                        err="Could not find location {}".format(threewords),
                        **example_locs)


# API
@get('/api/<lat:float>,<lng:float>')
def latLngToHash(lat, lng):
    try:
        three = these.three_words((lat,lng))
        four = these.four_words((lat,lng))
        six = these.six_words((lat,lng))
        return {'three': three, 'four': four, 'six': six}
    except:
        return {}


@get('/api/<threewords>')
def hashToLatLng(threewords):
    try:
        lat,lng = these.decode(threewords)
        return {"lat": lat, "lng": lng}
    except:
        return {}



if __name__ == '__main__':
    run(host='localhost', port=8080)

app = bottle.default_app()
