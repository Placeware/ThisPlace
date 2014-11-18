#!/usr/bin/env python

import bottle
from bottle import (
    get,
    run,
    static_file,
    template
)

import thesethreewords as these


@get('/static/<filename:path>')
def serve_static(filename):
    return static_file(filename, root='static')


@get('/')
def index():
    return template('index', err=None)


@get('/<threewords>')
def showMap(threewords):
    try:
        lat, lng = these.decode(threewords)
        return template('map', lat=lat, lng=lng, threewords=threewords)
    except:
        return template('index',
                        err="Could not find location {}".format(threewords))

@get('/latlng/<lat:float>,<lng:float>')
def showMapFromLatLng(lat, lng):
    try:
        threewords = these.three_words((lat, lng))
        return template('map', lat=lat, lng=lng, threewords=threewords)
    except:
        return template('index',
                        err="Could not find location {}".format(threewords))


# API
@get('/api/<lat:float>,<lng:float>')
def latLngToHash(lat, lng):
    try:
        three = these.three_words((lat,lng))
        six = these.six_words((lat,lng))
        return {'three': three, 'six': six}
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
