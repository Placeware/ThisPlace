import bottle
from bottle import get, run, template

import thesethreewords as these


@get("/v1/hash/<lat:float>,<lng:float>.json")
def latlng_to_hash(lat, lng):
    try:
        three = these.three_words((lat,lng))
        six = these.six_words((lat,lng))
        return {"three": three, "six": six}

    except:
        return template('index',
                        err="Could not find location {}".format(threewords))

@get('/v1/hash/<threewords>.json')
def hash_to_latlng(threewords):
    try:
        lat,lng = these.decode(threewords)
        return {"lat": lat, "lng": lng}
        
    except:
        return template('index',
                        err="Could not find location {}".format(threewords))
