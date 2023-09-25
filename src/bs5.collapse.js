/**
 * Module: bs5.collapse
 */
angular.module('bs5.collapse', ['bs5.dom'])

    /**
     * Directive: bs5Collapse
     *
     * Attributes:
     *      bs5-collapse:      <boolean>             indicates whether ts collapse or expand the element
     *
     *      horizontal:        <boolean>             if true then the expanding and collapsing animations will
     *                                               be horizontal {default: false}
     *
     *      on-expanded:       <expression>          the event handler that is fired after the collapsable has expanded
     *
     *      on-collapsed       <expression>          the event handler that is fired after the collapsable has collapsed
     *
     *      animation          <'roll' | 'slide'>    set to roll or slide animation
     */
    .directive('bs5Collapse', ['$timeout', '$q', function($timeout, $q) {
        return {
            restrict: 'A',
            scope: {
                collapsed: '=bs5Collapse',
                onCollapsed: '&',
                onExpanded: '&',
                horizontal: '=?',
            },
            link: function(scope, elm, attrs) {
                elm.addClass('collapse');

                let width = null;
                let height = null;

                elm.addClass('show');
                $timeout(function() {
                    width = elm[0].offsetWidth;
                    height = elm[0].offsetHeight;

                    if(scope.collapsed)
                        elm.removeClass('show');
                });

                scope.$watch('horizontal', function(horizontal) {
                    if(horizontal) {
                        elm.addClass('collapse-horizontal');
                    }
                    else {
                        elm.removeClass('collapse-horizontal');
                    }
                });

                scope.$watch(function() {
                    return elm[0].offsetHeight;
                }, function(value) {
                    if(elm.hasClass('show') && !elm.hasClass('collapsing') && value !== height) {
                        height = value;
                    }
                });

                function animate() {
                    return $q(function(res) {
                        new Promise(function (r) {
                            if (scope.horizontal) {
                                elm[0].style.height = height;
                                if (scope.collapsed) {
                                    elm[0].style.width = width;
                                    elm.addClass('collapsing show');
                                    setTimeout(function () {
                                        elm[0].style.width = null;

                                        setTimeout(function () {
                                            elm.removeClass('collapsing show');
                                            elm[0].style.height = null;
                                            r();
                                        }, 350);
                                    });
                                }
                                else {
                                    elm.addClass('collapsing show');
                                    setTimeout(function () {
                                        elm[0].style.width = width;

                                        setTimeout(function () {
                                            elm.removeClass('collapsing');
                                            elm.style.width = null;
                                            elm.style.height = null;
                                            r();
                                        }, 350);
                                    });
                                }
                            }
                            else {
                                if (scope.collapsed) {
                                    elm[0].style.height = height;
                                    elm.addClass('collapsing show');
                                    setTimeout(function () {
                                        elm[0].style.height = null;

                                        setTimeout(function () {
                                            elm.removeClass('collapsing show');
                                            r();
                                        }, 350);
                                    });
                                }
                                else {
                                    elm.addClass('collapsing show');
                                    setTimeout(function () {
                                        elm[0].style.height = height;

                                        setTimeout(function () {
                                            elm.removeClass('collapsing');
                                            elm[0].style.height = null;
                                            r();
                                        }, 350);
                                    });
                                }
                            }
                        }).then(res);
                    });
                };

                scope.$watch('collapsed', function($new, $old) {
                    if(!angular.equals($new, $old)) {
                        if ($new && angular.isDefined($old)) {
                            animate(true).then(scope.onCollapsed);
                        }
                        else if (angular.isDefined($old)) {
                            animate(false).then(scope.onExpanded);
                        }
                    }
                });
            }
        }
    }]);