angular.module('abilityService', []).factory('ability', ['$http', function($http) {

    return {
        // call to get all heroes
        get : function(call) {
            $http.get('/api/abilities').then(function(res) {
              call(res);
            })
        },

        create : function(heroData) {
            return $http.post('/api/abilities', heroData);
        },

        find : function (obj, callback) {
          $http.put('/api/abilities', obj).then(function (res) {
            callback(res);
          });
        },

      
    }
}]);
