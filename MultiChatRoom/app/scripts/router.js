
angular.module('ChatRoomApp').config(function($routeProvider, $locationProvider){
    $locationProvider.html5Mode(true);
    $routeProvider.
    when('/', {
        templateUrl: '/views/room.html',
        controller: 'RoomController'
    }).
    when('/login',{
        templateUrl: '/views/login.html',
        controller: 'LoginController'
    }).
    otherwise({
        redirectTo: '/login'
    });
});