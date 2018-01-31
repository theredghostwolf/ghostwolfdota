angular.module('heroesCtrl', []).controller('heroesController', function($scope, $http, hero) {
  hero.get(function (res) {
    $scope.heroes = res.data;
  });

  $scope.sortField = "localized_name";
  $scope.reverseSort = false;
  
});
