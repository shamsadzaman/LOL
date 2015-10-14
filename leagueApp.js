angular.module('leagueApp', []);
//angular.module('leagueApp').constant('riotKey', 'fa6d99e6-e8f6-4e16-b01a-9cf10755f296');

angular.module('leagueApp').config(['$controllerProvider', function($controllerProvider) {
  $controllerProvider.allowGlobals();
}]);

function LeagueController($scope, $http,riotKey) {
  //const riotKey = "fa6d99e6-e8f6-4e16-b01a-9cf10755f296";
  const apiKey = "api_key=" + riotKey;
  const apiCallGetRecentMatches = "https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/39226674/recent";

  $scope.numberOfApiCall = 0;

  $scope.search = function() {
    $scope.errorMessage = "Loading...";
    if ($scope.summonerName.length > 0) {
      $scope.summonerName = $scope.summonerName.toLowerCase();
      getSummoner();
    }
  }

  $scope.calculateKDARatio = function(kill, death, assist){
    numKill = kill == undefined ? 0 : kill;
    numAssist = assist == undefined ? 0 : assist;

    numTakeDown = numKill + numAssist;

    if((death == 0 || death == undefined) && numTakeDown == 0)
      return "N/A";

    if(death == 0 || death == undefined)
      return "Perfect";

    var kdaRatio = (numKill + numAssist) / death;

    return kdaRatio;
  }

  $scope.showKDA = function(kill, death, assist){
    numKill = kill == undefined ? 0 : kill;
    numDeath = death == undefined ? 0 : death;
    numAssist = assist == undefined ? 0 : assist;

    return numKill + "/" + numDeath + "/" + numAssist;
  }

  function getRecentMatches() {
    var apiUrl = buildGetRecentMatchesByIdUrl();

    $http.get(apiUrl).then(function(response) {
      $scope.recentMatches = response;
    }, errorCallBack)
  }

  function getSummoner() {
    var apiUrl = buildGetSummonerByNameUrl();
    $http.get(apiUrl)
    .then(function(response) {
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
    apiUrl = apiCallGetSummonerByName + $scope.summonerName + "?" + apiKey;
    return apiUrl;
  }

  function buildGetRecentMatchesByIdUrl() {
    var apiCallGetRecentMatchesById = "https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/" + $scope.summoner.data[$scope.summonerName].id + "/recent";
    apiUrl = apiCallGetRecentMatchesById + "?" + apiKey;

    return apiUrl;
  }
}
