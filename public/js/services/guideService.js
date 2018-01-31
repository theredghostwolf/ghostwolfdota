angular.module('guideService', []).factory('guide', ['$http', function($http) {

    return {
        // call to get all heroes
        get : function(call) {
            $http.get('/api/guides').then(function(res) {
              call(res);
            })
        },

        create : function(heroData) {
            return $http.post('/api/guides', heroData);
        },

        find : function (obj, callback) {
          $http.put('/api/guides', obj).then(function (res) {
            callback(res);
          });
        }
    }
}]);
