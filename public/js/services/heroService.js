angular.module('heroService', []).factory('hero', ['$http', function($http) {

    return {
        // call to get all heroes
        get : function(call) {
            $http.get('/api/heroes').then(function(res) {
              call(res);
            })
        },

        create : function(heroData) {
            return $http.post('/api/heroes', heroData);
        },

        find : function (obj, callback) {
          $http.put('/api/heroes', obj).then(function (res) {
            callback(res);
          });
        }
    }
}]);
