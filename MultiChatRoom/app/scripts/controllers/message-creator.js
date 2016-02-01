angular.module('ChatRoomApp').controller('MessageCreatorController', function ($scope, socket) {
    $scope.createMessage = function () {
        if ($scope.newMessage === '') {
            return;
        }
        socket.emit('messages.create', $scope.newMessage);
        $scope.newMessage = '';
    }
});