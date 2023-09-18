/**
 * Module: bs5.rating
 */
angular.module('bs5.rating', [])

    /**
     * Directive: bs5Rating
     *
     * A rating widget that allows a user to rate something by clicking on the star rating
     *
     * IMPORTANT:
     * 		Bootstrap Icons stylesheet is required
     *
     * attributes:
     *  	readonly:            <boolean>       if true the user will not be able to modify the rating {default: false}
     *
     *  	number:			     <number>        the number of starts in the rating {default: 5}
     *
     *  	enable-reset:	     <boolean>       if true the user will be able to click the current value and reset the rating
     *  	            	                     back to 0 {default: true}
     *
     *  	on-rating-change:    <expression>    the event handler to call when the rating is changed. $rating which is the
     *                                           value of the rating is provided to the expression
     */
    .directive('bs5Rating', function() {
        return {
            restrict: 'A',
            require: ['?^^form', 'ngModel'],
            scope: {
                readonly: '=?',
                onRatingChange: '&?'
            },
            templateUrl: function(elm, attrs) {
                return attrs.templateurl || 'angular/bootstrap5/templates/rating/rating.html'
            },
            link: function(scope, elm, attrs, ctrls) {
                let form = ctrls[0];
                let ctrl = ctrls[1];

                let max = scope.$eval(attrs.number) || 5;
                let enableReset = angular.isDefined(attrs.enableReset) ? scope.$eval(attrs.enableReset) : true;

                if(ctrl.$modelValue > max) {
                    ctrl.$setViewValue(max);
                    scope.value = max;
                }
                else {
                    scope.value = ctrl.$modelValue;
                }

                scope.stateOnIcon = attrs.stateOnIcon || 'bi-star-fill';
                scope.stateOffIcon = attrs.stateOffIcon || 'bi-star';

                scope.range = [];

                for(let i = 0; i < max; i++)
                    scope.range.push(i);

                scope.enter = function(value) {
                    if(!scope.readonly)
                        scope.value = value;
                }

                scope.leave = function() {
                    if(!scope.readonly)
                        scope.value = ctrl.$modelValue;
                }

                scope.rate = function(value) {
                    if(!scope.readonly) {
                        if(ctrl.$modelValue === value && enableReset) {
                            scope.value = 0;
                            ctrl.$setViewValue(0);
                            scope.onRatingChange({$rating: 0})

                        }
                        else {
                            scope.value = value;
                            ctrl.$setViewValue(value);
                            scope.onRatingChange({$rating: value})
                        }
                    }
                }

            }
        };
    })


    /**
     * Rating Template
     */
    .run(['$templateCache', function($templateCache) {
        $templateCache.put(
            'angular/bootstrap5/templates/rating/rating.html',
            '<i class="bi {{$index < value ? stateOnIcon : stateOffIcon}}" ng-class="{\'bs5-pointer\': !readonly}" ng-repeat="r in range" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" ng-mouseleave="leave()"></i>'
        );
    }]);