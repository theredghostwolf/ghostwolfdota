angular.module('guidesCtrl', []).controller('guidesController', function($scope, $routeParams, hero, $http, guide, ability, $sce) {
  $scope.heroid = $routeParams.hero_id;


  hero.find({id: $routeParams.hero_id}, function (res) {
    $scope.hero = res.data;

    ability.find({heroID: $scope.hero.heroID}, function (res) {
      $scope.hero.abilities = res.data;
    })

    guide.find({heroID: $scope.hero.heroID}, function (res) {
      $scope.guide = {}
      $scope.guide.intro = $sce.trustAsHtml(res.data.intro)
      $scope.guide.skills = $sce.trustAsHtml(res.data.skills)
      $scope.guide.playstyle = $sce.trustAsHtml(res.data.playstyle)
      $scope.guide.itemization = $sce.trustAsHtml(res.data.itemization)
      $scope.guide.drafting = $sce.trustAsHtml(res.data.drafting)
      $scope.guide.skillbuilds = res.data.skillbuild
    })
  })

  $scope.hoverOverAbility = null;

  $scope.showSkills = false;
  $scope.showSkillBuild = false;
  $scope.showPlaystyle = false;
  $scope.showItemization = false;
  $scope.showDrafting = false;
  $scope.showAnalysis = false;
  $scope.showMatches = false;



  $scope.showAbility = function (ab) {
    $scope.hoverOverAbility = ab;
  }

  $scope.getMatches = function () {
    $http.get('https://api.opendota.com/api/players/' + $scope.playerID + '/matches?hero_id=' + $scope.heroid).then(function (res) {
      parseMatches(res.data, function (result) {
        $scope.matches = result;
      })
    })
  }

  parseMatches = function (matches, callback) {
    out = [];
    $scope.wonMatches = 0;
    $scope.lostMatches = 0;
    $scope.killsTotal = 0;
    $scope.deathsTotal = 0;
    $scope.assistsTotal = 0;

    matches.forEach(function (m) {
      parsed_data = {};
      if (m.player_slot > 100) {
        parsed_data.team = "dire";
      } else {
        parsed_data.team = "radiant";
      }

      if (m.player_slot > 100 && !m.radiant_win || m.player_slot < 100 && m.radiant_win) {
        parsed_data.won = true;
        $scope.wonMatches++;
      } else {
        parsed_data.won = false;
        $scope.lostMatches++;
      }

      if (m.lane_role == 5) {
        parsed_data.role = "Support";
      } else {
        parsed_data.role = "";
      }


      $scope.killsTotal += m.kills;
      $scope.deathsTotal += m.deaths;
      $scope.assistsTotal += m.assists;

      m.parsed = parsed_data;
      out.push(m);
    })
    var l = matches.length;
    $scope.killsAvg = Math.round($scope.killsTotal / l);
    $scope.deathsAvg = Math.round($scope.deathsTotal / l);
    $scope.assistsAvg = Math.round($scope.assistsTotal / l);
    $scope.winPercentage = ($scope.wonMatches / l * 100).toFixed(2);
    callback(out);
  }

  $scope.getSkillbuildSize = function (s){
    return new Array(s);
  }

  $scope.analyze = function () {

      var detailedMatches = [];

    getRecentGames = function (callback) {
    $scope.getMatches();


      var amountToParse = 20;
      var done = 0;

      if ($scope.matches.length < 20) {
        amountToParse = $scope.matches.length;
      }

      for (var i = 0; i < amountToParse; i++) {
            $http.get('https://api.opendota.com/api/matches/' + $scope.matches[i].match_id).then (function(res) {
              detailedMatches.push(res.data);
              done++;
              if (done >= amountToParse) {
                callback(detailedMatches)
              }
            })
      }

    }

    analyzeWards = function () {
      var dewarded = 0;
      var total = 0;
     for (var i = 0; i < detailedMatches.length; i++) {

       for (var j = 0; j < detailedMatches[i].players.length; j++) {

         if (detailedMatches[i].players[j].hero_id == $scope.heroid) {
           obsplaced = detailedMatches[i].players[j].obs_log;
           obsremoved = detailedMatches[i].players[j].obs_left_log;

           for (var y = 0; y < obsplaced.length; y++) {
             var rm = ""
              for (var x = 0; x < obsremoved.length; x++) {
                if (obsremoved[x].ehandle == obsplaced[y].ehandle) {
                   rm = obsremoved[x];

                }
              }
              if (rm  != "") {
                duration = rm.time - obsplaced[y].time;
                //console.log(duration);
                total++;
                if (duration < 360) {
                  //dewarded
                  dewarded++;
                  console.log("dewarded")
                }
              }
           }

         }
       }
     }
     console.log((dewarded / total) * 100) //gets the dewarded %
    }

    getRecentGames(function (res) {
      analyzeWards();
    });

  }



});
