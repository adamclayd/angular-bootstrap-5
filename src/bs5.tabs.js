/**
 * Module: bs5.tabs
 */
angular.module('bs5.tabs', ['bs5.dom'])

    /**
     * Controller: Bs5TabsetController
     */
    .controller('Bs5TabsetController', ['$scope', function($scope) {
        let ctrl = this;

        ctrl.tabs = [];

        /**
         * Adds a tab to the tabset
         * @param tab {Object} the tab to add's scope
         */
        ctrl.addTab = function(tab) {
            ctrl.tabs.push(tab);
        }


        /**
         * Remove a tab from the tabset
         * @param tab {Object} the tab to remove's scope
         */
        ctrl.removeTab = function(tab) {
            let index = ctrl.findTabIndex(tab);

            if(index !== null) {
                ctrl.tabs.splice(index, 1);
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

        let destroyed = false;
        $scope.$on('$destroy', function() {
            destroyed = true;
        });
    }])

    /**
     * Directive: bs5Tabset
     *
     * Attributes:
     * 		type:           <'pills' | 'tabs' | 'underline'>  the bootstrap nav-type. only applies when placement is 'top' defaults to 'tabs'
     *
     * 	    justified:      <boolean>                         if true the row that te tabs are in will be filled tabs that have the same width. (only applies when
     * 	                                                      placement is set to 'top' or 'bottom');
     *
     * 	    fill:           <boolean>                         if true the row that the tabs are on will be filled by the tabs (only applies if placement is set to 'top'
     * 	                                                      or 'bottom'
     *
     *		placement:     <'top' | 'left' | 'right'>        where the tabs are to be placed (note: if set to 'left' or 'right' then type will be set to 'pills'
     */
    .directive('bs5Tabset', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            controller: 'Bs5TabsetController',
            controllerAs: 'tabset',
            templateUrl: function(elm, attrs) {
                return (attrs.vertical === 'true' ? 'angular/bootstrap5/templates/tabs/tabset-vertical.html' : 'angular/bootstrap5/templates/tabs/tabset-horizontal.html');
            },
            link: function(scope, elm, attrs) {
                scope.type = /^(pills|tabs|underline)$/.test(attrs.type) ? attrs.type : 'tabs';
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
    .directive('bs5Tab', ['$parse', '$timeout', '$bs5DOM', function($parse,$timeout, $bs5DOM) {
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
                return $parse(elm.parent().attr('vertical'))() ? 'angular/bootstrap5/templates/tabs/tab-vertical.html' : 'angular/bootstrap5/templates/tabs/tab-horizontal.html';
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
                let index = null;

                $timeout(function() {
                    let children = elm.parent().children();

                    let i;
                    for(i = 0; i < children.length; i++) {
                        if(children[i] === elm[0])
                            break;
                    }

                    tabPane = angular.element(elm.parent().parent()[0].querySelectorAll('.tab-pane')[tpIndex]);
                    scope.index = index = i;

                    if(i === 0 && !ctrl.tabs.find(x => x.active)) {
                        if(tabPane.hasClass('fade'))
                            tabPane.addClass('show');

                        tabPane.addClass('active');
                        scope.active = true;
                    }
                });

                scope.select = function(evt) {
                    if(!scope.disabled && !tabPane.hasClass('active') && !scope.active) {
                        let atIndex = null;
                        let atp = null;
                        let tps = elm.parent().parent()[0].querySelectorAll('.tab-pane');
                        for (let i = 0; i < tps.length; i++) {
                            let el = angular.element(tps[i]);
                            if(el.hasClass('active')) {
                                atIndex = i;
                                atp = el;
                                break;
                            }
                        }

                        scope.onDeselect({$tabIndex: atIndex, $event: evt});
                        ctrl.tabs[atIndex].active = false;
                        scope.active = true;
                        $bs5DOM.fade(atp).then(function() {
                            atp.removeClass('active');
                            tabPane.addClass('active');
                            scope.onSelect({$tabIndex: index, $event: evt});
                            $bs5DOM.fade(tabPane);
                        });
                    }
                };

                scope.$transcludeFn = transclude;

                ctrl.addTab(scope);

                let tpIndex = ctrl.tabs.length - 1;

                scope.$on('$destroy', function() {
                    ctrl.removeTab(scope);

                    if(scope.active) {
                        scope.active = false;
                        let i = index === ctrl.tabs.length ? ctrl.tabs.length - 1 : index;
                        let tab = ctrl.tabs.find(x => x.index === i);
                        let tpIndex = ctrl.findTabIndex(tab);
                        let tp = angular.element(elm.parent().parent()[0].querySelector('.tab-pane:nth-child(' + (tpIndex + 1) + ')'));

                        elm.remove();
                        tabPane.remove();

                        tab.active = true;
                        tp.addClass('active');
                        $bs5DOM.fade(tp);
                    }
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

    .run(['$templateCache', function($templateCache) {
        $templateCache.put(
            'angular/bootstrap5/templates/tabs/tabset-horizontal.html',
            '<div class="bs5-tabset-horizontal">' +
                '<nav class="nav nav-{{type}} mb-2" ng-class="{\'nav-justified\': justified, \'nav-fill\': fill}" ng-transclude></nav>' +
                '<div class="tab-content">' +
                    '<div class="tab-pane fade" ng-repeat="tab in tabset.tabs" bs5-tab-content-transclude="tab"></div>' +
                '</div>' +
            '</div>'
        );


        $templateCache.put(
            'angular/bootstrap5/templates/tabs/tabset-vertical.html',
            '<div class="d-flex align-items-start bs5-tabset-vertical">' +
                '<div class="nav flex-column nav-pills me-3" ng-transclude></div>' +
                '<div class="tab-content">' +
                    '<div class="tab-pane fade" ng-repeat="tab in tabset.tabs" bs5-tab-content-transclude="tab"></div>' +
                '</div>' +
            '</div>'
        );

        $templateCache.put(
            'angular/bootstrap5/templates/tabs/tab-vertical.html',
            '<button class="nav-link bs5-tab text-start" ng-class="{active: active, disabled: disabled}" ng-disabled="disabled" ng-click="select($event)" bs5-tab-heading-transclude>{{heading}}</button>'
        );

        $templateCache.put(
            'angular/bootstrap5/templates/tabs/tab-horizontal.html',
            '<a class="nav-link bs5-tab" href ng-class="{active: active, disabled: disabled}" ng-disabled="disabled" ng-click="select($event)" bs5-tab-heading-transclude>{{heading}}</a>'
        );
    }]);