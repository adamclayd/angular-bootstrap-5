/**
 * Module: bs5.rating
 */
angular.module('bs5.rating', [])

    /**
     * Directive: bs5Rating
     *
     * A rating widget that allows a user to rate something by clicking on the star rating. It uses icons by default. So you can
     * change the color or font size of it by adding css to the element that this directive is applied. You can also change the
     * icons by setting the state-on-icon and state-off-icon attributes which default to `bi bi-star-fill` and `bi bi-star`
     *
     * IMPORTANT:
     * 		Bootstrap Icons stylesheet is required with the default template and the default state on and off icons
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
     *
     *      state-on-icon:       <string>       the class of the icon that you want to use for when a rating is marked. {default: 'bi bi-star-fill'}
     *
     *      state-off-icon:      <string>       the class of the icon that you want to use for when a rating is unmarked. {default: 'bi bi-star'}
     *
     * Using A Custom Template:
     *      If you want to use images for your icons you have to make your own template template. You can have a class for
     *      the attributes `state-on-icon` and `state-off-icon` that have the `content: url(/path/to/state-on-or-off-image)`
     *      for the css of the images and interpolate it in the class attribute of the images.
     *
     *          Example:
     *              <style>
     *                  .stateOn {
     *                      content: url(/path/to/state-on-image);
     *                      width: 24px;
     *                      height: 24px;
     *                  }
     *
     *                  .stateOff {
     *                      content: url(/path/to/state-off-image);
     *                      width: 24px;
     *                      height: 24px;
     *                  }
     *              </style>
     *              <script type="text/ng-template" id="rating-template.html">
     *                  <img class="{{$index < value ? 'stateOn' : 'stateOff'}} ng-repeat="r in range" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" ng-mouseleave="leave()">
     *              </script>
     *              <div ng-controller="MainController">
     *                  <span bs5-rating templateUrl="rating-template.html" ng-model="model.rating"></span>
     *              </div>
     *
     *
     *      Or you can interpolate in the src attribute with the path to state on and off images.
     *
     *          Example:
     *              <script type="text/ng-template" id="rating-template.html">
     *                  <img src="{{$index < value ? '/path/to/state-on-image' : '/path/to/state-off-image'}} style="width: 24px; height: 24px;" ng-repeat="r in range" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" ng-mouseleave="leave()">
     *              </script>
     *              <div ng-controller="MainController">
     *                  <span bs5-rating templateUrl="rating-template.html" ng-model="model.rating"></span>
     *              </div>
     */
    .directive('bs5Rating', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                readonly: '=?',
                onRatingChange: '&?'
            },
            templateUrl: function(elm, attrs) {
                return attrs.templateurl || 'angular/bootstrap5/templates/rating/rating.html'
            },
            link: function(scope, elm, attrs, ctrl) {

                let max = scope.$eval(attrs.number) || 5;
                let enableReset = angular.isDefined(attrs.enableReset) ? scope.$eval(attrs.enableReset) : true;

                if(ctrl.$modelValue > max) {
                    ctrl.$setViewValue(max);
                    scope.value = max;
                }
                else {
                    scope.value = ctrl.$modelValue;
                }

                scope.stateOnIcon = attrs.stateOnIcon || 'bi bi-star-fill';
                scope.stateOffIcon = attrs.stateOffIcon || 'bi bi-star';

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
    .run(['$templateCache', function($templateCache) {
        $templateCache.put(
            'angular/bootstrap5/templates/rating/rating.html',
            '<i class="{{$index < value ? stateOnIcon : stateOffIcon}}" ng-repeat="r in range" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" ng-mouseleave="leave()"></i>'
        );
    }]);