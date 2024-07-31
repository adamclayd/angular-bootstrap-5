angular.module('bs5.icons', [])

    /**
     * @ngdoc directive
     * @name bs5-icon
     * @scope
     * @restrict E
     * @description
     * This directive will load a bootstrap icon.
     *
     * @param {string} icon
     * The icon you want to use. see https://icons.getbootstrap.com/ for a list of icons
     *
     * @param {number} [size]
     * The size of the icon
     *
     * @param {string} [color]
     * Set the color in the style attribute
     *
     <example module="icon">
        <file name="index.html">
            <div ng-controller="MainController">
                <div class="pb-2">
                    <bs5-icon icon="{{icon}}" ng-repeat="star in stars"></bs5-icon>
                </div>
                <div class="row">
                    <div class="col-12 col-md-5 col-lg-4">
                        <div class="row">
                            <div class="col-form-label col-form-label-sm">Select Icon Type</div>
                            <select class="form-control form-control-sm" ng-options="type in types" ng-model="icon"></select>
                        </div>
                    </div>
                </div>
            </div>
        </file>
        <file name="script.js">
            angular.module('icon', ['ngBootstrap5'])

                .controller('MainController', ['$scope', function ($scope) {
                    $scope.icon = 'star';

                    $scope.types = [
                        'star',
                        'star-fill',
                        '0-circle',
                        '0-circle-fill',
                        'apple'
                    ]
                }]);
        </file>
     </example>
     */
    .directive('bs5Icon', ['$http', '$cacheFactory', function($http, $cacheFactory) {
        return {
            restrict: 'E',
            scope: {
                size: '=?',
            },
            link: function(scope, elm, attrs) {
                let svg = null;
                let promise = null;

                let cache = $cacheFactory.get('icons') || $cacheFactory('icons');

                function load(icon) {
                    function doRemote() {
                        return $http({url: 'https://icons.getbootstrap.com/assets/icons/' + icon + '.svg'}).then(
                            function(res) {
                                if(svg)
                                    svg.remove();

                                svg = angular.element(res.data);
                                svg.css({
                                    width: scope.size + 'px',
                                    height: scope.size + 'px'
                                });

                                elm.append(svg);
                                cache.put(icon, res.data);
                            },
                            function() {
                                console.error("Icon '" + icon + "' does not exist");
                            }
                        );
                    }

                    if (svg)
                        svg.remove();

                    let html = cache.get(icon);
                    if (html) {
                        svg = angular.element(html);
                        svg.css({
                            width: scope.size + 'px',
                            height: scope.size + 'px'
                        });

                        elm.append(svg);
                    } else {
                        promise = promise ? promise.then(doRemote) : doRemote();
                    }
                };

                attrs.$observe('color', function(color) {
                    elm.css('color', color);
                });

                attrs.$observe('icon', function(icon) {
                    icon = icon.replace(/^(bi|bi-|bi bi-)/g, '');
                    load(icon);
                });

                scope.$watch('size', function($new, $old) {
                    if(!angular.equals($new, $old) && svg && angular.isNumber($new)) {
                        svg.css({
                            width: $new + 'px',
                            height: $new + 'px'
                        });
                    }
                });
            }
        };
    }])