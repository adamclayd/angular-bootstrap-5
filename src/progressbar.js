
angular.module('bs5.progressbar', [])

    /**
     * @ngdoc directive
     * @name bs5Progressbar
     * @restrict E
     * @description
     * Bootstraps Progress Bar
     *
     * @param {number} value
     * The progress value between 0 and 100
     *
     * @param {boolean} displayPercent
     * If true the percentage will be displayed in the progressbar
     *
     * @param {boolean} stripped
     * Put stripes on progress bar
     *
     * @param {string }bgType
     * The background type for the progress. Possible values are 'primary', 'secondary', 'success',  'info', 'warning' ,
     * 'danger', 'light', 'dark', 'black', 'white', 'body', 'body-secondary', '.bg-body-tertiary', 'primary-subtle', 'secondary-subtle',
     * 'success-subtle', 'info-subtle', 'warning-subtle', 'light-subtle', 'dark-subtle', or 'gradient'
     *
     * @param {boolean} animate
     * If true the stripes will be animated
     */
    .directive('bs5Progressbar', [function ($bs5DOM) {

        return {
            restrict: 'E',
            replace: false,
            scope: {
                value: '=',
                bgType: '@',
                stripes: '=',
                displayPercent: '=',
                animate: '=',
            },
            templateUrl: 'templates/bs5/progressbar/progressbar.html',
            link: function (scope, elm, attrs) {

                scope.$watch('value', function (val) {
                    if (val < 0)
                        scope.value = 0;
                    else if (val > 100)
                        scope.value = 100;
                });
            }
        }
    }]);