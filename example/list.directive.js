(function () {
    'use strict';
    angular.module('tw.repositories.example')
        .directive('twList', twList);

    function twList() {
        var directive = {
            restrict: 'E',
            controller: controller,
            templateUrl: 'list.html',
            scope: {}
        };
        controller.$inject = ['$scope', 'twRepositories'];

        function controller($scope, twRepositories) {
            $scope.items = [];
            var itemRepository = twRepositories.get('items');

            itemRepository.observeList(function (data) {
                $scope.items = data;
            });
        }

        return directive;
    }
})();