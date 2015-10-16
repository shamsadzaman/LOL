angular.module('leagueApp', []);
angular.module('leagueApp').config(['$controllerProvider', function ($controllerProvider) {
  $controllerProvider.allowGlobals();
}]);

function LeagueController($scope, $http) {
  //TODO: need to figure out a way to put API key in separate file
  const riotKey = "fa6d99e6-e8f6-4e16-b01a-9cf10755f296";
  const apiKey = "api_key=" + riotKey;
  const apiCallGetRecentMatches = "https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/39226674/recent";

  $scope.numberOfApiCall = 0;
  
  $scope.search = function () {
    $scope.errorMessage = "Loading...";
    if ($scope.summonerName.length > 0) {
      $scope.summonerName = $scope.summonerName.toLowerCase();
      getSummoner();
    }
  }

  $scope.calculateKDARatio = function (kill, death, assist) {
    var numKill = kill == undefined ? 0 : kill;
    var numAssist = assist == undefined ? 0 : assist;

    var numTakeDown = numKill + numAssist;

    if ((death == 0 || death == undefined) && numTakeDown == 0)
      return "N/A";

    if (death == 0 || death == undefined)
      return "Perfect";

    var kdaRatio = (numKill + numAssist) / death;

    return kdaRatio;
  }

  $scope.showKDA = function (kill, death, assist) {
    var numKill = kill == undefined ? 0 : kill;
    var numDeath = death == undefined ? 0 : death;
    var numAssist = assist == undefined ? 0 : assist;

    return numKill + "/" + numDeath + "/" + numAssist;
  }

  $scope.getKDAStyle = function (kdaRatio) {
    if (kdaRatio == "Perfect") {
      return "isPerfect";
    }

    kdaRatio = parseInt(kdaRatio);

    if (kdaRatio >= 0 && kdaRatio < 1)
      return "kda_0to1";

    if (kdaRatio >= 1 && kdaRatio < 2)
      return "kda_1to2";

    if (kdaRatio >= 2 && kdaRatio < 3)
      return "kda_2to3";

    if (kdaRatio >= 3 && kdaRatio < 5)
      return "kda_3to5";

    if (kdaRatio >= 5 && kdaRatio < 7)
      return "kda_5to7";

    if (kdaRatio >= 7)
      return "kda_7up";

  }

  function getRecentMatches() {
    var apiUrl = buildGetRecentMatchesByIdUrl();

    $http.get(apiUrl).then(function (response) {
      $scope.recentMatches = response;
    }, errorCallBack)
  }

  function getSummoner() {
    var apiUrl = buildGetSummonerByNameUrl();
    $http.get(apiUrl)
      .then(function (response) {
        $scope.errorMessage = "";
        $scope.numberOfApiCall++;
        $scope.summoner = response;
        getRecentMatches();
      }, errorCallBack)
  }

  function errorCallBack(response) {
    switch (response.status) {
      case 400:
        $scope.errorMessage = "Bad Request";
        break;
      case 401:
        $scope.errorMessage = "Unauthorized";
        break;
      case 404:
        $scope.errorMessage = "No data found";
        break;
      case 429:
        $scope.errorMessage = "Rate Limit Exceeded";
        break;
      case 500:
        $scope.errorMessage = "Internal Server Error";
        break;
      case 503:
        $scope.errorMessage = "Service Unavailable";
        break;
      default:
        $scope.errorMessage = "Something went wrong";
    }
  }

  function buildGetSummonerByNameUrl() {
    const apiCallGetSummonerByName = "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/";
    var apiUrl = apiCallGetSummonerByName + $scope.summonerName + "?" + apiKey;
    return apiUrl;
  }

  function buildGetRecentMatchesByIdUrl() {
    var apiCallGetRecentMatchesById = "https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/" + $scope.summoner.data[$scope.summonerName].id + "/recent";
    var apiUrl = apiCallGetRecentMatchesById + "?" + apiKey;

    return apiUrl;
  }

  function getRecentMatchesMockUp() {
    $scope.recentMatches = {
      data: {
        games: [
          {
            gameMode: "classic",
            gameType: "MATCHED_GAME",
            stats: {
              championsKilled: 3,
              numDeaths: 4,
              assists: 0,
              minionsKilled: 200,
              totalDamageDealthToChampions: 10000,
              goldEarned: 2703,
              win: false
            },
            ipEarned: 270
          },
          {
            gameMode: "CLASSIC",
            gameType: "MATCHED_GAME",
            stats: {
              championsKilled: 1,
              numDeaths: 1,
              assists: 0,
              minionsKilled: 200,
              totalDamageDealthToChampions: 10000,
              goldEarned: 2703,
              win: true
            },
            ipEarned: 270
          },
          {
            gameMode: "ARAM",
            gameType: "MATCHED_GAME",
            stats: {
              championsKilled: 2,
              numDeaths: 1,
              assists: 0,
              minionsKilled: 200,
              totalDamageDealthToChampions: 10000,
              goldEarned: 2703,
              win: false
            },
            ipEarned: 270
          },
          {
            gameMode: "classic",
            gameType: "MATCHED_GAME",
            stats: {
              championsKilled: 3,
              numDeaths: 1,
              assists: 0,
              minionsKilled: 200,
              totalDamageDealthToChampions: 10000,
              goldEarned: 2703,
              win: false
            },
            ipEarned: 270
          },
          {
            gameMode: "classic",
            gameType: "MATCHED_GAME",
            stats: {
              championsKilled: 4,
              numDeaths: 1,
              assists: 0,
              minionsKilled: 200,
              totalDamageDealthToChampions: 10000,
              goldEarned: 2703,
              win: false
            },
            ipEarned: 270
          },
          {
            gameMode: "classic",
            gameType: "MATCHED_GAME",
            stats: {
              championsKilled: 5,
              numDeaths: 1,
              assists: 0,
              minionsKilled: 200,
              totalDamageDealthToChampions: 10000,
              goldEarned: 2703,
              win: true
            },
            ipEarned: 270
          },
          {
            gameMode: "classic",
            gameType: "MATCHED_GAME",
            stats: {
              championsKilled: 6,
              numDeaths: 1,
              assists: 0,
              minionsKilled: 200,
              totalDamageDealthToChampions: 10000,
              goldEarned: 2703,
              win: true
            },
            ipEarned: 270
          },
          {
            gameMode: "classic",
            gameType: "MATCHED_GAME",
            stats: {
              championsKilled: 7,
              numDeaths: 1,
              assists: 0,
              minionsKilled: 200,
              totalDamageDealthToChampions: 10000,
              goldEarned: 2703,
              win: true
            },
            ipEarned: 270
          },
          {
            gameMode: "classic",
            gameType: "MATCHED_GAME",
            stats: {
              championsKilled: 8,
              numDeaths: 1,
              assists: 0,
              minionsKilled: 200,
              totalDamageDealthToChampions: 10000,
              goldEarned: 2703,
              win: false
            },
            ipEarned: 270
          },
          {
            gameMode: "classic",
            gameType: "MATCHED_GAME",
            stats: {
              championsKilled: 4,
              numDeaths: 0,
              assists: 10,
              minionsKilled: 200,
              totalDamageDealthToChampions: 10000,
              goldEarned: 2703,
              win: false
            },
            ipEarned: 270
          },
          {
            gameMode: "classic",
            gameType: "MATCHED_GAME",
            stats: {
              championsKilled: 5,
              numDeaths: 1,
              assists: 0,
              minionsKilled: 200,
              totalDamageDealthToChampions: 10000,
              goldEarned: 2703,
              win: false
            },
            ipEarned: 270
          }
        ]
      }
    }
  }
}
