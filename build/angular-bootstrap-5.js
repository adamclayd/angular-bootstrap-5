/*
 * angularjs-bootstrap-5
 *
 * Version: 2.0.0 - 2024-07-04
 * 
 * Author: Adam Davis
 * 
 */

/*
 * MIT License
 * 
 * Copyright (c) 2024 adamclayd
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

angular.module('ngBootstrap5', [
    'bs5.accordion',
    'bs5.alert',
    'bs5.autocomplete',
    'bs5.collapse',
    'bs5.dom',
    'bs5.icons',
    'bs5.modal',
    'bs5.pagination',
    'bs5.popover',
    'bs5.progressbar',
    'bs5.rating',
    'bs5.tabs',
    'bs5.tooltip']);


angular.module('bs5.accordion', ['bs5.dom'])

    .constant('bs5AccordionConfig', {
        closeOthers: true
    })

    .controller('Bs5AccordionController', ['$scope', '$attrs', 'bs5AccordionConfig', function($scope, $attrs, bs5AccordionConfig) {
        this.groups = [];
        let self = this;

        this.closeOthers = function (openGroup) {
            let closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : bs5AccordionConfig.closeOthers;
            if (closeOthers) {
                angular.forEach(self.groups, function (group) {
                    if (group !== openGroup)
                        group.isOpen = false;
                });
            }
        };

        this.addGroup = function (groupScope) {
            self.groups.push(groupScope);
            groupScope.$on('$destory', function (event) {
                self.removeGroup(groupScope);
            });
        };

        this.removeGroup = function (group) {
            let index = self.groups.indexOf(group);
            if (index >= 0)
                self.groups.splice(index, 1);
        };
    }])

    
    .directive('bs5Accordion', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: 'templates/bs5/accordion/accordion.html',
            controller: 'Bs5AccordionController',
            controllerAs: 'accordion'
        };
    })

    
    .directive('bs5AccordionGroup', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            require: '^bs5Accordion',
            templateUrl: 'templates/bs5/accordion/accordion-group.html',
            controller: function () {
                let self = this;
                this.setHeading = function (elm) {
                    self.heading = elm;
                };
            },
            scope: {
                heading: '@',
                isOpen: '=?',
                isDisabled: '=?'
            },
            link: function (scope, elm, attrs, accordionCtrl) {
                accordionCtrl.addGroup(scope);
                scope.$watch('isOpen', function (value) {
                    if (value)
                        accordionCtrl.closeOthers(scope);
                });
                scope.toggleOpen = function (event) {
                    if (!scope.isDisabled) {
                        if (!event || event.which === 32)
                            scope.isOpen = !scope.isOpen;
                    }
                }
            }
        }
    })

    .directive('bs5AccordionHeading', function() {
        return {
            require: '^bs5AccordionGroup',
            transclude: true,
            template: '',
            replace: true,
            link: function (scope, elm, attrs, accordionGroup, transclude) {
                accordionGroup.setHeading(transclude(scope, angular.noop));
            }
        }
    })

    .directive('bs5AccordionTransclude', function() {
        return {
            require: '^bs5AccordionGroup',
            link: function (scope, elm, attrs, accordionGroup) {
                scope.$watch(function () {
                    return accordionGroup[attrs.bs5AccordionTransclude];}, function (heading) {
                    if (heading) {
                        let elem = angular.element(elm[0].querySelector('bs5-accordion-header, data-bs5-accordion-header, [bs5-accordion-header], [data-bs5-accordion-header]'));
                        elem.html('');
                        elem.append(heading);
                    }
                });
            }
        }
    })

    .run(['$templateCache', function($templateCache) {
        $templateCache.put("templates/bs5/accordion/accordion-group.html",
            "<div class=\"accordion-item\">\n" +
            "    <h2 class=\"accordion-header\">\n" +
            "        <button type=\"button\" ng-click=\"toggleOpen()\" ng-class=\"{collapsed: !isOpen}\" class=\"accordion-button\" bs5-accordion-transclude=\"heading\"><span bs5-accordion-header>{{heading}}</span></button>\n" +
            "    </h2>\n" +
            "    <div class=\"accordion-collapse\" bs5-collapse=\"!isOpen\">\n" +
            "        <div class=\"accordion-body\">\n" +
            "            <ng-transclude></ng-transclude>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>"
        );

        $templateCache.put("templates/bs5/accordion/accordion.html",
            "<div class=\"accordion\">\n" +
            "    <ng-transclude></ng-transclude>\n" +
            "</div>"
        );
	}]);


angular.module('bs5.alert', [])

    
    .directive('bs5Alert', ['$timeout', function($timeout) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'templates/bs5/alert/alert.html',
            scope: {
                type: '@?',
                dismissible: '=?',
                timeout: '=?',
                onDestroy: '&?'
            },
            link: function (scope, elm) {
                let destroyed = false;

                let timeout = null;

                scope.type = scope.type || 'light';

                scope.close = function () {
                    if(!destroyed) {
                        if(timeout)
                            $timeout.cancel(timeout);

                        elm.remove();
                        scope.$destroy();
                        destroyed = true;
                    }
                }

                if(angular.isNumber(scope.timeout))
                    timeout = $timeout(scope.close, scope.timeout, false);
            }
        };
    }])

    .run(['$templateCache', function($templateCache) {
        $templateCache.put("templates/bs5/alert/alert.html",
            "<div class=\"alert alert-{{type}} alert-dismissible d-flex align-items-center\" role=\"alert\">\n" +
            "    <ng-transclude></ng-transclude>\n" +
            "    <button ng-if=\"dismissible\" ng-click=\"close()\" type=\"button\" class=\"btn-close\"></button>\n" +
            "</div>"
        );
	}]);


angular.module('bs5.autocomplete', ['bs5.dom'])

    
    .directive("bs5Autocomplete", ["$timeout", "$http", "$compile", function($timeout, $http, $compile) {
        return {
            restrict: "AC",
            require: 'ngModel',
            scope: {
                ngModel: "=",
                datasource: "=?",
                matches: '@?',
                remoteAddr: "@?",
                remoteAddrParams: "=?",
                remoteAddrMethod: "@?",
                minChars: '=?',
            },
            link: function (scope, elm, attrs, ctrl) {
                $timeout(function () {
                    if(elm[0].tagName !== 'INPUT' || elm[0].type !== 'text')
                        throw new Error("bs5Autocomplete directive can only be used in input tags");

                    scope.minChars = angular.isNumber(scope.minChars) ? scope.minChars : 2;
                    scope.modelCtrl = ctrl;
                    scope.remoteAddrParams = scope.remoteAddrParams || {};
                    scope.items = [];
                    scope.triggered = false;

                    let list = angular.element('<bs5-autocomplete-list ng-if="triggered" items="items" ng-model="ngModel" model-ctrl="modelCtrl"></bs5-autocomplete-list>');
                    elm.after(list);
                    $compile(list)(scope);

                    elm.on("input", function () {
                        scope.$apply(function () {
                            if (ctrl.$viewValue.length >= scope.minChars) {
                                if (scope.remoteAddr) {
                                    scope.remoteAddrMethod = scope.remoteAddrMethod || "GET";
                                    if (scope.remoteAddrMethod.toLowerCase() !== "get") {
                                        let params = {term: ctrl.$modelValue};
                                        if (angular.isObject(scope.remoteAddrParams))
                                            params = angular.extend({}, scope.remoteAddrParams, params);
                                        $http({
                                            url: scope.remoteAddr,
                                            method: scope.remoteAddrMethod,
                                            data: params,
                                            returnType: "json",
                                        }).then(function (r) {
                                            scope.items = r.data;
                                            scope.triggered = true;
                                        });
                                    } else {
                                        let url = scope.remoteAddr + "?term=" + ctrl.$viewValue;
                                        if (angular.isObject(scope.remoteAddrParams)) {
                                            for (let p in scope.remoteAddrParams)
                                                url += "&" + p + "=" + scope.remoteAddrParams[p];
                                        }
                                        $http({
                                            url: url,
                                            method: scope.remoteAddrMethod,
                                            returnType: "json",
                                        }).then(function (r) {
                                            scope.items = r.data;
                                            scope.triggered = true;
                                        });
                                    }
                                } else if (angular.isArray(scope.datasource)) {
                                    scope.matches = /^(start|end|middle)$/.test(scope.matches) ? scope.matches : 'start';

                                    scope.items = scope.datasource.filter(x => scope.matches === 'start' ? x.toLowerCase().startsWith(ctrl.$viewValue.toLowerCase()) : (scope.matches === 'end' ? x.toLowerCase().endsWith(ctrl.$viewValue.toLowerCase()) : x.toLowerCase().indexOf(ctrl.$viewValue.toLowerCase()) > -1)).sort();
                                    scope.triggered = true;
                                }
                            } else {
                                scope.items = [];
                            }
                        });
                    });

                    elm.on("blur", function () {
                        scope.$apply(function () {
                            scope.triggered = false;
                        });
                    });
                }, 250);
            }
        };
    }])


    .directive("bs5AutocompleteList", ["$document", "$timeout", "$bs5DOM", "$bs5Position", function($document, $timeout, $bs5DOM, $bs5Position) {
        return {
            restrict: "E",
            scope: {
                items: "=",
                modelCtrl: "="
            },
            templateUrl: 'templates/bs5/autocomplete/list.html',
            link: function (scope, elm, attrs, ctrl) {
                let input = $bs5DOM.prev(elm);

                let translator = $bs5Position.translateTarget(input, elm, 'bottom');

                elm.css({
                    width: input[0].offsetWidth,
                    transform: 'translate(' + translator.x + ', ' + translator.y + ')'
                });

                scope.highlighted = null;

                scope.highlight = function (index) {
                    scope.highlighted = index;
                };

                scope.unhighlight = function () {
                    scope.highlighted = null;
                };

                scope.selectItem = function () {
                    scope.modelCtrl.$setViewValue(scope.items[scope.highlighted]);
                    scope.modelCtrl.$commitViewValue();
                    scope.modelCtrl.$render();
                    scope.triggered = false;
                };

                let keydown = function (e) {
                    if (e.which === 38) {
                        scope.$apply(function() {
                            if (scope.highlighted && scope.highlighted > 0) {
                                scope.highlighted--;
                            }
                        });
                    } else if (e.which === 40) {
                        scope.$apply(function() {
                            if (scope.highlighted === null)
                                scope.highlighted = 0;

                            else if (scope.highlighted < scope.items.length - 1)
                                scope.highlighted++;
                        });
                    } else if (e.which === 13) {
                        scope.$apply(scope.selectItem);
                    }
                };

                input.on("keydown", keydown);
            }
        };
    }])

    .run(['$templateCache', function($templateCache) {
        $templateCache.put("templates/bs5/autocomplete/list.html",
            "<ul class=\"list-group\">\n" +
            "    <li class=\"list-group-item\" ng-repeat=\"item in items\" ng-mousedown=\"selectItem()\" ng-mouseenter=\"highlight($index)\" ng-class=\"{active: highlighted === $index}\" ng-mouseleave=\"uhighlight()\">\n" +
            "        {{item}}\n" +
            "    </li>\n" +
            "</ul>"
        );
	}]);


angular.module('bs5.collapse', [])

    
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


angular.module('bs5.dom', [])

    

    

    

    

    

    
    .service('$bs5Position', ['$bs5DOM', function ($bs5DOM) {
        let self = this;

        
        self.offset = function(elm) {
            elm = elm instanceof HTMLElement ? elm : elm[0];
            let rect =  elm.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft,
                width: elm.offsetWidth,
                height: elm.offsetHeight
            };
        };

        
        self.relativeOffset = function (elm) {
            elm = elm instanceof HTMLElement ? angular.element(elm) : elm;
            let relativeTo = $bs5DOM.findRelativeContainer(elm);

            let r = null;

            if (relativeTo) {
                let relOffset = self.offset(relativeTo);
                let elOffset = self.offset(elm);

                r = {
                    left: elOffset.left - relOffset.left,
                    top: elOffset.top - relOffset.top,
                    width: elm[0].offsetWidth,
                    height: elm[0].offsetHeight,
                    container: relativeTo
                };
            }

            return r;

        }

        
        self.positionTarget = function (hostElm, targetElm, placement, offset) {
            hostElm = hostElm instanceof HTMLElement ? angular.element(hostElm) : hostElm;
            targetElm = hostElm instanceof HTMLElement ? angular.element(targetElm) : targetElm;

            let host = this.offset(hostElm);
            let target = this.offset(targetElm);


            let left = host.left;
            let top = host.top;
            if (placement === 'top') {
                top = host.top - target.height;
            } else if (placement === 'left') {
                left = host.left - target.width
            } else if (placement === 'bottom') {
                top = host.top + host.height;
            } else if (placement === 'right') {
                left = host.left + host.width
            } else if (placement === 'top-left') {
                left = host.left - target.width;
                top = host.top - target.height;
            } else if (placement === 'top-right') {
                left = host.left + host.width;
                top = host.top - target.height;
            } else if (placement === 'bottom-left') {
                left = host.left - target.width;
                top = host.top + host.height;
            } else if (placement === 'bottom-right') {
                left = host.left + host.width;
                top = host.top + host.height;
            } else if (placement === 'top-center') {
                top = host.top - target.height;
                let diff = (host.width / 2) - (target.width / 2);
                left = host.left + diff;
            } else if (placement === 'left-center') {
                left = host.left - target.width;
                let diff = (host.height / 2) - (target.height / 2);
                top = host.top + diff;
            } else if (placement === 'bottom-center') {
                top = host.top + host.height;
                let diff = (host.width / 2) - (target.width / 2);
                left = host.left + diff;
            } else if (placement === 'right-center') {
                left = host.left + host.width;
                let diff = (host.height / 2) - (target.height / 2);
                top = host.top + diff;
            }
            else {
                console.error('$bs5Position.positionTarget: Invalid value for parameter placement');

                // return not moved
                left =  target.left;
                top = target.top;
            }

            if (!angular.isArray(offset) || offset.length < 2)
                offset = [0, 0];

            if (angular.isNumber(offset[0]))
                left += offset[0];

            if (angular.isNumber(offset[1]))
                top += offset[1];

            return {
                left: left,
                top: top
            };
        };

        
        self.positionTargetRelative = function (hostElm, targetElm, placement, offset) {
            hostElm = hostElm instanceof HTMLElement ? angular.element(hostElm) : hostElm;
            targetElm = hostElm instanceof HTMLElement ? angular.element(targetElm) : targetElm;

            let host = self.relativeOffset(hostElm);
            let target = this.relativeOffset(targetElm);

            let r = null;

            if(hostElm && targetElm && angular.equals(host.container[0], target.container[0])) {

                let left = host.left;
                let top = host.top;

                if (placement === 'right') {
                    left += host.width;
                } else if (placement === 'bottom') {
                    top += host.height;
                } else if (placement === 'left') {
                    left -= target.width;
                } else if (placement === 'top') {
                    top -= target.height;
                } else if (placement === 'top-left') {
                    top -= target.height;
                    left -= target.width;
                } else if (placement === 'top-right') {
                    top -= target.height;
                    left += host.width;
                } else if (placement === 'bottom-left') {
                    top += host.height;
                    left -= target.width;
                } else if (placement === 'bottom-right') {
                    top += host.height;
                    left += host.width;
                } else if (placement === 'top-center') {
                    top -= target.height;
                    let diff = (host.width / 2) - (target.width / 2);
                    left += diff;
                } else if (placement === 'bottom-center') {
                    top += host.height;
                    let diff = (host.width / 2) - (target.width / 2);
                    left += diff;
                } else if (placement === 'left-center') {
                    left -= target.width;
                    let diff = (host.height / 2) - (target.height / 2);
                    top += diff;
                } else if (placement === 'right-center') {
                    left += host.width;
                    let diff = (host.height / 2) - (target.height / 2);
                    top += diff;
                }

                left += angular.isArray(offset) && offset.length > 0 && angular.isNumber(offset[0]) ? offset[0] : 0;
                top += angular.isArray(offset) && offset.length > 1 && angular.isNumber(offset[1]) ? offset[1] : 0;


                r = {
                    top: top,
                    left: left,
                    bottom: top + target.height,
                    right: left + target.width
                };
            }

            return r;
        };

        
        self.translateTarget = function (hostElm, targetElm, placement, offset = [0, 0]) {
            hostElm = hostElm instanceof HTMLElement ? angular.element(hostElm) : hostElm;
            targetElm = hostElm instanceof HTMLElement ? angular.element(targetElm) : targetElm;

            let transform = window.getComputedStyle(targetElm[0]).transform;

            let host = self.offset(hostElm);
            let target = self.offset(targetElm);

            let strs = /^matrix\((\d+?\.?\d*?), (\d+?\.?\d*?), (\d+?\.?\d*?), (\d+?\.?\d*?), (\d+?\.?\d*?), (\d+?\.?\d*?)\)$/.exec(transform);
            let matrix = [];


            if(strs) {
                for(let i = 1; i < strs.length; i++) {
                    matrix.push(parsesFloat(strs[i], 10));
                }

                target.left -= matrix[4];
                target.top -= matrix[5];
            }




            let x = host.left - target.left;
            let y = host.top - target.top;

            let left = host.left;
            let top = host.top;

            if (placement === 'right') {
                x += host.width;
                left += host.width;
            } else if (placement === 'bottom') {
                y += host.height;
                top += host.height;
            } else if (placement === 'left') {
                x -= target.width;
                left -= target.width;
            } else if (placement === 'top') {
                y -= target.height;
                top -= target.height;
            } else if (placement === 'top-left') {
                y -= target.height;
                x -= target.width;

                top -= target.height;
                left -= target.width;
            } else if (placement === 'top-right') {
                y -= target.height;
                x += host.width;

                top -= target.height;
                left += host.width;
            } else if (placement === 'bottom-left') {
                y += host.height;
                x -= target.width;

                top += host.height;
                left -= target.width;
            } else if (placement === 'bottom-right') {
                y += host.height;
                x += host.width;

                top += host.height;
                left += host.width;
            } else if (placement === 'top-center') {
                let diff = (host.width / 2) - (target.width / 2);

                y -= target.height;
                x += diff;

                top -= target.height;
                left += diff;
            } else if (placement === 'bottom-center') {
                let diff = (host.width / 2) - (target.width / 2);

                y += host.height;
                x += diff;

                top += host.height;
                left += diff;
            } else if (placement === 'left-center') {
                let diff = (host.height / 2) - (target.height / 2);

                x -= target.width;
                y += diff;

                left -= target.width;
                top += diff;
            } else if (placement === 'right-center') {
                let diff = (host.height / 2) - (target.height / 2);

                x += host.width;
                y += diff;

                left += host.width;
                top += diff;
            }

            x += angular.isArray(offset) && angular.isNumber(offset[0]) ? offset[0] : 0;
            y += angular.isArray(offset) && angular.isNumber(offset[1]) ? offset[1] : 0;
            left += angular.isArray(offset) && angular.isNumber(offset[0]) ? offset[0] : 0;
            top += angular.isArray(offset) && angular.isNumber(offset[1]) ? offset[1] : 0;



            if(matrix.length === 6) {
                matrix[4] = x;
                matrix[5] = y;
            }

            return {
                x: x,
                y: y,
                left: left,
                top: top,
                matrix: matrix
            };
        }


        self.translateTooltip = function (host, tip, container, placement, fallbackPlacements = ['left', 'right', 'top', 'bottom'], offset = [0, 0]) {
            // set the arrow position
            function getArrowPos() {
                let plc = place === 'left' ? 'right' : (place === 'right' ? 'left' : (place === 'top' ? 'bottom' : 'top'));
                plc += '-center';
                let pos = self.translateTarget(tip, arrow, plc);

                // needed due to the fact that placementClass has not been applied to the tooltip
                if (isPopover) {
                    if (place === 'left' || place === 'right')
                        pos.y -= 5;
                } else {
                    if (place === 'left' || place === 'right') {
                        pos.y -= 3;
                    }
                }

                return pos;
            };

            // set the tooltip position
            function getTipPos() {
                const ttOff = 6;
                const tooltipOff = [place === 'left' ? -ttOff : (place === 'right' ? ttOff : 0), place === 'top' ? -ttOff : (place === 'bottom' ? ttOff : 0)];

                const poOff = 8;
                const popoverOff = [place === 'left' ? -poOff : (place === 'right' ? poOff : 0), place === 'top' ? -poOff : (place === 'bottom' ? poOff : 0)];

                let plc = place + '-center';

                return self.translateTarget(host, tip, plc, isPopover ? popoverOff : tooltipOff);

            };

            // get placement class to apply to the tooltip when applying the css to move it
            function getPlacementClass() {
                let lastPlcClass;

                if (place === 'left')
                    lastPlcClass = isPopover ? 'bs-popover-start' : 'bs-tooltip-start';

                else if (place === 'right')
                    lastPlcClass = isPopover ? 'bs-popover-end' : 'bs-tooltip-end';

                else if (place === 'top')
                    lastPlcClass = isPopover ? 'bs-popover-top' : 'bs-tooltip-top';

                else
                    lastPlcClass = isPopover ? 'bs-popover-bottom' : 'bs-tooltip-bottom';

                return lastPlcClass;
            };

            let coff = self.offset(container);

            // try to position the tooltip if the it is being placed on the top or bottom
            // so it may fit in the container
            function positionLeftRight() {
                if (tipPos.left < coff.left) {
                    if (tip[0].offsetWidth <= coff.width) {
                        let diff = coff.left - tipPos.left;
                        tipPos.x += diff;
                        arrowPos.x -= diff;

                        tipPos.left += diff;
                        arrowPos.left -= diff;
                    }
                }
                // if tipPos.right > coff.right
                else if (tipPos.left + tip[0].offsetWidth > coff.left + coff.width) {
                    // left = tipPos.right - coff.right
                    let left = ((tipPos.left + tip[0].offsetWidth) - (coff.left + coff.width));
                    if (tipPos.left - left >= coff.left) {
                        tipPos.x -= left;
                        arrowPos.x += left;

                        tipPos.left -= left;
                        arrowPos.left += left;
                    }
                }
            };

            // try to position the tooltip if the it is being placed on the left or right
            // so it may fit in the container
            function positionTopBottom() {
                if (tipPos.top < coff.top) {
                    if (tip[0].offsetHeight <= coff.height) {
                        let diff = coff.top - tipPos.top;

                        // move the tooltip inside the container and keep the arrow centered with trigger element
                        tipPos.y += diff;
                        arrowPos.y -= diff;

                        tipPos.top += diff;
                        arrowPos.top -= diff;
                    }
                }
                // if tipPos.bottom > coff.bottom
                else if (tipPos.top + tip[0].offsetHeight > coff.top + coff.height) {
                    // top = tipPos.bottom - coff.bottom
                    let top = ((tipPos.top + tip[0].offsetHeight) - (coff.top + coff.height));
                    if (tipPos.top - top >= coff.top) {
                        // move the tooltip inside the container and keep the arrow centered with trigger element
                        tipPos.y -= top;
                        arrowPos.y += top;

                        tipPos.top -= top;
                        arrowPos.top += top;
                    }
                }
            };

            // if the tooltip will not fit in the container
            function isOutOfRange() {
                return (place === 'left' && tipPos.left < coff.left) ||
                    (place === 'right' && tipPos.left + tip[0].offsetWidth > coff.left + coff.width) ||
                    (place === 'top' && tipPos.top < coff.top) ||
                    (place === 'bottom' && tipPos.top + tip[0].offsetHeight > coff.top + coff.height);
            };

            function placeFallback(fp, index) {
                let position = () => {
                    if (place === 'left' || place === 'right')
                        positionTopBottom();
                    else
                        positionLeftRight();
                };

                if (index >= fp.length)
                    return;

                place = fp[index];
                tipPos = getTipPos();
                arrowPos = getArrowPos();

                if (isOutOfRange()) {
                    position();

                    if (isOutOfRange())
                        placeFallback(fp, index + 1);
                } else {
                    position();
                }
            };

            // initializer for placeFallback function
            function placeAtFallback() {
                placeFallback(fallbackPlacements.filter(x => /^(top|bottom|left|right)$/.test(x)), 0);
            }

            let isPopover = tip.hasClass('popover');
            let place = /^(left|right|top|bottom)$/.test(placement) ? placement : (isPopover ? 'right' : 'top');


            let arrow = angular.element(tip[0].querySelector(isPopover ? '.popover-arrow' : '.tooltip-arrow'));
            let tipPos = getTipPos();
            let arrowPos = getArrowPos();

            if (angular.isArray(offset) && offset.length === 2 && angular.isNumber(offset[0]) && angular.isNumber(offset[1])) {
                tipPos.x += offset[0];
                tipPos.y += offset[1];
            }

            if (isOutOfRange()) {
                placeAtFallback();
            }

            return {
                tip: {'transform': 'translate(' + tipPos.x + 'px,' + tipPos.y + 'px)'},
                arrow: {'transform': place === 'bottom' || place === 'top' ? 'translateX(' + arrowPos.x + 'px)' : 'translateY(' + arrowPos.y + 'px)'},
                placementClass: getPlacementClass()
            };
        };
    }])

    
    .service('$bs5DOM', ['$q', '$animate', '$timeout', function ($q, $animate, $timeout) {
        
        this.findRelativeContainer = function (elm) {
            elm = elm instanceof HTMLElement ? angular.element(elm) : elm;

            let node = elm;
            let style = window.getComputedStyle(node[0]);

            while (style && style.position !== 'relative') {
                node = node.parent();
                style = node[0] !== document ? window.getComputedStyle(node[0]) : null;
            }

            return style ? node : null;
        };

        
        this.findScrollableElement = function(elm) {
            let container = null;
            let node = elm.parent();
            let style = window.getComputedStyle(node[0]);
            let exp = /^(auto|scroll)$/;

            while(!exp.test(style.overflow) && !exp.test(style.overflowX) && !exp.test(style.overflowY) && node.length) {
                node = elm.parent();
                style = window.getComputedStyle(node)[0];
            }

            return node.length ? node : null;
        }

        
        this.contains = function (elm, container) {
            elm = elm instanceof HTMLElement ? angular.element(elm) : elm;
            container = container instanceof HTMLElement ? angular.element(container) : container;

            let node = elm.parent();

            while (!angular.equals(node, container) && node.length) {
                node = node.parent();
            }

            return !!node.length;
        };

        
        this.prev = function(elm) {
            elm = elm instanceof HTMLElement ? angular.element(elm) : elm;

            let children = elm.parent().children();
            let prev = angular.element([]);

            for(let i = 1; i <= children.length; i++) {
                if(children[i] === elm[0])
                    prev = angular.element(children[i - 1]);
            }

            return prev;
        };

        
        this.getCssTimeUnitMs = function(elm, property) {
            elm = elm instanceof HTMLElement ? angular.element(elm) : elm;

            property = property
                .replaceAll(/(^[-_]+|[-_]+$)/g, '')
                .replaceAll(/[-_]+/g, '-');

            let split = property.split('-');
            split[0] = split[0].substring(0, 1).toLowerCase() + split[0].substring(1, split[0].length);

            for(let i = 1; i < split.length; i++)
                split[i] = split[i].substring(0, 1).toUpperCase() + split[i].substring(1, split[i].length);

            property = split.join('');

            property = window.getComputedStyle(elm[0])[property];


            return
                property.endsWith('ms') ? parseFloat(property.substring(0, property.length - 2)) :
                (prop.endsWith('s') ? parseFloat(property.substring(0, property.length - 1) * 1000) : 0);
        }

        
        this.fade = function(elm, callback) {
            elm = elm instanceof HTMLElement ? angular.element(elm) : elm;

            let d = window.getComputedStyle(elm[0]).transitionDuration;
            d = elm.hasClass('fade') ? (d.endsWith('ms') ? parseFloat(d.replace('ms', '')) : parseFloat(d.replace('s', '')) * 1000) : d;

            let fn = function () {
                if (elm.hasClass('fade') && typeof callback === 'function')
                    $timeout(callback, d, false);

                else if (typeof callback === 'function')
                    callback();
            }

            $timeout(function () {
                if (elm.hasClass('fade')) {
                    if (elm.hasClass('show')) {
                        elm.removeClass('show');
                        fn();
                    } else {
                        elm.addClass('show');
                        fn();
                    }
                } else {
                    fn();
                }
            }, 0, false)
        }
    }]);

angular.module('bs5.icons', [])

    
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


angular.module('bs5.modal', ['bs5.dom'])

    

    

    

    
    .factory('$bs5Modal', ['$templateCache', '$controller', '$compile', '$rootScope', '$q', '$http', '$timeout', '$bs5DOM', '$bs5Position', '$$modalStack', '$$modalBackdrop', function ($templateCache, $controller, $compile, $rootScope, $q, $http, $timeout, $bs5DOM, $bs5Position, $$modalStack, $$modalBackdrop) {
        return function (options) {
            function show() {
                elm.addClass('d-block');
                return $bs5DOM.fade(elm);
            }

            function hide(fn) {
                return $bs5DOM.fade(elm, function () {
                    elm.removeClass('d-block');

                    if(typeof fn === 'function')
                        fn();
                });
            }

            function close(data) {
                remove(true, data);
            }

            function dismiss(reason) {
                remove(false, reason);
            }

            function remove(resolve, value) {
                console.log(!$$modalStack.isEmpty());
                if(!$$modalStack.isEmpty()) {
                    let modal = $$modalStack.pop();
                    modal.hide(function() {
                        console.log('modal-closed');
                        modal.elm.remove();
                        modal.scope.$destroy();

                        if (!$$modalStack.isEmpty())
                            $$modalStack.top().show();
                        else
                            $$modalBackdrop.close();

                        if (resolve)
                            modal.deferred.resolve(value);
                        else
                            modal.deferred.reject(value);
                    })
                }
            }

            let defaults = {
                staticBackdrop: false,
                size: null,
                centered: false,
                scrollable: false
            };

            options = angular.extend({}, defaults, options);

            let container = angular.element(document.body);

            let contentDeferred = $q.defer();
            let modalDeferred = $q.defer();

            if (options.templateUrl) {
                let tpl = $templateCache.get(options.templateUrl);
                if (tpl) {
                    contentDeferred.resolve(tpl);
                } else {
                    $http({
                        method: 'GET',
                        url: options.templateUrl
                    }).then(function (r) {
                        contentDeferred.resolve(r.data);
                    }, function () {
                        throw new Error(`Unable to resolve templeUrl: ${options.templateUrl}`);
                    });
                }
            } else if (options.template) {
                contentDeferred.resolve(options.template);
            } else {
                throw new Error("No template provided");
            }

            let scope = $rootScope.$new();

            scope.close = close;
            scope.dismiss = dismiss;

            let elm = angular.element($templateCache.get('templates/bs5/modal/modal-window.html'));

            let dialog = angular.element(elm[0].querySelector('.modal-dialog'));


            if(/^(sm|lg|xl)$/.test(options.size))
                dialog.addClass('modal-' + options.size);

            if(options.centered)
                dialog.addClass('modal-dialog-centered');

            if(options.scrollable)
                dialog.addClass('modal-dialog-scrollable');

            let content = angular.element(elm[0].querySelector('.modal-content'));

            contentDeferred.promise.then(function (html) {
                content.html(html);

                container.append(elm);

                $compile(content)(scope);

                if (angular.isString(options.controller) || angular.isFunction(options.controller) || angular.isArray(options.controller)) {
                    let ctrl = $controller(options.controller, {$scope: scope}, true, options.controllerAs)();

                    if (angular.isFunction(ctrl.$onInit))
                        ctrl.$onInit();
                }

                let mContent = angular.element(elm[0].querySelector('.modal-content'));

                elm.on('click', function (e) {
                    let off = $bs5Position.offset(mContent);

                    if (e.pageX < off.left || e.pageX > off.left + off.width || e.pageY < off.top || e.pageY > off.top + off.height) {
                        if (!options.staticBackdrop) {
                            dismiss('backdrop-click');
                        } else {
                            elm.addClass('modal-static');

                            if(elm.hasClass('fade')) {
                                let d = window.getComputedStyle(elm[0]).transitionDuration;
                                d = d.endsWith('ms') ? parseFloat(d.substring(0, d.length - 2)) : parseFloat(d.substring(0, d.length - 1)) * 1000;


                                $timeout(function () {
                                    elm.removeClass('modal-static');
                                }, d, false);
                            }
                        }
                    }
                });

                function display() {
                    if (!$$modalStack.isEmpty()) {
                        $$modalStack.top().hide();
                    }

                    show();

                    let modal = {
                        hide: hide,
                        show: show,
                        elm: elm,
                        deferred: modalDeferred,
                        scope: scope
                    };

                    $$modalStack.push(modal);
                };

                if (!$$modalBackdrop.isOpen())
                    $$modalBackdrop.open();

                display();
            });

            let result = {
                result: modalDeferred.promise,
                dismiss,
                close
            }

            return result;
        };
    }])

    .service('$$modalBackdrop', ['$bs5DOM', function ($bs5DOM) {
        let backdrop = angular.element('<div class="modal-backdrop fade"></div>');

        let $body = angular.element(document.body);

        this.open = function () {
            $body.append(backdrop);
            return $bs5DOM.fade(backdrop);
        }

        this.close = function () {
            return $bs5DOM.fade(backdrop, function () {
                backdrop.remove();
            });
        }

        this.isOpen = function () {
            return $bs5DOM.contains(backdrop, $body);
        }
    }])

    .service('$$modalStack', function () {
        let self = this;
        let stack = [];

        this.isEmpty = function() {
            return !stack.length;
        };

        this.push = function (modal) {
            stack.unshift(modal);
        };

        this.top = function () {
            if (stack.length)
                return stack[0];

            else
                throw new ReferenceError('Cannot get top of empty stack');
        };

        this.pop = function () {
            let r = self.top();

            stack.shift();

            return r;
        }

        this.size = function () {
            return stack.length;
        };

    })

    .run(['$templateCache', function($templateCache) {
        $templateCache.put("templates/bs5/modal/modal-window.html",
            "<div class=\"modal fade\">\n" +
            "    <div class=\"modal-dialog\">\n" +
            "        <div class=\"modal-content\"></div>\n" +
            "    </div>\n" +
            "</div>"
        );
	}]);

angular.module('bs5.pagination', [])

    .constant('bs5PaginationConfig', {
        displayPagesRange: 5,
        firstPageText: '<<',
        previousPageText: '<',
        nextPageText: '>',
        lastPageText: '>>',
        withFirstLast: true,
        withPreviousNext: true,
        size: null,
        align: 'left',
        useIcons: true,
        lastPageIcon: 'chevron-bar-right',
        firstPageIcon: 'chevron-bar-left',
        previousPage: 'chevron-left',
        nextPageIcon: 'chevron-right',
        align: 'left',
        pivot: false
    })

    
    .directive('bs5Pagination', ['bs5PaginationConfig', function(bs5PaginationConfig) {
        return {
            restrict: 'E',
            scope: {
                pageChange: '&?',
                currentPage: '=',
                numberItems: '=',
                pageSize: '=',
                pageRange: '=?',
                withFirstLast: '=?',
                withPreviousNext: '=?',
                firstPageText: '@?',
                lastPageText: '@?',
                previousPageText: '@?',
                nextPageText: '@?',
                size: '@?',
                icons: '=?',
                firstPageIcon: '@?',
                lastPageIcon: '@?',
                nextPageIcon: '@?',
                previousPageIcon: '@?',
                align: '@?',
                pivot: '=?'
            },
            templateUrl: 'templates/bs5/pagination/pagination.html',
            link: function(scope, elm, attrs) {
                scope.pageRange = scope.pageRange || bs5PaginationConfig.displayPagesRange;
                scope.withFirstLast = angular.isDefined(scope.withFirstLast) ? scope.withFirstLast : bs5PaginationConfig.withFirstLast;
                scope.withPreviousNext = angular.isDefined(scope.withPreviousNext) ? scope.withPreviousNext : bs5PaginationConfig.withPreviousNext;
                scope.pageSize = angular.isDefined(scope.pageSize) ? scope.pageSize : bs5PaginationConfig.pageSize;
                scope.firstPageText = scope.firstPageText || bs5PaginationConfig.firstPageText;
                scope.previousPageText = scope.previousPageText || bs5PaginationConfig.previousPageText;
                scope.nextPageText = scope.nextPageText || bs5PaginationConfig.nextPageText;
                scope.lastPageText = scope.lastPageText || bs5PaginationConfig.lastPageText;
                scope.size = scope.size || bs5PaginationConfig.size;
                scope.align = scope.align || bs5PaginationConfig.align;
                scope.numberPages = Math.ceil(scope.numberItems / scope.pageSize);
                scope.pages = [];
                scope.pivot = angular.isDefined(scope.pivot) ? scope.pivot : bs5PaginationConfig.pivot;

                scope.$watch('numberItems', function(value, old) {
                    if(!angular.equals(value, old)) {
                        scope.numberPages = Math.ceil(scope.numberItems / scope.pageSize);

                        if(scope.currrentPage > scope.numberPages) {
                            scope.pages = [];
                            scope.currentPage = scope.numberPages;
                            displayPages();
                        }

                        if(scope.pageChange) {
                            scope.pageChange({$page: scope.currentPage, $pageSize: scope.pageSize});
                        }
                    }
                });

                scope.$watch('pageSize', function(value, old) {
                    if(!angular.equals(value, old)) {
                        scope.numberPages = Math.ceil(scope.numberItems / scope.pageSize);

                        if(scope.currrentPage > scope.numberPages)
                            displayPages();

                        if(scope.pageChange) {
                            scope.pageChange({$page: scope.currentPage, $pageSize: scope.pageSize});
                        }
                    }
                });

                scope.$watch('currentPage', function(value, old) {
                    if(!angular.equals(value, old)) {
                        displayPages();

                        if(scope.pageChange)
                            scope.pageChange({$page: scope.currentPage, $pageSize: scope.pageSize});
                    }
                });

                scope.changePage = function(page, evt) {
                    evt.preventDefault();

                    scope.currentPage = page;
                };

                function range(r1, r2) {
                    let ret = [];
                    for(let i = r1; i < r2; i++)
                        ret.push(i);

                    return ret;
                }

                function displayPages() {
                    let page = scope.currentPage;
                    let r = page % scope.pageRange;
                    let r2 = page + (scope.pageRange - r);
                    let r1 = page - r;

                    if (scope.numberPages < scope.pageRange) {
                        r1 = 1;
                        r2 = scope.numberPages;
                    } else if (r2 >= scope.numberPages) {
                        r2 = scope.numberPages;
                        r1 = r2 - scope.pageRange;
                    }

                    if(scope.pivot) {
                        let pivot = Math.ceil(scope.pageRange / 2);

                        if(page >= pivot) {
                            r1 = page - pivot;
                            r2 = r1 + scope.pageRange;

                            if(r2 >= scope.numberPages) {
                                r2 = scope.numberPages;
                                r1 = r2 - scope.pageRange;
                            }
                        }
                    }

                    scope.pages = range(r1 + 1, r2 + 1);
                }

                displayPages();
            }
        };
    }])

    .run(['$templateCache', function($templateCache) {
        $templateCache.put("templates/bs5/pagination/pagination.html",
            "<nav>\n" +
            "    <ul class=\"pagination {{size === 'lg' || size === 'sm' ? 'pagination-' + size : ''}}\" ng-class=\"{'justify-content-center': align === 'center', 'justify-content-end': align === 'right'}\">\n" +
            "        <li class=\"page-item\" ng-if=\"withFirstLast && numberPages > pageRange\" ng-disabled=\"currentPage <= 1\" ng-class=\"{disabled: currentPage <= 1}\">\n" +
            "            <a class=\"page-link\" href=\"#\" ng-click=\"changePage(1, $event)\">{{firstPageText}}</a>\n" +
            "        </li>\n" +
            "        <li class=\"page-item\" ng-if=\"withPreviousNext\" ng-disabled=\"currentPage <= 1\" ng-class=\"{disabled: currentPage <= 1}\">\n" +
            "            <a class=\"page-link\" href=\"#\" ng-click=\"changePage(currentPage - 1, $event)\">{{previousPageText}}</a>\n" +
            "        </li>\n" +
            "        <li class=\"page-item\" ng-repeat-start=\"page in pages\" ng-if=\"page !== currentPage\">\n" +
            "            <a class=\"page-link\" href=\"#\" ng-click=\"changePage(page, $event)\">{{page}}</a>\n" +
            "        </li>\n" +
            "        <li class=\"page-item active\" ng-repeat-end ng-if=\"page === currentPage\">\n" +
            "            <a class=\"page-link\" href=\"#\" ng-click=\"$event.preventDefault()\">{{page}}</a>\n" +
            "        </li>\n" +
            "        <li class=\"page-item\" ng-if=\"withPreviousNext\" ng-disabled=\"currentPage >= numberPages\" ng-class=\"{disabled: currentPage >= numberPages}\">\n" +
            "            <a class=\"page-link\" href=\"#\" ng-click=\"changePage(currentPage + 1, $event)\">{{nextPageText}}</a>\n" +
            "        </li>\n" +
            "        <li class=\"page-item\" ng-if=\"withFirstLast && numberPages > pageRange\" ng-disabled=\"currentPage >= numberPages\" ng-class=\"{disabled: currentPage >= numberPages}\">\n" +
            "            <a class=\"page-link\" href=\"#\" ng-click=\"changePage(numberPages, $event)\">{{lastPageText}}</a>\n" +
            "        </li>\n" +
            "    </ul>\n" +
            "</nav>"
        );
	}]);


angular.module('bs5.popover', ['bs5.dom'])

    

    

    

    

    
    .directive('bs5Popover', ['$templateCache', '$compile', '$http', '$q', '$timeout', '$bs5Position', '$bs5DOM', '$controller', function ($templateCache, $compile, $http, $q, $timeout, $bs5Position, $bs5DOM, $controller) {

        return {
            restrict: 'A',
            scope: {
                handler: '&?'
            },
            link: function (scope, elm, attrs) {
                let deferred = $q.defer();

                let animate = attrs.animate ? scope.$eval(attrs.animate) : true;
                let delay = scope.$eval(attrs.delay);
                let html = attrs.html ? scope.$eval(attrs.html) : false;
                let placement = attrs.placement === 'left' || attrs.placement === 'top' || attrs.placement === 'bottom' ? attrs.placement : 'right';
                let title = attrs.title || '';
                let trigger = attrs.trigger === 'focus' || attrs.trigger === 'hover' ? attrs.trigger : 'click';
                let off = scope.$eval(attrs.offset) || [0, 0];
                off = angular.isArray(off) && off.length > 1 && angular.isNumber(off[0]) && angular.isNumber(off[1]) ? off : [0, 0];
                let fp = scope.$eval(attrs.fallbackPlacements) || ['left', 'right', 'top', 'bottom'];
                let container = attrs.container ? angular.element(document.querySelector(attrs.container)) : angular.element(document.body);


                if (attrs.templateUrl) {
                    let template = $templateCache.get(attrs.templateUrl);
                    if (template) {
                        html = true;
                        deferred.resolve(template);
                    } else {
                        $http({
                            url: attrs.templateUrl,
                            method: 'GET'
                        }).then(function (r) {
                            html = true;
                            deferred.resolve(r.data);
                        }, function () {
                            deferred.resolve(attrs.bs5Popover);
                            elm.removeAttr('template-url');
                        });
                    }
                } else {
                    deferred.resolve(attrs.bs5Popover);
                }

                deferred.promise.then(function (content) {

                    let tpl = $templateCache.get('templates/bs5/popover/popover.html');

                    let tplEl = angular.element(tpl);
                    let body = angular.element(tplEl[0].querySelector('.popover-body'));
                    html ? body.html(content) : body.text(content);

                    if (animate) {
                        tplEl.addClass('fade');
                    } else {
                        tplEl.addClass('show');
                    }

                    let Popover = function (popoverEl) {
                        let self = this;
                        let el = null;

                        let s = scope.$new();
                        s.title = title;

                        let deferred = $q.defer();
                        s.deferred = deferred;

                        deferred.promise.then(function (data) {
                            scope.handler({$data: data});
                        }, angular.noop);

                        this.show = function () {
                            $timeout(function () {
                                el = angular.copy(popoverEl);
                                let arrow = angular.element(el[0].querySelector('.popover-arrow'));

                                s.popover = this;

                                s.close = function (data) {
                                    self.hide();
                                    deferred.resolve(data);
                                }

                                s.dismiss = function (reason) {
                                    self.hide();
                                    deferred.reject(reason);
                                }

                                $compile(el)(s);

                                if (attrs.popoverController) {
                                    let ctrl = $controller(attrs.popoverController, {$scope: s});

                                    if (angular.isFunction(ctrl.$onInit))
                                        ctrl.$onInit();
                                }


                                $timeout(function () {
                                    el.css({
                                        'position': 'absolute',
                                    });

                                    arrow.css('position', 'absolute');

                                    container.append(el);

                                    $timeout(function () {
                                        let css = $bs5Position.translateTooltip(elm, el, container, placement, fp, off);

                                        el.addClass(css.placementClass);
                                        el.css(css.tip);

                                        arrow.css(css.arrow);

                                        if (animate) {
                                            $bs5DOM.fade(el);
                                        }
                                    });
                                });
                            }, angular.isObject(delay) ? (angular.isNumber(delay.show) ? delay.show : 0) : (angular.isNumber(delay) ? delay : 0));
                        };

                        this.hide = function () {
                            let removeEl = function () {
                                el.remove();
                                el = null;
                            };
                            if (el) {
                                $timeout(function () {
                                    if (animate) {
                                        $bs5DOM.fade(el, removeEl())
                                    } else {
                                        removeEl();
                                    }
                                }, angular.isObject(delay) ? (angular.isNumber(delay.hide) ? delay.hide : 0) : (angular.isNumber(delay) ? delay : 0));
                            }
                        };

                        this.toggle = function () {
                            if (el)
                                this.hide();
                            else
                                this.show();
                        };
                    };

                    let popover = new Popover(tplEl);


                    if (trigger === 'hover') {
                        elm.on('mouseenter', function () {
                            popover.show();
                        });

                        elm.on('mouseleave', function () {
                            popover.hide();
                        });
                    } else if (trigger === 'focus') {
                        elm.on('focus', function () {
                            popover.show();
                        });

                        elm.on('blur', function () {
                            popover.hide();
                        });
                    } else {
                        elm.on('click', function () {
                            popover.toggle();
                        });
                    }
                });
            }
        };
    }])

    .run(['$templateCache', function($templateCache) {
        $templateCache.put("templates/bs5/popover/popover.html",
            "<div class=\"popover\">\n" +
            "    <div class=\"popover-arrow\"></div>\n" +
            "    <div class=\"popover-header\">{{title}}</div>\n" +
            "    <div class=\"popover-body\"></div>\n" +
            "</div>"
        );
	}]);


angular.module('bs5.progressbar', [])

    
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
    }])

    .run(['$templateCache', function($templateCache) {
        $templateCache.put("templates/bs5/progressbar/progressbar.html",
            "<div class=\"progress\">\n" +
            "    <div class=\"progress-bar {{type ? 'bg-' + type : ''}}\" ng-class=\"{'progress-bar-striped': striped, 'progress-bar-animated': animate}\" style=\"width: {{value}}%\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"100\">\n" +
            "        <span ng-if=\"displayPercent\">{{value}}%</span>\n" +
            "    </div>\n" +
            "</div>"
        );
	}]);


angular.module('bs5.rating', ['bs5.icons'])

    
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
    }])

    .run(['$templateCache', function($templateCache) {
        $templateCache.put("templates/bs5/rating/rating-partial.html",
            "<!-- <span ng-if=\"!useImages\"> -->\n" +
            "    <bs5-icon icon=\"{{stateOff}}\" size=\"size\"></bs5-icon>\n" +
            "    <span style=\"width: {{value}}px\">\n" +
            "        <bs5-icon size=\"size\" icon=\"{{stateOn}}\"></bs5-icon>\n" +
            "    </span>\n" +
            "<!-- </span> -->\n" +
            "<!--\n" +
            "<span ng-if=\"useImages\">\n" +
            "    <img src=\"{{stateOff}}\" style=\"width: {{size}}px\">\n" +
            "    <span style=\"width: {{value}}px\">\n" +
            "        <img src=\"{{stateOn}}\" style=\"width: {{size}}px\">\n" +
            "    </span>\n" +
            "</span>\n" +
            "-->"
        );

        $templateCache.put("templates/bs5/rating/rating.html",
            "<bs5-icon size=\"size\" icon=\"{{$index < value ? stateOn : stateOff}}\" ng-repeat=\"r in range\" ng-mouseenter=\"enter($index + 1)\" ng-click=\"rate($index + 1)\" ng-mouseleave=\"leave()\"></bs5-icon>"
        );
	}]);


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

    .run(['$templateCache', function($templateCache) {
        $templateCache.put("templates/bs5/tabs/tab.html",
            "<a class=\"nav-link bs5-tab\" href ng-class=\"{active: active, disabled: disabled}\" ng-disabled=\"disabled\" ng-click=\"select($event)\" bs5-tab-heading-transclude>{{heading}}</a>\n" +
            ""
        );

        $templateCache.put("templates/bs5/tabs/tabset.html",
            "<div class=\"bs5-tabset\">\n" +
            "    <nav class=\"nav nav-{{type}} mb-2\" ng-class=\"{'nav-justified': justified, 'nav-fill': fill}\" ng-transclude></nav>\n" +
            "    <div class=\"tab-content\">\n" +
            "        <div class=\"tab-pane fade\" ng-repeat=\"tab in tabset.tabs\" bs5-tab-content-transclude=\"tab\"></div>\n" +
            "    </div>\n" +
            "</div>"
        );
	}]);

angular.module('bs5.tooltip', ['bs5.dom'])

    

    
    .directive('bs5Tooltip', ['$templateCache', '$compile', '$http', '$q', '$bs5Position', '$bs5DOM', '$timeout', function($templateCache, $compile, $http, $q, $bs5Position, $bs5DOM, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                let deferred = $q.defer();

                let offset = /^\[ *?\d+?, *?\d+? *?\]$/.test(attrs.offset) ? scope.$eval(attrs.offset) : [0, 0];
                let delay = scope.$eval(attrs.delay);
                let animate = attrs.animate ? scope.$eval(attrs.animate) : true;
                let html = scope.$eval(attrs.html);
                let placement = attrs.placement === 'left' || attrs.placement === 'bottom' || attrs.placement === 'right' || attrs.placement === 'top' ? attrs.placement : 'top';
                let fp = scope.$eval(attrs.fallbackPlacements);
                fp = angular.isArray(fp) ? fp : ['left', 'right', 'top', 'bottom'];
                let container = attrs.container ? angular.element(document.querySelector(attrs.container)) : angular.element(document.body);

                if(!(container instanceof angular.element) || !container.length)
                    throw new DOMException('bes5Tooltip: The specified container could not be found');


                if(attrs.templateUrl) {
                    $http({
                        url: attrs.templateUrl,
                        method: 'GET'
                    }).then(function(r) {
                        html = true;
                        deferred.resolve(r.data);
                    }, function() {
                        deferred.resolve(attrs.bs5Tooltip);
                    });
                }
                else {
                    deferred.resolve(attrs.bs5Tooltip);
                }

                deferred.promise.then(function(content) {
                    let tpl = $templateCache.get('templates/bs5/tooltip/tooltip.html');
                    let Tooltip = function (tooltipEl) {
                        let self = this;
                        let el = null;
                        let visible = false;

                        this.show = function () {

                            $timeout(function () {
                                if (el) el.remove();
                                el = angular.copy(tooltipEl);

                                let arrow = angular.element(el[0].querySelector('.tooltip-arrow'));

                                el.css({
                                    'position': 'absolute',
                                });

                                arrow.css('position', 'absolute');

                                container.append(el);

                                $timeout(function () {
                                    let css = $bs5Position.translateTooltip(elm, el, container, placement, fp, offset);

                                    el.addClass(css.placementClass);

                                    el.css(css.tip);

                                    arrow.css(css.arrow);

                                    if (animate) {
                                        $bs5DOM.fade(el);
                                    }

                                    visible = true;
                                });
                            }, angular.isObject(delay) ? (angular.isNumber(delay.show) ? delay.show : 0) : (angular.isNumber(delay) ? delay : 0));
                        };

                        this.hide = function () {
                            let removeEl = function () {
                                el.remove();
                                console.log('el removed');
                                visible = false;
                            };
                            $timeout(function () {
                                if (animate) {
                                    $bs5DOM.fade(el, removeEl);
                                } else {
                                    removeEl();
                                }
                            }, angular.isObject(delay) ? (angular.isNumber(delay.hide) ? delay.hide : 0) : (angular.isNumber(delay) ? delay : 0), false);
                        };

                        this.toggle = function () {
                            if (visible)
                                self.hide();
                            else
                                self.show();
                        };
                    };

                    let tplEl = angular.element(tpl);
                    tplEl.css('max-width', '200px');

                    if (animate)
                        tplEl.addClass('fade');
                    else
                        tplEl.addClass('show');

                    let body = angular.element(tplEl[0].querySelector('.tooltip-inner'))
                    html ? body.html(content) : body.text(content);

                    let tooltip = new Tooltip(tplEl);

                    if (attrs.trigger === 'click') {
                        elm.on('click', function () {
                            tooltip.toggle();
                        });
                    } else if (attrs.trigger === 'focus') {
                        elm.on('focus', function () {
                            tooltip.show();
                        });

                        elm.on('blur', function () {
                            tooltip.hide();
                        });
                    } else {
                        elm.on('mouseenter', function () {
                            tooltip.show();
                        });

                        elm.on('mouseleave', function () {
                            tooltip.hide();
                        });
                    }
                });
            }
        };
    }])

    .run(['$templateCache', function($templateCache) {
        $templateCache.put("templates/bs5/tooltip/tooltip.html",
            "<div class=\"tooltip\">\n" +
            "    <div class=\"tooltip-arrow\"></div>\n" +
            "    <div class=\"tooltip-inner\"></div>\n" +
            "</div>"
        );
	}]);

angular.element(document).find('head').append('<style>bs5-autocomplete-list{position:absolute;overflow-x:hidden;z-index:9999}bs5-autocomplete-list li{cursor:pointer}.calendar{position:absolute;border:1px solid #000;z-index:9999}bs5-rating{display:inline-block}[bs5-rating]:not(.readonly)>*,bs5-rating:not(.readonly)>*{cursor:pointer}[bs5-rating].disabled>*,bs5-rating.disabled>*{cursor:not-allowed;filter:grayscale(60%);opacity:.17}bs5-rating-partial>span{position:relative}bs5-rating-partial>span>span{position:absolute;left:0;top:0;width:0;overflow:hidden}</style>');

