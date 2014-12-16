/*global ga*/
var Analytics = (function () {
  var analyticsId = '';

  var screens = {
    map: 'Map',
    help: 'Help'
  };

  var init = function () {
    ga('create', analyticsId);
    ga('set', {'appName': 'ThisPlace',
               'appId': 'com.herokuapp.thisplace',
               'appVersion': '1.0' });
    ga('set', 'anonymizeIp', true);
  };

  var sendScreen = function (screen) {
    ga('send', 'screenview', {'screenName': screens[screen] || 'strange'});
  };

  return {
    init: init,
    sendScreen: sendScreen
  };
}());
