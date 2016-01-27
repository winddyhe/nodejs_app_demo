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

rAppModule.controller('PlayerController', ['$scope', function($scope){ 
    $scope.player = {};
    $scope.player.playing = false;
    $scope.player.audio = document.createElement('audio');
    $scope.player.audio.src = '/media/1.aac'
    
    $scope.player.play = function()
    {
      $scope.player.audio.play();
      $scope.player.playing = true;  
    };
    
    $scope.player.stop = function()
    {
        $scope.player.audio.pause();
        $scope.player.playing = false;
    };
    
    $scope.player.audio.addEventListener('ended', function()
    {
       $scope.$apply(function(){
           $scope.player.stop();
       });
    });
}]);

rAppModule.controller('RelatedController', ['$scope', function($scope){
    
}]);


var apiKey = 'MDIyMzY1NDg5MDE0NTM5MTQ4NzhjNjhlMw000',
    nprUrl = 'http://api.npr.org/query?id=61&fields=relatedLink,title,byline,text,audio,image,pullQuote,all&output=JSON';

rAppModule.controller('DataBindController', function($scope, $http)
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
    
    $scope.GetAllArticles = function()
    {
        $scope.audio = document.createElement('audio');;
        
        $scope.audio.src = 'http://pd.npr.org/npr-mp4/npr/sf/2013/07/20130726_sf_05.mp4?orgId=1&topicId=1032&ft=3&f=61';
        $scope.audio.play();
    
        $http({
            method: 'JSONP',
            url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
        }).success(function (data, status) {
            $scope.programs = data.list.story;
        }).error(function (data, status, header, config) {
            
        });
    }
    
    $scope.ClearAllArticles = function()
    {
        $scope.programs = null;
        $scope.audio.pause();
    }
});

rAppModule.directive('nprLink', function(){
    return {
        restrict:'EA',
        require:['^ngModel'],
        replace:true,
        scope:{
            ngModel: '=',
            play: '&',
        },
        templateUrl:'/views/tpl/nprListItem.html',
        link: function(scope, ele, attr){
            scope.duration = scope.ngModel.audio[0].duration.$text;
        }
    }
});