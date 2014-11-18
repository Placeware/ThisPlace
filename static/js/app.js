var These3Words = (function() {
  'use strict';

  var apiGet = function(latLng, callback, callbackError) {
    var request = new XMLHttpRequest();
    request.open('GET', '/api/' + latLng.lat() + ',' + latLng.lng(), true);
    request.onload = function() {
      callback(request.status, JSON.parse(request.responseText));
    };
    if (typeof callbackError !== "function") {
      request.onerror = function() { /* Don't handle errors. */};
    } else {
      request.onerror = callbackError;
    }
    request.send();
  };

  var defaultLat = 46.2323355675;
  var defaultLng = 6.05541944504;
  var defaultLabel = 'spitting-ripple-fontanel';

  var Map = function(lat_, lng_, label_) {
    this.lat = lat_ || defaultLat;
    this.lng = lng_ || defaultLng;
    this.label = label_ || defaultLabel;

    this.mapCanvas = null;
    this.map = null;
    this.marker = null;
  };

  Map.prototype.init = function() {
    var that = this;
    var initMap = function() {
      that.map = new google.maps.Map(that.mapCanvas, {
        center: {lat: that.lat, lng: that.lng},
        zoom: 14
      });
      that.marker = new google.maps.Marker({
        position: {lat: that.lat, lng: that.lng},
        map: that.map,
        title: that.label
      });

      google.maps.event.addListener(that.map, 'click', function(evt) {
        that.moveTo(evt.latLng);
      });
    };
    this.mapCanvas = document.body.appendChild(document.createElement('div'));
    this.mapCanvas.id = 'map-canvas';
    google.maps.event.addDomListener(window, 'load', initMap);
  };

  Map.prototype.moveTo = function(latLng) {
    var that = this;
    apiGet(latLng, function(status, data) {
      console.log(data);
      if (status >= 200 && status < 400) {
        that.lat = latLng.lat;
        that.lng = latLng.lng;
        that.label = data.three;
        that.marker.setPosition(latLng);
        that.marker.setTitle(that.label);
      }
    });
  };
  
  
  return {
    Map: Map
  };
}());
