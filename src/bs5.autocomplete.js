/**
 * Module: bs5.autocomplete
 */
angular.module('bs5.autocomplete', ['bs5.dom'])

    /**
     * Directive: bs5Autocomplete
     *
     * An autocomplete feature for input text boxes.
     *
     * Requires:
     * 		input[text]
     * 		ngModel
     *
     * Attributes:
     * 		remote-addr:           <string>                                          if set the autocomplete will make a remote call to the provided address to get
     * 	                                                                             it's items.
     *
     * 	   remote-addr-method:     <'GET' | 'POST' | 'UPDATE' | 'DELETE' | 'PATCH'>  the request method for the remote sever call {default: 'GET'}
     *
     * 	   remote-addr-params:     <object>                                          additional parameters for the remote server call
     *
     * 	   datasource:             <Array<string>>                                   if remote-addr is not set then the autocomplete will use this array of strings for
     * 	                                                                             it's data source
     *
     * 	   min-chars:             <number>                                          the minimum number of characters that has to be type in for the autocomplete to activate
     *
     * 	   on-select:             <expression>                                      the event handler to call when an item is selected from the autocomplete. $value which is
     * 	                                                                            the value of the selected item is provided to the expression
     *
     *
     *
     * Making Remote Server Calls:
     * 		When using the remote-addr attribute autocomplete sends a parameter called 'term' that is the value typed in the text box to the server. When using 'GET' as the
     * 		request method 'term' and addition parameters are passed as get variables in the url. Otherwise they are passed to the body of the request.
     *
     *		bs5Autocomplete expects for the response type to be JSON. It is expecting an array of strings (Array<string>) to use for its list of items to display to the user
     */
    .directive('bs5Autocomplete', ['$timeout', '$http', '$compile', '$document', '$bs5Position', function($timeout, $http, $compile, $document, $bs5Position) {
        return {
            restrict: 'A',
            require: ['input[text]', 'ngModel'],
            scope: {
                onSelect: '&?',
                datasource: '=?',
                remoteAddr: '@?',
                remoteAddrParams: '=?',
                remoteAddrMethod: '@?'
            },
            link: function(scope, elm, attrs, ctrls) {
                $timeout(function() {

                    let ctrl = ctrls[1];
                    let minChars = scope.$eval(attrs.minCharacters) || 3;
                    let scroll = $bs5Position.findScrollable(elm);

                    scope.modelCtrl = ctrl;

                    scope.onSelect = scope.onSelect || null;
                    scope.items = [];
                    scope.offset = scroll && scroll.isRelative ? $bs5Position.relativeOffset(elm, scroll) : $bs5Position.offset(elm);
                    scope.offset.top += scope.offset.height;

                    scope.triggered = false;

                    let oldModelValue = null;

                    elm.on('keyup', function (e) {
                        let triggerAutocomplete = function () {
                            if (!scope.triggered) {
                                scope.triggered = true;
                                let autocomplete = angular.element('<bs5-autocomplete-list triggered="triggered" items="items" offset="offset" select="onSelect" model="modelCtrl"></bs5-autocomplete-list>');
                                (scroll || $document.find('body').append(autocomplete));
                                $compile(autocomplete)(scope);
                            }
                        };

                        scope.$apply(function () {
                            if (e.which !== 13 && (e.which < 37 || e.which > 40)) {
                                if (ctrl.$modelValue.length >= minChars && oldModelValue !== ctrl.$modelValue) {
                                    if (scope.remoteAddr) {
                                        scope.remoteAddrMethod = scope.remoteAddrMethod || 'GET';

                                        if(scope.remoteAddrMethod.toLowerCase() !== 'get') {
                                            let params = {term: ctrl.$modelValue};

                                            if (angular.isObject(scope.remoteAddrParams))
                                                params = angular.extend({}, scopeRemoteAddrParams, params);

                                            $http({
                                                url: scope.remoteAddr,
                                                method: scope.remoteAddrMethod,
                                                data: params,
                                                returnType: 'json'
                                            }).then(function (r) {
                                                scope.items = r.data;
                                                triggerAutocomplete();
                                            });
                                        }
                                        else {
                                            let url = scope.remoteAddr + '?term=' + ctrl.$modelValue;

                                            if(angular.isObject(scope.remoteAddrParams)) {
                                                for(let p in scope.remoteAddrParams)
                                                    url += '&' + p + '=' + scope.remoteAddrParams[p];
                                            }

                                            $http({
                                                url: url,
                                                method: scope.remoteAddrMethod,
                                                returnType: 'json'
                                            }).then(function (r) {
                                                scope.items = r.data;
                                                triggerAutocomplete();
                                            });
                                        }
                                    } else if (angular.isArray(scope.datasource)) {
                                        scope.items = scope.datasource.filter(function (value) {
                                            let regex = new RegExp('^' + ctrl.$modelValue + '.*$', 'i');
                                            return regex.test(value);
                                        });

                                        triggerAutocomplete();
                                    }
                                } else {
                                    scope.items = [];
                                }

                                oldModelValue = ctrl.$modelValue;
                            }
                        });
                    });

                    elm.on('blur', function () {
                        scope.$apply(function () {
                            scope.triggered = false;
                        });
                    });

                }, 250);
            }
        };
    }])

    .directive('bs5AutocompleteList', ['$document', '$timeout', '$interval', function($document, $timeout, $interval) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                triggered: '=',
                offset: '=',
                model: '=',
                items: '=',
                select: '='
            },
            templateUrl: 'angular/bootstrap5/templates/autocomplete/list.html',
            link: function(scope, elm, attrs) {
                elm.css({
                    'position': 'absolute',
                    'left': scope.offset.left + 'px',
                    'top': scope.offset.top + 'px',
                    'width': scope.offset.width,
                    'z-index': 9999,
                    'overflow-x': 'hidden'
                });

                scope.$watch('triggered', function(value) {
                    if(!value)
                        elm.remove();
                });

                scope.$watch('items.length', function(value) {
                    if(value === 0)
                        scope.triggered = false;
                });

                scope.highlighted = null;
                scope.highlight = function(index) {
                    scope.highlighted = index;
                };

                scope.unhighlight = function() {
                    scope.highlighted = null;
                }

                scope.selectItem = function() {
                    scope.model.$setViewValue(scope.items[scope.highlighted]);
                    scope.model.$render();
                    scope.triggered = false;

                    if(scope.select) {
                        scope.select({$value: scope.items[scope.highlighted]});
                    }
                }

                let downPressed = false;
                let upPressed = false;
                let interval = null;

                let keydown = function(e) {
                    if(e.which === 38) {
                        upPressed = true;

                        let goUp = function() {
                            if(scope.highlighted && upPressed) {
                                scope.highlighted--;
                            }
                        };

                        scope.$apply(goUp);

                        $timeout(function() {
                            if(upPressed) {
                                interval = $interval(goUp, 500);
                            }
                        }, 1000);
                    }
                    else if(e.which === 40) {
                        downPressed = true;

                        let goDown = function() {
                            if(downPressed) {
                                if(scope.highlighted === null)
                                    scope.highlighted = 0;
                                else if(scope.highlighted < scope.items.length - 1)
                                    scope.highlighted++;
                            }
                        };

                        scope.$apply(goDown);

                        $timeout(function() {
                            if(downPressed) {
                                interval = $interval(goDown, 500);
                            }
                        }, 1000);
                    }
                    else if(e.which === 13) {
                        scope.$apply(scope.selectItem);
                    }
                };

                let keyup = function(e) {
                    if(e.which === 38) {
                        upPressed = false;

                        if(interval) {
                            $interval.cancel(interval);
                            interval = null;
                        }
                    }
                    else if(e.which === 40) {
                        downPressed = false;

                        if(interval) {
                            $interval.cancel(interval);
                            interval = null;
                        }
                    }
                };

                $document.on('keyup', keyup);
                $document.on('keydown', keydown);

                scope.$on('$destroy', function() {
                    $document.off('keyup', keyup);
                    $document.off('keydown', keydown);
                });
            }
        };
    }])

    .run(['$templateCache', function($templateCache) {
        $templateCache.put(
            'angular/bootstrap5/templates/autocomplete/list.html',
            '<ul class="list-group">' +
            '<li class="list-group-item" ng-repeat="item in items" ng-mousedown="selectItem()" ng-mouseenter="highlight($index)" ng-class="{active: highlighted === $index}" ng-mouseleave="uhighlight()">' +
            '{{item}}' +
            '</li>' +
            '</ul>'
        );
    }]);