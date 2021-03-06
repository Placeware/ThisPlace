/*jslint browser: true*/
/*global google*/
var ThisPlace = (function () {
  'use strict';

  var defaultLat = 46.233350,
      defaultLng = 6.055999,
      defaultLabel = 'graham-ingram-julien-despot';


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
    apiGet(latLng.lat() + ',' + latLng.lng(), callback, callbackError);
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
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
        panControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
        streetViewControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
        }
      });
      that.marker = new google.maps.Marker({
        position: that.latLng,
        map: that.map,
        title: that.label
      });

      google.maps.event.addListener(that.map, 'click', function (evt) {
        that.mapZoom = that.map.getZoom();
        setTimeout(function () {
	      // if zoom level has changed then the user
	      // double clicked instead of single clicked
	      // so we do not want to move, just zoom
	      if (that.map.getZoom() !== that.mapZoom) {
            return;
	      }
          that.moveTo(evt.latLng);
        }, 300);
      });

      that.searchInput = document.createElement('input');
      that.searchInput.id = 'pac-input';
      that.searchInput.classList.add('controls');
      that.searchInput.setAttribute('type', 'text');
      that.searchInput.setAttribute('placeholder', 'Search');
      that.map.controls[google.maps.ControlPosition.LEFT_TOP].push(
          that.searchInput);

      var infoBox = document.createElement('div');
      infoBox.id = 'pac-infobox';
      infoBox.classList.add('controls');
      that.map.controls[google.maps.ControlPosition.LEFT_TOP].push(
          infoBox);

      var infoDisplay = document.createElement('span');
      infoDisplay.id = 'pac-infodisplay';
      infoBox.appendChild(infoDisplay);

      var info = document.createElement('div');
      //info.id = 'pac-blah';
      infoDisplay.appendChild(info);

      var infoText = document.createElement('span');
      infoText.id = 'pac-infotext';
      infoText.innerHTML = '4words:';
      info.appendChild(infoText);

      that.infoLoc = document.createElement('span');
      that.infoLoc.id = 'pac-infolocation';
      that.infoLoc.innerHTML = that.label;
      info.appendChild(that.infoLoc);

      that.infoLatLng = document.createElement('div');
      that.infoLatLng.id = 'pac-infolatlng';
      that.infoLatLng.innerHTML = that.latLng.lat().toFixed(6) + ', '
                                + that.latLng.lng().toFixed(6);
      infoDisplay.appendChild(that.infoLatLng);

      var aboutBtn = document.createElement('span');
      aboutBtn.id = 'pac-aboutbtn';
      infoBox.appendChild(aboutBtn);
      var aboutLnk = aboutBtn.appendChild(document.createElement('a'));
      aboutLnk.href = "/help.html";
      aboutLnk.innerHTML = "Help";

      that.searchBox = new google.maps.places.SearchBox(that.searchInput);
      google.maps.event.addListener(that.searchBox, 'places_changed',
          function() {
       // something that matches a 3word, 4word or 6word
       // takes precedence over the google search result
       var words = that.searchInput.value;
       if (/^\w+-\w+-\w+$/.test(words) || /^\w+-\w+-\w+-\w+$/.test(words) ||
           /^\w+-\w+-\w+-\w+-\w+-\w+$/.test(words)) {
         apiGet(words, function(status, data) {
           if (status >= 200 && status < 400) {
	     that.moveTo(new google.maps.LatLng(data.lat, data.lng), words);
             return;
           }
         });
        }
        var places = that.searchBox.getPlaces();
        if (places.length > 0) {
          var place = places[0];
          that.moveTo(place.geometry.location);
        }
      });

      that.icnGeolocation = document.createElement('i');
      that.icnGeolocation.classList.add('fa', 'fa-map-marker');
      that.btnGeolocation = document.createElement('button');
      that.btnGeolocation.classList.add('controls', 'btn', 'btn-default');
      that.btnGeolocation.appendChild(that.icnGeolocation);
      that.btnGeolocation.addEventListener('click', function () {
        that.moveToGeolocation();
      });
      that.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
          that.btnGeolocation);
      that.btnGeolocation.toggleState = function () {
          that.icnGeolocation.classList.toggle('fa-map-marker');
          that.icnGeolocation.classList.toggle('fa-spin');
          that.icnGeolocation.classList.toggle('fa-spinner');
          this.disabled = !this.disabled;
      };
    };

    this.mapCanvas = document.body.appendChild(document.createElement('div'));
    this.mapCanvas.id = 'map-canvas';
    google.maps.event.addDomListener(window, 'load', initMap);
    window.addEventListener('popstate', function (evt) {
      var state = evt.state;
      if (typeof state === "object") {
        that.update(new google.maps.LatLng(state.lat, state.lng), state.label);
      }
    });
    window.history.replaceState({
      lat: that.latLng.lat(),
      lng: that.latLng.lng(),
      label: that.label
    }, that.label, '/' + that.label);
    document.title = 'ThisPlace: ' + that.label;

  };

  Map.prototype.moveTo = function (latLng) {
    var that = this;
    apiGetFromLatLng(latLng, function (status, data) {
      if (status >= 200 && status < 400) {
        that.update(latLng, data.four);
        window.history.pushState({
          lat: latLng.lat(),
          lng: latLng.lng(),
          label: data.four
        }, data.four, '/' + data.four);
        document.title = 'ThisPlace: ' + data.four;
        that.infoLoc.innerHTML = data.four;
        that.infoLatLng.innerHTML = latLng.lat().toFixed(6) + ', '
                                  + latLng.lng().toFixed(6);
      }
    });
  };

  Map.prototype.update = function (latLng, label) {
    this.latLng = latLng;
    this.label = label;
    this.infoLoc.innerHTML = label;
    this.infoLatLng.innerHTML = latLng.lat().toFixed(6) +', '+
                                latLng.lng().toFixed(6);
    this.marker.setPosition(latLng);
    this.marker.setTitle(label);
    if (!this.map.getBounds().contains(latLng)) {
      this.map.panTo(latLng);
    }
  };

  Map.prototype.moveToGeolocation = function () {
    if (window.navigator.geolocation) {
      var done = false;
      var that = this;
      that.btnGeolocation.toggleState();
      window.navigator.geolocation.getCurrentPosition(function (pos) {
        if (!done) {
          var latLng = new google.maps.LatLng(pos.coords.latitude,
                                              pos.coords.longitude);
          that.map.setZoom(20);
          that.moveTo(latLng);
          that.btnGeolocation.toggleState();
          done = true;
        }
      }, function (err) {
        if (!done) {
          if (err.code === 1) {  // User denied
            window.alert("You disabled geolocation. Please enable it for this"
                         + " feature to work.");
          } else {
            window.alert("We are very sorry but are having trouble locating"
                         + " you.\nIf you are interested in the error message,"
                         + " here it is: \n\n" + err.message);
          }
          that.btnGeolocation.toggleState();
          done = true;
        }
      });
      // Abort if nothing happened after 10 seconds.
      window.setTimeout(function () {
        if (!done) {
          window.alert("We were not able to determine your position.");
          that.btnGeolocation.toggleState();
          done = true;
        }
      }, 5000);
    }
  };

  return {
    Map: Map,
    apiGet: apiGet,
    apiGetFromLatLng: apiGetFromLatLng
  };
}());
