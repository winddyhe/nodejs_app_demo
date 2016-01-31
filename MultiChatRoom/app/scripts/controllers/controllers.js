angular.module('ChatRoomApp', []);

angular.module('ChatRoomApp').factory('socket', function ($rootScope) {
    var socket = io();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback)
                        callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            // console.log(eventName + ',' + data + ', ' + callback);
            socket.emit(eventName, data, function () {
                console.log(eventName + ',' + data + ', ' + callback);
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback)
                        callback.apply(socket, args);
                });
            });
        }
    };
});

angular.module('ChatRoomApp').controller('RoomController', function ($scope, socket) {
    $scope.messages = [];
    socket.on('messages.read', function (messages) {
        $scope.messages = messages;
    });
    socket.on('messages.add', function (message) {
        console.log("receive message: " + message);
        $scope.messages.push(message);
    });
    console.log($scope.messages);
    socket.emit('messages.read');
});

angular.module('ChatRoomApp').controller('MessageCreatorController', function ($scope, socket) {
    $scope.createMessage = function () {
        if ($scope.newMessage === '') {
            return;
        }
        console.log($scope.newMessage);
        socket.emit('messages.create', $scope.newMessage);
        $scope.newMessage = '';
    }
});

angular.module('ChatRoomApp').directive('autoScrollToBottom', function () {
    return {
        link: function (scope, element, attrs) {
            scope.$watch(
                function () {
                    return element.children().length;
                },
                function () {
                    $(element).animate({
                        scrollTop: element.prop('scrollHeight')
                    }, 1000);
                }
                );
        }
    };
});

angular.module('ChatRoomApp').directive('ctrlEnterBreakLine', function () {
    return function (scope, element, attrs) {
        var ctrlDown = false;
        element.bind('keydown', function (evt) {
            if (evt.which === 17) {
                ctrlDown = true;
                setTimeout(function () {
                    ctrlDown = false;
                }, 1000);
            }
            if (evt.which === 13) {
                if (ctrlDown) {
                    element.val(element.val() + '\n');
                }
                else {
                    scope.$apply(function () {
                        scope.$eval(attrs.ctrlEnterBreakLine);
                    });
                    evt.preventDefault();
                }
            }
        });
    };
});