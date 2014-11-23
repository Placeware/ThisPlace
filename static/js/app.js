var These3Words = (function () {
  'use strict';

  var defaultLat = 46.2323355675,
      defaultLng = 6.05541944504,
      defaultLabel = 'spitting-ripple-fontanel';


  var apiGet = function (req, callback, callbackError) {
    var request = new window.XMLHttpRequest();
    request.open('GET', '/api/' + req, true);
    request.onload = function () {
      callback(request.status, JSON.parse(request.responseText));
    };
    if (typeof callbackError === "function") {
      request.onerror = callbackError;
    }
    request.send();
  };

  var apiGetFromLatLng = function(latLng, callback, callbackError) {
    apiGet('' + latLng.lat() + ',' + latLng.lng(), callback, callbackError);
  };


  var Map = function (lat, lng, label) {
    this.latLng = new google.maps.LatLng(lat || defaultLat, lng || defaultLng);
    this.label = label || defaultLabel;

    this.mapCanvas = null;
    this.map = null;
    this.marker = null;

    this.searchInput = null;
    this.searchBox = null;
  };

  Map.prototype.init = function () {
    var that = this;
    var initMap = function () {
      that.map = new google.maps.Map(that.mapCanvas, {
        center: that.latLng,
        zoom: 14,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          position: google.maps.ControlPosition.BOTTOM_LEFT
        },
        panControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        streetViewControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM
        }
      });
      that.marker = new google.maps.Marker({
        position: that.latLng,
        map: that.map,
        title: that.label
      });

      google.maps.event.addListener(that.map, 'click', function (evt) {
        that.moveTo(evt.latLng);
      });

      that.searchInput = document.createElement('input');
      that.searchInput.value = that.label;
      that.searchInput.id = 'pac-input';
      that.searchInput.classList.add('controls');
      that.searchInput.setAttribute('type', 'text');
      that.searchInput.setAttribute('placeholder', 'These3Words');
      that.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
          that.searchInput);
      that.searchBox = new google.maps.places.SearchBox(that.searchInput);
      google.maps.event.addListener(that.searchBox, 'places_changed',
          function() {
        var places = that.searchBox.getPlaces();
        if (places.length > 0) {
          var place = places[0];
          that.map.setCenter(place.geometry.location);
          that.moveTo(place.geometry.location);
        } else {
          var words = that.searchInput.value;
          if (/\w+-\w+-\w+/.test(words)) {
            apiGet(words, function(status, data) {
              if (status >= 200 && status < 400) {
                that.moveTo(new google.maps.LatLng(data.lat, data.lng), words);
              }
            });
          }
        }
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
    apiGetFromLatLng(latLng, function (status, data) {
      if (status >= 200 && status < 400) {
        that.update(latLng, data.three);
        window.history.pushState({
          lat: latLng.lat(),
          lng: latLng.lng(),
          label: data.three
        }, data.three, '/' + data.three);
        document.title = 'These3Words: ' + data.three;
        that.searchInput.value = data.three;
      }
    });
  };

  Map.prototype.update = function (latLng, label) {
    this.latLng = latLng;
    this.label = label;
    this.marker.setPosition(latLng);
    this.marker.setTitle(label);
    if (!this.map.getBounds().contains(latLng)) {
      this.map.panTo(latLng);
    }
  };
  
  
  return {
    Map: Map,
    apiGet: apiGet,
    apiGetFromLatLng: apiGetFromLatLng
  };
}());
