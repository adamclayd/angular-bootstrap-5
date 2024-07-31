/**
 * @ngdoc module
 * @name bs5.collapse
 */
angular.module('bs5.collapse', [])

    /**
     * @ngdoc diretive
     * @name bs5Collapse
     * @module bs5.collapse
     *
     * @param {boolean} bs5Collapse
     * Whether to collapse or expand the element. If true the element will be collapsed, If false the element will be expanded
     *
     * @param {boolean} [horizontal=false]
     * if true then the expanding and collapsing animations will be horizontal {default: false}
     *
     * @param {expression} [onExpand]
     * The function that is called before expanding the element.
     *
     * @param {expression} [onCollapse]
     * The function that is called before colapsing the element.
     *
     * @param {expression} [onExpanded]
     * The function that is called after exxpanding the element.
     *
     * @param {expression} [onCollapsed]
     * The function that is called after colapsing the element.
     *
     * @description
     * This directive will make an elemnt collapsable.
     *
     <example name="collapse" module="collapse">
        <file name="index.html">
            <div class="row" ng-controller="CollapseController">
                <div class="col">
                    <h5 class="mb-5">Vertical</h5>
                    <button class="btn btn-primary" ng-click="vcollapsed = !vcollapsed">Toggle</button>
                    <div bs5-collapse="vcollapsed">
                        <div style="background-color: #d5d5d5; height: 300px"></div>
                    </div>
                </div>
                <div class="col">
                    <h5 class="mb-5">Horizontal</h5>
                    <button class="btn btn-primary" ng-click="hcollapsed = !hcollapsed">Toggle</button>
                    <div bs5-collapse="hcollapsed" horizontal="true">
                        <div style="background-color: #d5d5d5; height: 300px"></div>
                    </div>
                </div>
            </div>
        </file>
        <file name="script.js">
            angular.module('collapse', ['ngBootstrap5'])
                .controller('CollapseController', ['$scope', function($scope) {
                    $scope.hcollapsed = false;
                    $scope.vcollapse = false;
                }]);
        </file>
     </example>
     */
    .directive('bs5Collapse', ['$timeout', '$animate', function ($timeout, $animate) {
        return {
            restrict: 'A',
            scope: {
                collapsed: '=bs5Collapse',
                onCollapsed: '&',
                onExpanded: '&',
                onExpand: '&',
                onCollapse: '&'
            },
            link: function (scope, elm, attrs) {
                elm.addClass('collapse');

                let horizontal = scope.$eval(attrs.horizontal);

                if (horizontal)
                    elm.addClass('collapse-horizontal');

                let width = null;
                let height = null;

                elm.addClass('show');
                $timeout(function () {
                    width = elm[0].offsetWidth;
                    height = elm[0].offsetHeight;

                    if (scope.collapsed)
                        elm.removeClass('show');
                }, 0, false);

                scope.$watch(function () {
                    return elm[0].offsetHeght;
                }, function (value) {
                    if (elm.hasClass('show') && !elm.hasClass('collapsing') && value !== height) {
                        height = value;
                    }
                });

                function animate(fn) {
                    if (horizontal) {
                        elm[0].style.height = height;
                        if (scope.collapsed) {
                            elm[0].style.width = width;
                            elm.addClass('collapsing show');
                            $timeout(function () {
                                elm[0].style.width = null;

                                let d = window.getComputedStyle(elm[0]).transitionDuration;
                                let duration = d.endsWith('ms') ? parseFloat(d.substring(0, d.length - 2)) : parseFloat(d.substring(0, d.length - 1)) * 1000;

                                $timeout(function () {
                                    elm.removeClass('collapsing show');
                                    elm[0].style.height = null;
                                    fn();
                                }, duration, false);
                            }, 0, false);
                        } else {
                            elm.addClass('collapsing show');
                            $timeout(function () {
                                elm[0].style.width = width;

                                let d = window.getComputedStyle(elm[0]).transitionDuration;
                                let duration = d.endsWith('ms') ? parseFloat(d.substring(0, d.length - 2)) : parseFloat(d.substring(0, d.length - 1)) * 1000;

                                $timeout(function () {
                                    elm.removeClass('collapsing');
                                    elm[0].style.width = null;
                                    elm[0].style.height = null;
                                    fn();
                                }, duration, false);
                            }, 0, false);
                        }
                    } else {
                        if (scope.collapsed) {
                            elm[0].style.height = height;
                            elm.addClass('collapsing show');
                            $timeout(function () {
                                elm[0].style.height = null;

                                let d = window.getComputedStyle(elm[0]).transitionDuration;
                                let duration = d.endsWith('ms') ? parseFloat(d.substring(0, d.length - 2)) : parseFloat(d.substring(0, d.length - 1)) * 1000;

                                $timeout(function () {
                                    elm.removeClass('collapsing show');
                                    fn();
                                }, duration, false);
                            }, 0, false);
                        } else {
                            elm.addClass('collapsing show');
                            $timeout(function () {
                                elm[0].style.height = height;

                                let d = window.getComputedStyle(elm[0]).transitionDuration;
                                let duration = d.endsWith('ms') ? parseFloat(d.substring(0, d.length - 2)) : parseFloat(d.substring(0, d.length - 1)) * 1000;

                                $timeout(function () {
                                    elm.removeClass('collapsing');
                                    elm[0].style.height = null;
                                    fn();
                                }, duration, false);
                            }, 0, false);
                        }
                    }
                }

                scope.$watch('collapsed', function ($new, $old) {
                    if (!angular.equals($new, $old)) {
                        if (!elm.hasClass('collapsing')) {
                            if ($new && angular.isDefined($old)) {
                                scope.onCollapse();
                                animate(scope.onCollapsed);
                            } else if (angular.isDefined($old)) {
                                scope.onExpand();
                                animate(scope.onExpanded);
                            }
                        }
                    }
                });
            }
        }
    }]);