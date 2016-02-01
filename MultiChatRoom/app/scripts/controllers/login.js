angular.module('ChatRoomApp').controller('LoginController', function ($scope, $http, $location) {
    $scope.login = function () {
        $http({
            url: '/api/login',
            method: 'POST',
            data: { email: $scope.email }
        }).success(function (user) {
            $scope.$emit('login', user);
            $location.path('/');
            console.log('login.............');
        }).error(function (data) {
            $location.path('/login');
        });
    }
});