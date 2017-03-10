(function () {
    'use strict';
    angular
        .module('tw.repositories', ['rx'])
        .service('twRepositories', service);

    service.$inject = ['rx'];

    function service(rx) {
        /* jshint validthis:true */
        var self = this;
        var repositories = [];

        self.get = get;

        function get(repositoryName, keyField) {
            var result;

            angular.forEach(repositories, function (repository) {
                if (repository.name === repositoryName) {
                    result = repository;
                    return;
                }
            });

            if (!result) {
                result = new Repository(repositoryName, keyField, rx);
                repositories.push(result);
            }

            return result;
        }
    }

    function Repository(name, keyField, rx) {
        var self = this;
        self.data = [];
        self.name = name;
        self.keyField = keyField || 'id';

        self.listObservable = rx.Observable.create(
            function subscribe(observer) {
                observer.next(angular.copy(self.data));
            }
        );
        self.subject = new rx.Subject();
        self.multicasted = self.listObservable.multicast(self.subject);

        self.add = add;
        self.addList = addList;
        self.addOrUpdate = addOrUpdate;
        self.clear = clear;
        self.find = find;
        self.observeList = observeList;
        self.remove = remove;
        self.update = update;

        /**
         * clear this repository
         */
        function clear() {
            self.data = [];
            notifyListUpdated();
        }

        /**
         * notify the repository is updated
         */
        function notifyListUpdated() {
            self.subject.onNext(angular.copy(self.data));
        }

        /**
         * find item by key value   
         * @param {*} keyValue the key value of the item which is looking for
         */
        function find(keyValue) {
            var result;

            angular.forEach(self.data, function (item) {
                if (item[self.keyField] === keyValue) {
                    result = angular.copy(item);
                    return;
                }
            });

            return result;
        }

        /**
         * observe this repository
         * @param {*} observer 
         */
        function observeList(observer) {
            self.multicasted.subscribe(observer);
            self.multicasted.connect();
        }

        /**
         * add the item to the repository
         * @param {*} newItem 
         */
        function add(newItem) {
            validateItem(newItem);
            var existed = false;
            angular.forEach(self.data, function (item) {
                if (item[self.keyField] === newItem[self.keyField]) {
                    existed = true;
                    return;
                }
            });

            if (existed) {
                throw 'Entity with \'' + self.keyField + '\': ' + newItem[self.keyField] + ' already existed.';
            } else {
                self.data.push(angular.copy(newItem));
            }

            notifyListUpdated();
        }

        /**
         * update the item in the repository
         * @param {*} newItem 
         */
        function update(newItem) {
            validateItem(newItem);
            var existed = false;
            angular.forEach(self.data, function (item, $index) {
                if (item[self.keyField] === newItem[self.keyField]) {
                    existed = true;
                    self.data.splice($index, 1, angular.copy(newItem));
                    notifyListUpdated();
                    return;
                }
            });

            if (!existed) {
                throw 'Entity with \'' + self.keyField + '\': ' + newItem[self.keyField] + ' not existed.';
            }
        }

        /**
         * add or update the item in the repository
         * @param {*} newItem 
         */
        function addOrUpdate(newItem) {
            validateItem(newItem);
            var existed = false;
            angular.forEach(self.data, function (item, $index) {
                if (item[self.keyField] === newItem[self.keyField]) {
                    existed = true;
                    self.data.splice($index, 1, angular.copy(newItem));
                    return;
                }
            });

            if (!existed) {
                self.data.push(angular.copy(newItem));
            }

            notifyListUpdated();
        }

        /**
         * add list to the repository
         * @param {*} newList 
         */
        function addList(newList) {
            angular.forEach(newList, function (newItem) {
                validateItem(newItem);
                var existed = false;
                angular.forEach(self.data, function (existedItem, $index) {
                    if (existedItem[self.keyField] === newItem[self.keyField]) {
                        existed = true;
                        self.data.splice($index, 1, angular.copy(newItem));
                        return;
                    }
                });

                if (!existed) {
                    self.data.push(angular.copy(newItem));
                }
            });
            notifyListUpdated();
        }

        /**
         * remove item from the repository
         * @param {*} keyValue 
         */
        function remove(keyValue) {
            angular.forEach(self.data, function (item, $index) {
                if (item[self.keyField] === keyValue) {
                    self.data.splice($index, 1);
                    notifyListUpdated();
                    return;
                }
            });
        }

        /**
         * validate item
         * @param {*} item 
         */
        function validateItem(item) {
            if (!item[self.keyField]) {
                throw 'Entity is not valid.';
            }
        }
    }
})();