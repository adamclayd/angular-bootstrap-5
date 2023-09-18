/**
 * Module: bs5.tabs
 *
 * Requires:
 *      ngAnimate
 */
angular.module('bs5.tabs', ['bs5.dom'])

    /**
     * Controller: Bs5TabsetController
     */
    .controller('Bs5TabsetController', ['$scope', function($scope) {
        let ctrl = this;
        let ndx = null;
        ctrl.tabs = [];

        /**
         * Selects the tab to open
         * @param index {number} the index of the tab to open
         * @param evt {MouseEvent}
         */
        ctrl.select = function(index, evt) {
            if(evt && evt.target.tagName.toLowerCase() === 'a')
                evt.preventDefault();

            if(!destroyed) {
                if(angular.isNumber(ndx) && ctrl.tabs[ndx]) {
                    ctrl.tabs[ndx].onDeselect({$tabIndex: index, $event: evt});
                    ctrl.tabs[ndx].active = false;
                }

                ndx = ctrl.active = index;

                if(angular.isNumber(index) && ctrl.tabs[index]) {
                    ctrl.tabs[index].onSelect({$tabIndex: index, $event: evt});
                    ctrl.tabs[index].active = true;
                }
            }
        };

        /**
         * Adds a tab to the tabset
         * @param tab {Object} the tab to add's scope
         */
        ctrl.addTab = function(tab) {
            ctrl.tabs.push(tab);

            let index = ctrl.findTabIndex(tab);

            if(!angular.isNumber(ctrl.active)) {
                ctrl.select(0);
            }
        }


        /**
         * Remove a tab from the tabset
         * @param tab {Object} the tab to remove's scope
         */
        ctrl.removeTab = function(tab) {
            let index = ctrl.findTabIndex(tab);

            if(index !== null) {
                ctrl.tabs.splice(index, 1);

                if(index === ctrl.active) {
                    let newIndex = ctrl.active === ctrl.tabs.length ? ctrl.active - 1 : (ctrl.active + 1) % ctrl.tabs.length;
                    ndx = ctrl.active = null;
                    ctrl.select(newIndex);
                }
            }
        }

        /**
         * Find the index of a tab
         * @param tab the tab to get the index of's scope
         * @return {number} the tabs index in the tabset
         */
        ctrl.findTabIndex = function(tab) {
            let index = null;
            for(let i = 0; i < ctrl.tabs.length; i++) {
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

        let destroyed = false;
        $scope.$on('$destroy', function() {
            destroyed = true;
        });
    }])

    /**
     * Directive: bs5Tabset
     *
     * Attributes:
     * 		type:           <'pills' | 'tabs' | 'underline'>           the bootstrap nav-type. defaults to 'tabs' unless the placement is 'bottom' then it defaults to 'pills'
     *
     * 	    justified:      <boolean>                                 if true the row that te tabs are in will be filled tabs that have the same width. (only applies when
     * 	                                                              placement is set to 'top' or 'bottom');
     *
     * 	    fill:           <boolean>                                if true the row that the tabs are on will be filled by the tabs (only applies if placement is set to 'top'
     * 	                                                             or 'bottom'
     *
     *		placement:     <'top' | 'left' | 'bottom' | 'right'>     where the tabs are to be placed (note: if set to 'left' or 'right' then type will be set to 'pills'
     */
    tabs.directive('bs5Tabset', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            controller: 'Bs5TabsetController',
            controllerAs: 'tabset',
            templateUrl: function(elm, attrs) {
                return (attrs.placement === 'left' ? 'angular/bootstrap5/templates/tabs/tabset-left.html' : (attrs.placement === 'right' ? 'angular/bootstrap5/templates/tabs/tabset-right.html' : (attrs.placement === 'bottom' ? 'angular/bootstrap5/templates/tabs/tabset-bottom.html' : 'angular/bootstrap5/templates/tabs/tabset-top.html')));
            },
            link: function(scope, elm, attrs) {
                scope.type = /^(pills|tabs|underline)$/.test(attrs.type) ? attrs.type : (attrs.placement !== 'bottom' ? 'tabs' : 'pills');
                scope.justified = scope.$eval(attrs.justified);
                scope.fill = scope.$eval(attrs.fill);
            }
        }
    })

    /**
     * Directive: bs5Tab
     *
     * Requires:
     * 		^bs5Tabset
     *
     * Attributes:
     *
     * 		heading:       <string>        sets the tab header text
     *
     *		tab-select:    <expression>    the event handler for when the tab is selected. $tabIndex and $event can be
     *	                                   applied to the expression
     *
     *      tab-deselect:  <expression>    the event handler for when the tab is deselected. $tabIndex and $event can be
     *                                     applied to the expression
     *
     *
     * Tab Headings:
     * 		You can use the heading attribute to set the text of the tab header. If you do you are limited to text. If you want to have html in the tab header you will have to
     * 		use the `bs5-tab-heading` tag within the `bs5-tab` tag,
     *
     * 		Example:
     * 			<bs5-tab>
     * 				<bs5-tab-heading><img src="tab-header.png"></bs5-tab-heading>
     * 				... Tab Content ...
     * 			</bs5-tab>
     */
    .directive('bs5Tab', ['$parse', '$bs5DOM', function($parse, $bs5DOM) {
        return {
            require: '^bs5Tabset',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {
                heading: '@',
                onSelect: '&tabSelect',
                onDeselect: '&tabDeselect'
            },
            templateUrl: function(elm, attrs) {
                return !(/^(bottom|top)$/.test(elm.parent().attr('placement'))) ? 'angular/bootstrap5/templates/tabs/tab-vertical.html' : 'angular/bootstrap5/templates/tabs/tab.html';
            },
            controller: function() {},
            controllerAs: 'tab',
            link: function(scope, elm, attrs, ctrl, transclude) {
                scope.disabled = false;
                if(attrs.disable) {
                    scope.$parent.$watch($parse(attrs.disable), function(value) {
                        scope.disabled = !!value;
                    });
                }

                let tabPane = null;
                $timeout(function() {
                    let children = elm.parent().children();

                    let i;
                    for(i = 0; i < children.length; i++) {
                        if(children[i] === elm[0])
                            break;
                    }

                    tabPane = elm.parent().parent()[0].querySelectorAll('.tab-pane')[i];
                }, 500);

                scope.select = function(evt) {
                    if(!scope.disabled) {
                        ctrl.select(ctrl.findTabIndex(scope), evt);

                        $bs5DOM.fade(tabPane);
                    }
                }

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

    .animation('.bs5-tab-pane', ['$animateCss', function($animateCss) {
        return {
            addClass: function(elm, cls, done) {
                if(cls === 'active') {
                    $animateCss(elm, {
                        from: {
                            opacity: 0
                        },
                        to: {
                            opacity: 1
                        },
                        duration: 0.7
                    }).start().finally(done);
                }
            }
        };
    }])

    .run(['$templateCache', function($templateCache) {
        $templateCache.put(
            'angular/bootstrap5/templates/tabs/tabset-top.html',
            '<div class="bs5-tabset-top">' +
                '<nav class="nav nav-{{type}} mb-2" ng-class="{\'nav-justified\': justified, \'nav-fill\': fill}" ng-transclude></nav>' +
                '<div class="tab-content">' +
                    '<div class="tab-pane bs5-tab-pane" ng-repeat="tab in tabset.tabs" ng-class="{active: tabset.active === $index}" bs5-tab-content-transclude="tab"></div>' +
                '</div>' +
            '</div>'
        );

        $templateCache.put(
            'angular/bootstrap5/templates/tabs/tab.html',
            '<a href="#" class="nav-link bs5-tab" ng-class="{active: active, disabled: disabled}" ng-click="select($event)" bs5-tab-heading-transclude>{{heading}}</a>'
        );

        $templateCache.put(
            'angular/bootstrap5/templates/tabs/tabset-left.html',
            '<div class="align-items-start bs5-tabset-left">' +
                '<div class="nav flex-column nav-pills float-start me-3" ng-transclude></div>' +
                '<div class="tab-content">' +
                    '<div class="tab-pane bs5-tab-pane" ng-repeat="tab in tabset.tabs" ng-class="{active: tabset.active === $index}" bs5-tab-content-transclude="tab"></div>' +
                '</div>' +
            '</div>'
        );

        $templateCache.put(
            'angular/bootstrap5/templates/tabs/tab-vertical.html',
            '<button class="nav-link text-nowrap overflow-hidden bs5-tab" ng-class="{active: active, disabled: disabled}" ng-disabled="disabled" ng-click="select($event)" bs5-tab-heading-transclude>{{heading}}</button>'
        );

        $templateCache.put(
            'angular/bootstrap5/templates/tabs/tabset-right.html',
            '<div class="align-items-start bs5-tabset-right">' +
                '<div class="tab-content float-start">' +
                    '<div class="tab-pane bs5-tab-pane" ng-repeat="tab in tabset.tabs" ng-class="{active: tabset.active === $index}" bs5-tab-content-transclude="tab"></div>' +
                '</div>' +
                '<div class="nav flex-column nav-pills ms-3" ng-transclude></div>' +
            '</div>'
        );

        $templateCache.put(
            'angular/bootstrap5/templates/tabs/tabset-bottom.html',
            '<div class="bs5-tabset-bottom">' +
                '<div class="tab-content">' +
                    '<div class="tab-pane bs5-tab-pane" ng-repeat="tab in tabset.tabs" ng-class="{active: tabset.active === $index}" bs5-tab-content-transclude="tab"></div>' +
                '</div>' +
                '<nav class="nav nav-{{type}} mt-2" ng-class="{\'nav-justified\': justified, \'nav-fill\': fill}" ng-transclude></nav>' +
            '</div>'
        );
    }]);