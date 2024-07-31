/**
 * @ngdoc module
 * @name bs5#rating
 */
angular.module('bs5.rating', ['bs5.icons'])

    /**
     * @ngdoc directive
     * @name bs5Rating
     * @module bs5.rating
     *
     * @param {boolean} [readonly=false]
     * If true the user will not be able to modify the rating {default: false}
     *
     * @param {boolean} [disabled=false]
     * Disables or enables the element
     *
     * @param {boolean} [trail=true]
     * if true then all the ratings up to the rating that the user is hovered over will
     * be marked as the user hovers over them. {default: true}
     *
     * @param {number} [number=5]
     * The number of ratings to have
     *
     * @param  {boolean} [enableReset=true]
     * if true the user will be able to click the current value and reset the rating
     * back to its initial value {default: true}
     *
     * @param {string} [stateOn='star-fill']
     * Tho bootstrap 5 icon for the marked ratings. Refer to <a href="https://icons.getbootstrap.com/">Bootstrap Icons</a>
     * for a list of icons
     *
     * @param {string} [stateOff='star']
     * The bootstrap 5 icon for the unmarked rating. Refer to <a href="https://icons.getbootstrap.com/">Bootstrap Icons</a>
     * for a list of icons
     *
     * @param {number} [size]
     * The size in pixels of the ratings markers.
     *
     * @param {string} [name]
     * The name of the form control.
     *
     * @param {string} [color='goldenrod']
     * Any css color value. a color name, a hex value, an rgb value , an rgba value, or a gradient value.
     * You can also set it your self with the style attribute
     *
     * @description
     * A rating component that allows a user to rate something by clicking on the rating marker.
     */
    .directive('bs5Rating', ['$log', function ($log) {
        return {
            restrict: 'EA',
            require: ['?^^form', 'ngModel'],
            scope: {
                readonly: '=?',
                disabled: '=?',
                trail: '=?',
                size: '=?',
                ngModel: '=',
                stateOn: '@?',
                stateOff: '@?'
            },
            templateUrl: 'templates/bs5/rating/rating.html',
            link: function (scope, elm, attrs, ctrls) {
                scope.trail = angular.isDefined(scope.trail) ? scope.trail : true;
                let max = scope.$eval(attrs.number) || 5;
                let enableReset = angular.isDefined(attrs.enableReset) ? scope.$eval(attrs.enableReset) : true;

                let ctrl = ctrls[1];
                let form = ctrls[0];

                ctrl.$name = attrs.name;

                if(!attrs.color)
                    attrs.

                scope.ngModel = !angular.isNumber(scope.ngModel) && scope.ngModel >= 0 ? 0 : scope.ngModel;
                scope.value = scope.ngModel = Math.round(scope.ngModel);

                if (form)
                    form.$addControl(ctrl);

                if(angular.isDefined(attrs.required) || angular.isDefined(attrs.ngRequired)) {
                    ctrl.$validators.required = function(modelValue, viewValue) {
                        return angular.isNumber(modelValue) && modelValue > 0;
                    }
                }

                scope.stateOff = scope.stateOff || 'star';
                scope.stateOn = scope.stateOn || 'star-fill';

                if (scope.ngModel > max) {
                    scope.ngModel = max;
                    scope.value = max;
                }

                scope.range = [];

                for (let i = 0; i < max; i++)
                    scope.range.push(i);

                scope.enter = function (value) {
                    if (!scope.readonly && !scope.disabled && scope.trail)
                        scope.value = value;
                };

                scope.leave = function () {
                    if (!scope.readonly && !scope.disabled && scope.trail)
                        scope.value = scope.ngModel;
                };

                scope.rate = function (val) {
                    if (!scope.readonly && !scope.disabled) {
                        if (scope.ngModel === val && enableReset) {
                            scope.value = scope.ngModel = 0;
                        } else {
                            scope.value = scope.ngModel = val;
                        }
                    }
                };

                attrs.$observe('color', function(color) {
                    if(color)
                        elm[0].style.color = color;
                    else
                        elm[0].style.color = null;
                });
            }
        };
    }])

    .directive('bs5RatingPartial', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                useImages: '=',
                stateOn: '@',
                stateOff: '@',
                value: '=',
                size: '='
            },
            templateUrl: 'templates/bs5/rating/rating-partial.html',
            link: function (scope, elm, attrs) {
                $timeout(function() {
                    scope.value = ((Math.round(scope.value * 10) / 10) - Math.floor(scope.value)) * (elm[0].offsetWidth - 4);
                }, 200);
            }
        };
    }]);