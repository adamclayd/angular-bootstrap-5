/**
 * Module: bs5.alert
 */
angular.module('bs5.alert', [])

    /**
     * Directive: bs5Alert
     *
     * Attriutes:
     *
     * 		type:         <'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'>     the bootstrap alert type {default: 'light'}
     *
     * 		dismissible: <boolean>                                                                                     if true a close button is added to the alert
     */
    .directive('bs5Alert', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: function(elm, attrs) {
                return attrs.templateUrl || 'angular/bootstrap5/templates/alert/alert.html'
            },
            scope: {
                type: '@?',
                dismissible: '=?'
            },
            link: function(scope, elm) {
                scope.type = scope.type || 'light';
                scope.close = function() {
                    elm.remove();
                    scope.$destroy();
                }
            }
        };
    })

    .run(['$templateCache', function($templateCache) {
        $templateCache.put(
            'angular/bootstrap5/templates/alert/alert.html',
            '<div class="alert alert-{{type}} alert-dismissible d-flex align-items-center" role="alert">' +
            '<ng-transclude></ng-transclude>' +
            '<button ng-if="dismissible" ng-click="close()" type="button" class="btn-close"></button>' +
            '</div>'
        );
    }]);