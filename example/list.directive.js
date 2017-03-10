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
            var reverse = false;
            $scope.sort = sort;

            var itemRepository = twRepositories.get('items');

            itemRepository.observeList(function (data) {
                $scope.items = data;
            });

            function sort(propertyName) {
                if (propertyName && propertyName === $scope.propertyName) {
                    reverse = !reverse;
                }

                $scope.propertyName = propertyName;

                itemRepository.sort(propertyName, reverse);
            }

        }

        return directive;
    }
})();