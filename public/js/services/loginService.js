angular.module('loginService', []).factory('login', ['$cookie', function($cookie) {

    return {

      get: function (callback) {
        var id = $cookie.get("playerid");
        callback(id);
      }

      set: function (id) {
        $cookie.put("playerid",id);
      }

    }

}]);
