/**
 * @ngdoc module
 * @name bs5.tabs
 */
angular.module('bs5.tabs', ['bs5.dom'])

    .controller('Bs5TabsetController', ['$scope', function($scope) {
        var ctrl = this;
        var ndx = null;
        ctrl.tabs = [];

        ctrl.select = function(index, evt) {
            if(evt && evt.target.tagName.toLowerCase() === 'a')
                evt.preventDefault();

            if(!destroyed) {
                if(angular.isNumber(ndx) && ctrl.tabs[ndx]) {
                    ctrl.tabs[ndx].onDeselect({$event: evt});
                    ctrl.tabs[ndx].active = false;
                }

                ndx = ctrl.active = index;

                if(angular.isNumber(index) && ctrl.tabs[index]) {
                    ctrl.tabs[index].onSelect({$event: evt});
                    ctrl.tabs[index].active = true;
                }
            }
        };

        ctrl.addTab = function(tab) {
            ctrl.tabs.push(tab);

            var index = ctrl.findTabIndex(tab);

            if(!angular.isNumber(ctrl.active)) {
                ctrl.select(0);
            }
        };

        ctrl.removeTab = function(tab) {
            var index = ctrl.findTabIndex(tab);

            if(index !== null) {
                ctrl.tabs.splice(index, 1);

                if(index === ctrl.active) {
                    var newIndex = ctrl.active === ctrl.tabs.length ? ctrl.active - 1 : (ctrl.active + 1) % ctrl.tabs.length;
                    ndx = ctrl.active = null;
                    ctrl.select(newIndex);
                }
            }
        };

        ctrl.findTabIndex = function(tab) {
            var index = null;
            for(var i = 0; i < ctrl.tabs.length; i++) {
                if(ctrl.tabs[i] === tab) {
                    index = i;
                    break;
                }
            }

            return index;
        }

        $scope.$watch('tabset.active', function(val, old) {
            if(val !== old)
                ctrl.select(val);
        });

        var destroyed = false;
        $scope.$on('$destroy', function() {
            destroyed = true;
        });
    }])

    /**
     * @ngdoc directive
     * @name bs5Tabset
     * @module bs5.tabs
     *
     * @param {string} [type='tabs']
     * The bootstrap nav-type. This only applies when `vertical` set to true.
     *
     * Possible Values:         'tabs', 'underline', pills'
     *
     * @param {boolean} [justified=false]
     * If true the row that te tabs are in will be filled tabs that have the same width.
     *
     * @param {boolean} [fill=false]
     * If true the row that the tabs are on will be filled by the tabs.
     */
    .directive('bs5Tabset', ['$animate', '$bs5DOM', '$timeout', function($animate, $bs5DOM, $timeout) {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            controller: 'Bs5TabsetController',
            controllerAs: 'tabset',
            scope: {
                type: '@?',
                justified: '=?',
                fill: '=?'
            },
            templateUrl: 'templates/bs5/tabs/tabset.html',
            link: function(scope, elm, attrs) {
                scope.type = /^(pills|tabs|underline)$/.test(scope.type) ? scope.type : 'tabs';
                scope.justified = typeof scope.justified === 'boolean' ? scope.justified : false;
                scope.fill = typeof scope.fill === 'boolean' ? scope.fill : false;

                $timeout(function() {
                    let first = angular.element(elm[0].querySelector('.tab-pane:first-child'));
                    first.addClass('active show');
                }, 0, false);

                scope.$watch('tabset.active', function($new, $old) {
                   if(!angular.equals($new, $old) && angular.isDefined($old)) {
                      let current = angular.element(elm[0].querySelector('.tab-pane.active'));
                      if(current.length) {
                          let active = angular.element(elm[0].querySelector('.tab-pane:nth-child(' + ($new + 1) + ')'));

                          $bs5DOM.fade(current, function() {
                              current.removeClass('active');
                              active.addClass('active');
                              $bs5DOM.fade(active);
                          });
                      }
                   }
                });
            }
        }
    }])

    /**
     * @ngdoc directive
     * @name bs5Tab
     * @module bs5.tabs
     *
     *
     * @param {string} [heading]
     * sets the tab header text
     *
     * @param {expression} [tab-select]
     * the event handler for when the tab is selected. $tabIndex and $event can be applied to the expression
     *
     * @param {expression} [tab-deselect]
     * the event handler for when the tab is deselected. $tabIndex and $event can be applied to the expression
     *
     * @description
     * The directive that goes inside the bs5Tabset element. This is where you put a tab heading and tab content
     *
     *
     * Tab Headings:
     * 		You can use the heading attribute to set the text of the tab header. If you do you are limited to text. If you want to have html in the tab header you will have to
     * 		use the `bs5-tab-heading` tag within the `bs5-tab` tag,
     *
     * 		Example:
     *
     *      ```html
     * 		<bs5-tab>
     * 		    <bs5-tab-heading><img src="tab-header.png"></bs5-tab-heading>
     *          <!-- Tab Content -->
     *      </bs5-tab>
     * 		```
     */
    .directive('bs5Tab', ['$parse', '$timeout', '$bs5DOM', function($parse,$timeout, $bs5DOM) {
        return {
            require: '^bs5Tabset',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {
                heading: '@',
                onSelect: '&select',
                onDeselect: '&deselect'
            },
            templateUrl: 'templates/bs5/tabs/tab.html',
            controller: function() {},
            controllerAs: 'tab',
            link: function(scope, elm, attrs, ctrl, transclude) {
                scope.disabled = false;
                if(attrs.disable) {
                    scope.$parent.$watch($parse(attrs.disable), function(value) {
                        scope.disabled = !!value;
                    });
                }

                scope.select = function(evt) {
                    if(!scope.disabled) {
                        ctrl.select(ctrl.findTabIndex(scope), evt);
                    }
                };

                scope.$transcludeFn = transclude;
                ctrl.addTab(scope);

                scope.$on('$destroy', function() {
                    ctrl.removeTab(scope);
                });
            }
        };
    }])


    .directive('bs5TabHeadingTransclude', function() {
        return {
            restrict: 'A',
            require: '^bs5Tab',
            link: function(scope, elm) {
                scope.$watch('headingElement', function updateHeadingElement(heading) {
                    if(heading) {
                        elm.html('');
                        elm.append(heading);
                    }
                });
            }
        };
    })

    .directive('bs5TabContentTransclude', function() {
        return {
            restrict: 'A',
            require: '^bs5Tabset',
            link: function(scope, elm, attrs) {
                function isTabHeading(node) {
                    return node.tagName && (
                        node.hasAttribute('bs5-tab-heading') ||
                        node.hasAttribute('data-bs5-tab-heading') ||
                        node.hasAttribute('x-bs5-tab-heading') ||
                        node.tagName.toLowerCase() === 'bs5-tab-heading' ||
                        node.tagName.toLowerCase() === 'data-bs5-tab-heading' ||
                        node.tagName.toLowerCase() === 'x-bs5-tab-heading' ||
                        node.tagName.toLowerCase() === 'bs5:tab-heading'
                    );
                }

                let tab = scope.$eval(attrs.bs5TabContentTransclude);

                tab.$transcludeFn(tab.$parent, function(contents) {
                    angular.forEach(contents, function(node) {
                        if(isTabHeading(node)) {
                            tab.headingElement = node;
                        }
                        else {
                            elm.append(node);
                        }
                    });
                });
            }
        }
    })