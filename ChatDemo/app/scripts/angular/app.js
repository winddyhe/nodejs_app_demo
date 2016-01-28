var rAppModule = angular.module('AppModule1', []);

rAppModule.controller('UserController', function($scope){
    $scope.user = {};
    $scope.user.name = 'winddyhe';
    $scope.user.email = "hgplan@126.com";
    
    $scope.user.confirm = function()
    {
    }
    
    $scope.user.reset = function()
    {
        $scope.user.name = '';
    }
});

var apiKey = 'MDIyMzY1NDg5MDE0NTM5MTQ4NzhjNjhlMw000',
    nprUrl = 'http://api.npr.org/query?id=61&fields=relatedLink,title,byline,text,audio,image,pullQuote,all&output=JSON';
    
rAppModule.controller('PlayerController', ['$scope', 'nprService', 'player', function($scope, nprService, player){ 
    $scope.player = player;
       
    $scope.GetAllArticles = function()
    {
        $scope.player = player;
        nprService.programs(apiKey).success(function (data, status) {
            $scope.programs = data.list.story;
        });
    }
    
    $scope.ClearAllArticles = function()
    {
        $scope.programs = null;
    }
}]);

rAppModule.controller('RelatedController', ['$scope', 'player', function($scope, player){
    $scope.player = player;
    
    $scope.$watch('player.current', function(program){
       if (program){
          $scope.related = [];
          angular.forEach(program.relatedLink, function(link){
             $scope.related.push({
                 link: link.link[0].$text,
                 caption: link.caption.$text
             });
          });
       } 
    });
}]);

rAppModule.factory('audio', ['$document', function($document){
    var audio = $document[0].createElement('audio');
    return audio;
}]);

rAppModule.factory('player', ['audio', '$rootScope', function(audio, $rootScope){
    var player = {
        playing: false,
        current: null,
        progress:0,
        ready: false,
        
        play: function(program){
            if (player.playing) player.stop();
            var url = program.audio[0].format.mp4.$text; 
            player.current = program;
            audio.src = url;
            audio.play();
            player.playing = true;
        },
        stop: function(){
            if (player.playing) audio.pause();
            player.ready = player.playing = false;
            player.current = null;
        },
        currentTime: function() {
            return audio.currentTime;
        },
        currentDuration: function() {
            return audio.duration;
        }
    }

    audio.addEventListener('canplay', function (evt) {
        $rootScope.$apply(function () {
            player.ready = true;
        });
    });
    audio.addEventListener('timeupdate', function(evt){
       $rootScope.$apply(function(){
         player.progress = player.currentTime();
         player.progress_percent = player.progress / player.currentDuration();  
       });
    });
    audio.addEventListener('ended', function(){
       $rootScope.$apply(function(){ 
           player.stop();
       }); 
    });
    return player;
}]);

rAppModule.controller('DataBindController', ['$scope', function($scope)
{
    $scope.persion = { name: "Winddy He" };
    var updateClock = function()
    {
        $scope.clock = new Date();   
    };
    
    setInterval(function(){
        $scope.$apply(updateClock);
    }, 1000);
    
    updateClock();
    
    $scope.counter = 0;
    $scope.add = function(amount)
    {
        $scope.counter += amount;  
    };
    
    $scope.sub = function(amount)
    {
        $scope.counter -= amount;
    }
}]);

rAppModule.factory('nprService', ['$http', function($http) {
    var doRequest = function(apiKey) {
      return $http({
        method: 'JSONP',
        url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
      });
    }
 
    return {
      programs: function(apiKey) { return doRequest(apiKey); }
    };
}]);

rAppModule.directive('nprLink', function(){
    return {
        restrict:'EA',
        require:['^ngModel'],
        replace:true,
        scope:{
            ngModel: '=',
            player: '=',
        },
        templateUrl:'/views/tpl/nprListItem.html',
        link: function(scope, ele, attr){
            scope.duration = scope.ngModel.audio[0].duration.$text;
        }
    }
});

rAppModule.factory('githubService', ['$http', function($http)
{   
   var doRequest = function(username, path) {
       return $http({
           method: 'JSONP',
           url: 'https://api.github.com/users/' + username + '/' + path + '?callback=JSON_CALLBACK'
       });
   }
   
   return { events: function(username){ return doRequest(username, 'events'); }}; 
}]);

rAppModule.controller('ServiceController', ['$scope', '$timeout', 'githubService',
    function ($scope, $timeout, githubService) {
        var timeout;
        $scope.$watch('username', function (newUsername) {
            if (newUsername) {
                if (timeout) $timeout.cancel(timeout);
                timeout = $timeout(function () {
                    githubService.events(newUsername)
                    .success(function (data, status, headers) {
                        $scope.events = data.data;
                    });
                });
            }
        });
    }]);