(function () {
    'use strict';
    angular.module('tw.repositories.example', ['tw.repositories'])
        .controller('MainController', controller);

    controller.$inject = ['$scope', 'twRepositories'];

    function controller($scope, twRepositories) {
        $scope.items = [];
        $scope.selectItem = selectItem;
        $scope.addItem = addItem;
        $scope.update = update;
        $scope.remove = remove;
        $scope.clear = clear;

        var itemRepository;

        init();

        function clear() {
            itemRepository.clear();
        }

        function init() {
            itemRepository = twRepositories.get('items');
            itemRepository.observeList(function (data) {
                $scope.items = data;
            });
        }

        function selectItem(item) {
            $scope.item = angular.copy(item);
        }

        function addItem() {
            itemRepository.add($scope.item);
        }

        function update() {
            itemRepository.update($scope.item);
        }

        function remove(item) {
            itemRepository.remove(item.id);
        }

    }


})();