(function() {

    function ucFirst(string) {
        return string[0].toUpperCase() + string.slice(1);
    };

    let fake = [];

    fake.pagination = [];

    for(let i = 0; i < 200; i++) {
        let record = {};
        record.firstName = faker.name.firstName();
        record.lastName = faker.name.lastName();
        record.jobTitle = faker.name.jobTitle();
        record.address = faker.address.streetAddress(true);
        record.city = faker.address.city('{{record.firstname}}');
        record.state = faker.address.state(false);
        record.zip = faker.address.zipCode();
        fake.pagination.push(record);
    }


    angular.module('app', ['ngBootstrap5'])

        .controller('MainController', ['$scope', '$bs5Modal', '$log', '$timeout', '$sce', function ($scope, $bs5Modal, $log, $timeout, $sce) {
            $scope.collapse = new (function () {
                let self = this;
                this.v = {};
                this.v.collapsed = false;
                this.v.toggle = function () {
                    self.v.collapsed = !self.v.collapsed;
                }

                this.h = {};
                this.h.collapsed = false;
                this.h.toggle = function () {
                    self.h.collapsed = !self.h.collapsed;
                }
            })();

            $scope.$log = $log;

            $scope.progressbar = new (function() {
                let self = this;
                self.value = 0;
                this.run = function() {
                    self.value = self.value ? 0 : 100;
                };
            })();

            $scope.popover = new (function() {
                let self = this;

                self.model = {
                    name: null,
                    address1: null,
                    address2: null,
                    city: null,
                    state: null,
                    zip: null
                };

                self.handler = function(data) {
                    angular.extend(self.model, data);
                };
            })();

            $scope.modal = new (function () {
                let self = this;

                self.model = {
                    name: null,
                    address1: null,
                    address2: null,
                    city: null,
                    state: null,
                    zip: null
                };

                self.openModal = function() {
                    $bs5Modal({
                        scrollable: true,
                        centered: true,
                        size: 'lg',
                        templateUrl: 'modal-form.html',
                        controller: 'ModalController'
                    }).promise.then(function (data) {
                        angular.extend(self.model, data);
                    }, angular.noop);
                };

                self.openStack = function() {
                    $bs5Modal({
                        scrollable: true,
                        centered: true,
                        size: 'lg',
                        templateUrl: 'modal-stacked-1.html',
                        controller: 'ModalStack1Controller'
                    });
                };
            })();

            $scope.pager = new (function() {
                let data = fake.pagination;
                let self = this;
                this.page = 1;
                this.pageSize = 25;
                this.numItems = data.length;
                this.items = data.slice(0, this.pageSize);
                this.pageChange = function(page) {
                    self.page = page;
                    self.items = data.slice((self.page - 1) * self.pageSize, self.page * self.pageSize);
                };

            })();

            $scope.rating = new (function () {
                this.model = 3.5;
            })();

            $scope.autocomplete = new (function() {
                this.model = null;
            })();

            $scope.datepicker = new (function() {
                this.model = new Date();
            })();
        }])

        .controller('PopoverController', ['$scope', function($scope) {
            $scope.model = {
                name: null,
                address1: null,
                address2: null,
                city: null,
                state: null,
                zip: null
            };

            $scope.submit = function(form) {
                if(form.$valid) {
                    $scope.close($scope.model);
                }
            };
        }])

        .controller('ModalController', ['$scope', function ($scope) {
            $scope.model = {
                name: null,
                address1: null,
                address2: null,
                city: null,
                state: null,
                zip: null
            };

            $scope.submit = function(form) {
                if(form.$valid) {
                    $scope.close($scope.model);
                }
            };
        }])

        .controller('ModalStack1Controller', ['$scope', '$bs5Modal', function ($scope, $bs5Modal) {
            $scope.openModal = function() {
                $bs5Modal({
                    staticBackdrop: true,
                    scrollable: true,
                    centered: true,
                    size: 'lg',
                    templateUrl: 'modal-stacked-2.html',
                    controller: 'ModalStack2Controller'
                });
            }
        }])

    .controller('ModalStack2Controller', ['$scope', '$bs5Modal', function ($scope, $bs5Modal) {
        $scope.openModal = function() {
            $bs5Modal({
                scrollable: true,
                centered: true,
                size: 'lg',
                templateUrl: 'modal-stacked-3.html'
            });
        }
    }])
})();