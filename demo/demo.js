angular.module('app', ['ngBootstrap5'])

    .controller('MainController', ['$scope', '$bs5Modal', function($scope,  $bs5Modal) {
        $scope.faker = faker;
        $scope.collapse = new (function() {
            this.collapsed = false;
            this.horziontal = false;
            this.toggle = function()  {
                this.collapsed = !this.collapsed;
            }
        })();

    }]);


