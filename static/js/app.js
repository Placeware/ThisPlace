var These3Words = (function () {
  'use strict';

  var defaultLat = 46.2323355675,
      defaultLng = 6.05541944504,
      defaultLabel = 'spitting-ripple-fontanel';


  var apiGet = function (latLng, callback, callbackError) {
    var request = new window.XMLHttpRequest();
    request.open('GET', '/api/' + latLng.lat() + ',' + latLng.lng(), true);
    request.onload = function () {
      callback(request.status, JSON.parse(request.responseText));
    };
    if (typeof callbackError === "function") {
      request.onerror = callbackError;
    }
    request.send();
  };


  var Map = function (lat, lng, label) {
    this.latLng = new google.maps.LatLng(lat || defaultLat, lng || defaultLng);
    this.label = label || defaultLabel;

    this.mapCanvas = null;
    this.map = null;
    this.marker = null;
  };

  Map.prototype.init = function () {
    var that = this;
    var initMap = function () {
      that.map = new google.maps.Map(that.mapCanvas, {
        center: that.latLng,
        zoom: 14
      });
      that.marker = new google.maps.Marker({
        position: that.latLng,
        map: that.map,
        title: that.label
      });

      google.maps.event.addListener(that.map, 'click', function (evt) {
        that.moveTo(evt.latLng);
      });
    };
    this.mapCanvas = document.body.appendChild(document.createElement('div'));
    this.mapCanvas.id = 'map-canvas';
    google.maps.event.addDomListener(window, 'load', initMap);
    window.addEventListener('popstate', function (evt) {
      var state = evt.state;
      if (typeof state === "object") {
        console.log(state);
        that.update(new google.maps.LatLng(state.lat, state.lng), state.label);
      }
    });
    window.history.replaceState({
      lat: that.latLng.lat(),
      lng: that.latLng.lng(),
      label: that.label
    }, that.label, '/' + that.label);
    document.title = 'These3Words: ' + that.label;
  };

  Map.prototype.moveTo = function (latLng) {
    var that = this;
    apiGet(latLng, function (status, data) {
      if (status >= 200 && status < 400) {
        that.update(latLng, data.three);
        window.history.pushState({
          lat: latLng.lat(),
          lng: latLng.lng(),
          label: data.three
        }, data.three, '/' + data.three);
        document.title = 'These3Words: ' + data.three;
      }
    });
  };

  Map.prototype.update = function (latLng, label) {
    this.latLng = latLng;
    this.label = label;
    this.marker.setPosition(latLng);
    this.marker.setTitle(label);
  };
  
  
  return {
    Map: Map
  };
}());
