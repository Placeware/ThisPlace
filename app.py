#!/usr/bin/env python

from bottle import (
    get,
    run,
    template
)

import thesethreewords as these


@get('/')
def index():
    return template('index', err=None)

@get('/<threewords>')
def showMap(threewords):
    try:
        lat, lng = these.decode(threewords)
        return template('map', lat=lat, lng=lng)
    except:
        return template('index',
                        err="Could not find location {}".format(threewords))


if __name__ == '__main__':
    run(host='localhost', port=8080)
