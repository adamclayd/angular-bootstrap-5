/**
 * @ngdoc module
 * @name bs5#alert
 * @description
 * Bootstrap 5 Alert Module
 */
angular.module('bs5.alert', [])

    /**
     * @ngdoc directive
     * @name bs5Alert
     * @module bs5.alert
     *
     * @restrict E
     *
     * @requires $timeout
     *
     * @param {string} [type='light']
     * The bootstrap alert type
     *
     * Possible Values         'primary' | 'secondary' | 'success' | 'danger'
     *                         'warning' | 'info' | `light' | 'dark'
     *
     *
     * @param  {number} [timeout]
     * If this is set then the alert will close after so many milliseconds
     *
     * @param {boolean} [dismissible]
     * If true a close button is added to the alert
     *
     * @description
     * ### Bootstrap 5 Alert Box
     *
     * #### How To Use
     <example name="alert" module="alert">
         <file name="index.html">
             <bs5-alert type="success" dismissible="true">
                 Success!!!
             </bs5-alert>
             <script>
                 angular.module('alert', ['ngBootstrap5']);
             </script>
         </file>
     </example>
     */
    .directive('bs5Alert', ['$timeout', function($timeout) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'templates/bs5/alert/alert.html',
            scope: {
                type: '@?',
                dismissible: '=?',
                timeout: '=?',
                onDestroy: '&?'
            },
            link: function (scope, elm) {
                let destroyed = false;

                let timeout = null;

                scope.type = scope.type || 'light';

                scope.close = function () {
                    if(!destroyed) {
                        if(timeout)
                            $timeout.cancel(timeout);

                        elm.remove();
                        scope.$destroy();
                        destroyed = true;
                    }
                }

                if(angular.isNumber(scope.timeout))
                    timeout = $timeout(scope.close, scope.timeout, false);
            }
        };
    }]);