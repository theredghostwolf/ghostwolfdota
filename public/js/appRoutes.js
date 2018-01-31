// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'mainController'
        })

        .when('/heroes', {
          templateUrl: 'views/heroes.html',
          controller: 'heroesController'
        })

        .when('/heroes/:hero_id', {
          templateUrl: 'views/guide.html',
          controller: 'guidesController'
        });

    $locationProvider.html5Mode(true);

}]);
