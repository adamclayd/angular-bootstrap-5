angular.module('ngBootstrap5', [
	'bs5.accordian',
	'bs5.alert',
	'bs5.autocomplete',
	'bs5.collapse',
	'bs5.datepicker',
	'bs5.dom',
	'bs5.forms',
	'bs5.modal',
	'bs5.pagination',
	'bs5.popover',
	'bs5.progressbar',
	'bs5.rating',
	'bs5.tabs',
	'bs5.tooltip',
]);


angular.module('bs5.accordion', ['bs5.collapse'])

    
    .constant('bs5AccordionConfig', {
        closeOthers: true
    })

    
    .controller('Bs5AccordionController', ['$scope', '$attrs', 'bs5AccordionConfig', function($scope, $attrs, bs5AccordionConfig) {
        this.groups = [];

        let self = this;

        
        this.closeOthers = function(openGroup) {
            let closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : bs5AccordionConfig.closeOthers;

            if(closeOthers) {
                angular.forEach(self.groups, function(group) {
                    if(group !== openGroup)
                        group.isOpen = false;
                });
            }
        };

        
        this.addGroup = function(groupScope) {
            self.groups.push(groupScope);


            groupScope.$on('$destory', function(event) {
                self.removeGroup(groupScope);
            });
        };

        
        this.removeGroup = function(group) {
            let index = self.groups.indexOf(group);

            if(index >= 0)
                self.groups.splice(index, 1);
        };
    }])

    
    .directive('bs5Accordion', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: function(element, attrs) {
                return attrs.templateUrl || 'angular/bootstrap5/templates/accordion/accordion.html';
            },
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
            templateUrl: function(element, attrs) {
                return attrs.templateUrl || 'angular/bootstrap5/templates/accordion/accordion-group.html';
            },
            controller: function() {
                let self = this;

                
                this.setHeading = function(elm){
                    self.heading = elm;
                };
            },
            scope: {
                heading: '@',
                isOpen: '=?',
                isDisabled: '=?'
            },
            link: function(scope, elm, attrs, accordionCtrl) {
                accordionCtrl.addGroup(scope);
                scope.$watch('isOpen', function(value) {
                    if(value)
                        accordionCtrl.closeOthers(scope);
                });

                scope.toggleOpen = function(event) {
                    if(!scope.isDisabled) {
                        if(!event || event.which === 32)
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
            link: function(scope, elm, attrs, accordionGroup, transclude) {
                accordionGroup.setHeading(transclude(scope, angular.noop));
            }
        }
    })

    
    .directive('bs5AccordionTransclude', function() {
        return {
            require: '^bs5AccordionGroup',
            link: function(scope, elm, attrs, accordionGroup) {
                scope.$watch(function() { return accordionGroup[attrs.bs5AccordionTransclude]; }, function(heading) {
                    if(heading) {
                        let elem = angular.element(elm[0].querySelector('bs5-accordion-header, data-bs5-accordion-header, [bs5-accordion-header], [data-bs5-accordion-header]'));
                        elem.html('');
                        elem.append(heading);
                    }
                });
            }
        }
    })

    
    .run(['$templateCache', function($templateCache){
        $templateCache.put(
            'angular/bootstrap5/templates/accordion/accordion.html',
            '<div class="accordion">' +
            '<ng-transclude></ng-transclude>' +
            '</div>'
        );

        $templateCache.put(
            'angular/bootstrap5/templates/accordion/accordion-group.html',
            '<div class="accordion-item">' +
            '<h2 class="accordion-header">' +
            '<button type="button" ng-click="toggleOpen()" ng-class="{collapsed: !isOpen}" class="accordion-button" aria-expanded="{{isOpen.toString()}}" bs5-accordion-transclude="heading"><span bs5-accordion-header>{{heading}}</span></button>' +
            '</h2>' +
            '<div class="accordion-collapse collapse" bs5-collapse="!isOpen">' +
            '<div class="accordion-body">' +
            '<ng-transclude></ng-transclude>' +
            '</div>' +
            '</div>'
        );
    }]);


angular.module('bs5.alert', [])

    
    .directive('bs5Alert', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: function(elm, attrs) {
                return attrs.templateUrl || 'angular/bootstrap5/templates/alert/alert.html'
            },
            scope: {
                type: '@?',
                dismissible: '=?'
            },
            link: function(scope, elm) {
                scope.type = scope.type || 'light';
                scope.close = function() {
                    elm.remove();
                    scope.$destroy();
                }
            }
        };
    })

    .run(['$templateCache', function($templateCache) {
        $templateCache.put(
            'angular/bootstrap5/templates/alert/alert.html',
            '<div class="alert alert-{{type}} alert-dismissible d-flex align-items-center" role="alert">' +
            '<ng-transclude></ng-transclude>' +
            '<button ng-if="dismissible" ng-click="close()" type="button" class="btn-close"></button>' +
            '</div>'
        );
    }]);


angular.module('bs5.autocomplete', ['$bs5.dom'])

    
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


angular.module('bs5.collapse', ['bs5.dom'])


.directive('bs5Collapse', ['$timeout', '$bs5DOM', function($timeout, $bs5DOM) {
    return {
        restrict: 'A',
        scope: {
            onExpanded: '&?',
            onCollapsed: '&?',
            horizontal: '=?'
        },
        link: function(scope, elm, attrs) {

            elm.css({
                'overflow': 'hidden'
            });

            elm.addClass('collapse');

            if(scope.$eval(attrs.bs5Collapse))
                elm.addClass('show');


            scope.$watch(attrs.bs5Collapse, function($new, $old) {
                if(!angular.equals($new, $old)) {
                    if ($new && angular.isDefined($old)) {
                        $bs5DOM.slide(elm, 1, 0, scope.horizontal).then(function () {
                            elm.removeClass('show');
                            scope.onCollapsed();
                        });
                    }
                    else if (angular.isDefined($old)) {
                        elm.addClass('show');
                        $bs5DOM.slide(elm, 0, 1, scope.horizontal).then(scope.onExpanded);
                    }
                }
            });
        }
    }
}]);


angular.module('bs5.datepicker', ['bs5.dom'])

    
    .directive('bs5Datepicker', ['$compile', '$document', '$timeout', '$bs5Position', '$bs5DOM', function($compile, $document, $timeout, $bs5Position, $bs5DOM) {
        return {
            restrict: 'A',
            require: ['input[date]', 'ngModel'],
            scope: {
                minDate: '=?',
                maxDate: '=?'
            },
            link: function(scope, elm, attrs, ctrl) {
                $timeout(function() {

                    scope.minDate = angular.isDate(scope.minDate) ? scope.minDate : null;
                    scope.maxDate = angular.isDate(scope.maxDate) ? scope.maxDate : null;

                    if(scope.minDate)
                        scope.minDate.setHours(0, 0, 0, 0);

                    if(scope.minDate)
                        scope.maxDate.setHours(23, 59, 59, 999);

                    scope.date = null;
                    scope.$watch('date', function(value, old) {
                        if(value && !angular.equals(value, old)) {
                            ctrl.$setViewValue(value);
                            ctrl.$render();
                        }
                    });

                    scope.offset = $bs5Position.offset(elm);
                    scope.offset.top += elm[0].offsetHeight;
                    scope.triggered = false;

                    let focusClick = function() {
                        if(!scope.triggered) {
                            if(ctrl.$modelValue) {
                                let date = new Date(ctrl.$modelValue);

                                if(!isNaN(date.getDate()))
                                    scope.date = date;
                                else
                                    scope.date = null;
                            }
                            else {
                                scope.date = null;
                            }

                            let cal = angular.element('<bs5-datepicker-calendar date="date" offset="offset" triggered="triggered"' + (scope.minDate ? ' min-date="minDate"' : '') + (scope.maxDate ? ' max-date="maxDate"' : '') + '></bs5-calendar>');
                            (relativeTo ? relativeTo : $document.find('body')).append(cal);

                            $compile(cal)(scope);

                            scope.triggered = true;
                        }
                    };

                    elm.on('focus', focusClick);
                    elm.on('click', focusClick);

                    elm.on('keydown', function() {
                        scope.$apply(function() {
                            scope.triggered = false;
                        });
                    });

                }, 250);

            }
        }
    }])

    
    .constant('bs5MonthNames', [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ])

    
    .directive('bs5DatepickerCalendar', ['$animate', '$injector', 'bs5MonthNames', function($animate, $injector, bs5MonthNames) {
        let $animateCss = $injector.has('$animateCss') ? $injector.get('$animateCss') : null;

        return {
            restrict: 'E',
            replace: true,
            scope: {
                date: '=',
                offset: '=',
                triggered: '=',
                minDate: '=?',
                maxDate: '=?'
            },
            templateUrl: 'angular/bootstrap5/templates/datepicker/calendar.html',
            link: function(scope, elm, attrs) {

                let ref = null;
                let init = function() {
                    scope.calendar = [];

                    for(let i = 0; i < 5; i++) {
                        let row = [];

                        for(let j = 0; j < 7; j++) {
                            row.push({
                                number: null,
                                selected: false,
                                date: null
                            });
                        }

                        scope.calendar.push(row);
                    }

                    if(scope.date && !ref)
                        ref = angular.copy(scope.date);
                    else if(!ref)
                        ref = new Date();

                    let month = ref.getMonth();
                    let year = ref.getFullYear();
                    let day = 1;
                    ref.setDate(day);
                    ref.setHours(0, 0, 0, 0);

                    for(let i = 0; i < scope.calendar.length && day <= 31; i++) {
                        for(let j = ref.getDay(); j < scope.calendar[i].length && day <= 31; j++) {
                            scope.calendar[i][j].number = day > 10 ? day : '0' + day;
                            scope.calendar[i][j].date = angular.copy(ref);
                            scope.calendar[i][j].selected = scope.date && scope.date.getTime() === scope.calendar[i][j].date.getTime();
                            day++;
                            ref.setDate(day);
                            ref.setHours(0, 0, 0, 0);

                            if(ref.getMonth() !== month)
                                break;
                        }

                        if(ref.getMonth() !== month)
                            break;
                    }

                    ref.setDate(1);
                    ref.setMonth(month);
                    ref.setHours(0, 0, 0, 0);
                    ref.setFullYear(year);

                    scope.month = bs5MonthNames[month];
                    scope.year = ref.getFullYear();
                };

                $bs5DOM.fade(elm).then(init);

                scope.$watch('triggered', function(value, old) {
                    if(!value)
                        elm.remove();
                });

                scope.close = function() {
                    $bs5DOM.fade(elm, 1, 0).then(function() {
                       scope.triggered =   false;
                    });
                };

                scope.previousMonth = function() {
                    let month = ref.getMonth();
                    let year = ref.getFullYear();

                    ref.setDate(1);
                    ref.setHours(0, 0, 0, 0);
                    if(month === 0) {
                        ref.setMonth(11);
                        ref.setYear(year - 1);

                    }
                    else {
                        ref.setMonth(month - 1);
                    }

                    init();
                };

                scope.nextMonth = function() {
                    let month = ref.getMonth();
                    let year = ref.getFullYear();

                    ref.setDate(1);
                    ref.setHours(0, 0, 0, 0);

                    if(month === 11) {
                        ref.setMonth(0);
                        ref.setYear(year + 1);
                    }
                    else {
                        ref.setMonth(month + 1);
                    }

                    init();
                };

                scope.selectCell = function(cell) {
                    cell.selected = true;
                    scope.date = cell.date;
                    for(let i = 0; i < scope.calendar.length; i++) {
                        for(let j = 0; j < scope.calendar[i].length; j++) {
                            if(scope.calendar[i][j] !== cell) {
                                scope.calendar[i][j].selected = false;
                            }
                        }
                    }

                    scope.close();
                }
            }
        };
    }])

    
    .run(['$templateCache', function($templateCache) {
        $templateCache.put(
            'angular/bootstrap5/templates/datepicker/calendar.html',
            '<div class="card" style="position: absolute; left: {{offset.left}}px; top: {{offset.top}}px; opacity: 0; border: 1px solid black; z-index: 9999">' +
            '<div class="card-body">' +
            '<div class="row">' +
            '<div class="col-12">' +
            '<p class="text-end"><button type="button" class="btn-close" ng-click="close()"></button></p>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-2">' +
            '<button type="button" class="btn btn-light" ng-click="previousMonth()" style="width: 100%;">&lt;</button>' +
            '</div>' +
            '<div class="col-8">' +
            '<p class="text-center">{{month}} {{year}}</p>' +
            '</div>' +
            '<div class="col-2">' +
            '<button type="button" class="btn btn-light" style="width: 100%;" ng-click="nextMonth()">&gt;</button>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-12">' +
            '<table class="table table-bordered">' +
            '<tbody>' +
            '<tr>' +
            '<td class="text-center"><strong>Sun</strong></td>' +
            '<td class="text-center"><strong>Mon</strong></td>' +
            '<td class="text-center"><strong>Tue</strong></td>' +
            '<td class="text-center"><strong>Wed</strong></td>' +
            '<td class="text-center"><strong>Thur</strong></td>' +
            '<td class="text-center"><strong>Fri</strong></td>' +
            '<td class="text-center"><strong>Sat</strong></td>' +
            '</tr>' +
            '<tr ng-repeat="row in calendar">' +
            '<td ng-repeat="cell in row">' +
            '<button class="btn" ng-class="{\'btn-light\': !cell.selected, \'btn-primary\': cell.selected, disabled: !cell.date || (minDate && cell.date < minDate) || (maxDate && cell.date > maxDate)}" ng-disabled="!cell.date || (minDate && cell.date < minDate) || (maxDate && cell.date > maxDate)" ng-click="selectCell(cell)" style="width: 100%;">{{cell.number}}</button>' +
            '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        );
    }]);


angular.module('bs5.dom', [])


    
    .service('$bs5Position', ['$bs5DOM', function($bs5DOM) {

        
        this.offset = function(elm) {
            let rect = elm[0].getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft,
                width: elm[0].offsetWidth,
                height: elm[0].offsetHeight
            };
        };


        
        this.relativeOffset = function(elm, relativeTo) {
            let r = null

            if($bs5DOM.contains(elm, relativeTo)) {
                let relOffset = {x: relativeTo[0].offsetLeft, y: relativeTo[0].offsetTop};
                let elOffset = {x: elm[0].offsetLeft, y: elm[0].offsetTop};

                r = {
                    left: elOffset.x - relOffset.x,
                    top: elOffset.y - relOffset.y,
                    width: elm[0].offsetWidth,
                    height: elm[0].offsetHeight
                };
            }

            return r;

        }

        
        this.positionTarget = function(hostElm, targetElm, placement, offset) {
            let r = null;
            if (angular.isElement(hostElm) && angular.isElement(targetElm)) {
                let host = this.offset(hostElm);
                let target = this.offset(targetElm);


                let left = host.left;
                let top = host.top;
                if (placement === 'top') {
                    top = host.top - target.height;
                }
                else if (placement === 'left') {
                    left = host.left - target.width
                }
                else if (placement === 'bottom') {
                    top = host.top + host.height;
                }
                else if (placement === 'right') {
                    left = host.left + host.width
                }
                else if (placement === 'top-left') {
                    left = host.left - target.width;
                    top = host.top - target.height;
                }
                else if (placement === 'top-right') {
                    left = host.left + host.width;
                    top = host.top - target.height;
                }
                else if (placement === 'bottom-left') {
                    left = host.left - target.width;
                    top = host.top + host.height;
                }
                else if (placement === 'bottom-right') {
                    left = host.left + host.width;
                    top = host.top + host.height;
                }
                else if (placement === 'top-center') {
                    top = host.top - target.height;
                    let diff = (host.width / 2) - (target.width / 2);
                    left = host.left + diff;
                }
                else if (placement === 'left-center') {
                    left = host.left - target.width;
                    let diff = (host.height / 2) - (target.height / 2);
                    top = host.top + diff;
                }
                else if (placement === 'bottom-center') {
                    top = host.top + host.height;
                    let diff = (host.width / 2) - (target.width / 2);
                    left = host.left + diff;
                }
                else if (placement === 'right-center') {
                    left = host.left + host.width;
                    let diff = (host.height / 2) - (target.height / 2);
                    top = host.top + diff;
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
            }
            else {
                throw new TypeError(!angular.isElement(hostElm) && !angular.isElement(targetElm) ? 'hostELm and targetElm are not of the type angular.elmemnt' : (!angular.isElement(hostElm) ? 'hostELm is not of the type angular.elmemnt' : 'targetELm is not of the type angular.elmemnt'));
            }
        };

        
        this.positionTargetRelative = function(hostElm, targetElm, relativeTo, placement, offset) {
            if(angular.isElement(hostElm) && angular.isElement(targetElm) && angular.isElement(relativeTo)) {

                let host = this.relativeOffset(hostElm, relativeTo);
                let target = this.relativeOffset(targetElm, relativeTo);

                if(!host && !target)
                    throw new DOMException('hostElm and targetElm are not relative to ' + relativeTo[0].localName + '[class="' + relativeTo[0].classList.value + '"][id="' + relativeTo[0].id + '"]');
                else if(!host)
                    throw new DOMException('hostElm is not relative to ' + relativeTo[0].localName + '[class="' + relativeTo[0].classList.value + '"][id="' + relativeTo[0].id + '"]');
                else if(!target)
                    throw new DOMException('targetElm is not relative to ' + relativeTo[0].localName + '[class="' + relativeTo[0].classList.value + '"][id="' + relativeTo[0].id + '"]');


                let left = host.left;
                let top = host.top;

                if(host && target) {

                    if (placement === 'right') {
                        left += host.width;
                    }
                    else if (placement === 'bottom') {
                        top += host.height;
                    }
                    else if (placement === 'left') {
                        left -= target.width;
                    }
                    else if (placement === 'top') {
                        top -= target.height;
                    }
                    else if (placement === 'top-left') {
                        top -= target.height;
                        left -= target.width;
                    }
                    else if (placement === 'top-right') {
                        top -= target.height;
                        left += host.width;
                    }
                    else if (placement === 'bottom-left') {
                        top += host.height;
                        left -= target.width;
                    }
                    else if (placement === 'bottom-right') {
                        top += host.height;
                        left += host.width;
                    }
                    else if (placement === 'top-center') {
                        top -= target.height;
                        let diff = (host.width / 2) - (target.width / 2);
                        left += diff;
                    }
                    else if (placement === 'bottom-center') {
                        top += host.height;
                        let diff = (host.width / 2) - (target.width / 2);
                        left += diff;
                    }
                    else if (placement === 'left-center') {
                        left -= target.width;
                        let diff = (host.height / 2) - (target.height / 2);
                        top += diff;
                    }
                    else if (placement === 'right-center') {
                        left += host.width;
                        let diff = (host.height / 2) - (target.height / 2);
                        top += diff;
                    }

                    left += angular.isArray(offset) && offset.length > 0 && angular.isNumber(offset[0]) ? offset[0] : 0;
                    top += angular.isArray(offset) && offset.length > 1 && angular.isNumber(offset[1]) ? offset[1] : 0;


                    return {
                        left: left,
                        top: top
                    };
                }
            }
            else {
                if(!angular.isElement(hostElm) && !angular.isElement(targetElm) && !angular.isElement(relativeTo))
                    throw new TypeError('hostElm, targetElm, and relativeTo are not of type angular.element');
                else if(!angular.isElement(hostElm) && !angular.isElement(targetElm))
                    throw new TypeError('hostElm and targetElm are not of type angular.element');
                else if(!angular.isElement(hostElm) && !angular.isElement(relativeTo))
                    throw new TypeError('hostElm and relativeTo are not of type angular.element');
                else if(!angular.isElement(relativeTo) && !angular.isElement(targetElm))
                    throw new TypeError('relativeTo and targetElm are not of type angular.element');
                else if(!angular.isElement(hostElm))
                    throw new TypeError('hostElm is not of type angular.element');
                else if(!angular.isElement(targetElm))
                    throw new TypeError('targeetElm is not of type angular.element');
                else
                    throw new TypeError('relativeTo is not of type angular.element');

            }
        };

        this.positionTooltip = function(host, tip, container, placement, fallbackPlacements = ['left', 'right', 'top', 'bottom'], offset = [0, 0]) {
            function getArrowPos() {
                const ttOff = 6;
                const tooltipOff = [place === 'left' ? ttOff : (place === 'right' ? -ttOff : 0), place === 'top' ? ttOff : (place === 'bottom' ? -ttOff: 0)];

                const poOff = 0;
                const popoverOff = [place === 'left' ? poOff : (place === 'right' ? -poOff : 0), place === 'top' ? poOff : (place === 'bottom' ? -poOff: 0)];

                let plc = place + '-center';

                return this.positionTargetRelative(tip, arrow, tip, plc, isPopover ? popoverOff : tooltipOff);
            }

            function getTipPos() {
                const ttOff = 4;
                const tooltipOff = [place === 'left' ? -ttOff : (place === 'right' ? ttOff : 0), place === 'top' ? -ttOff : (place === 'bottom' ? ttOff: 0)];

                const poOff = 4;
                const popoverOff = [place === 'left' ? -poOff : (place === 'right' ? poOff : 0), place === 'top' ? -poOff : (place === 'bottom' ? poOff: 0)];

                let plc = place + '-center';

                return rel ?
                    this.positionTargetRelative(host, tip, rel, plc, isPopover ? popoverOff : tooltipOff) :
                    this.positionTarget(host, tip, plc, isPopover ? popoverOff : tooltipOff);
            }

            function getPlacementClass() {
                let lastPlcClass;

                if(place === 'left')
                    lastPlcClass = isPopover ? 'bs-popover-start' :  'bs-tooltip-start';

                else if(place === 'right')
                    lastPlcClass = isPopover ? 'bs-popover-end' : 'bs-tooltip-end';

                else if(place === 'top')
                    lastPlcClass = isPopover ? 'bs-popover-top' : 'bs-tooltip-top';

                else
                    lastPlcClass = isPopover ? 'bs-popover-bottom' :  'bs-tooltip-bottom';

                return lastPlcClass;
            }

            function positionLeftRight() {
                if(tipPos.left < coff.left) {

                    if (tip[0].offsetWidth <= coff.width) {
                        let diff = Math.abs(tipPos.left + coff.left);
                        tipPos.left += diff;
                        arrowPos.left -= diff;
                    }
                    else {
                        throw new DOMException('The tooltip element is too wide to fit in the container')
                    }
                }
                else if(tipPos.left + tip[0].offsetWidth > coff.left + coff.width) {
                    let left = ((tipPos.left + tip[0].offsetWidth) - (coff.left + coff.width));
                    if(tipPos.left - left >= coff.left) {
                        tipPos.left -= left;
                        arrowPos.left += left;
                    }
                    else {
                        throw new DOMException('The tooltip element is too wide to fit in the container')
                    }
                }
            }

            function positionTopBottom() {
                if(tipPos.top < coff.top) {
                    if(tip[0].offsetHeight <= coff.height) {
                        let diff = Math.abs(tipPos.top + coff.top);
                        tipPos.top = coff.top;
                        arrowPos.top -= diff;
                    }
                    else {
                        throw new DOMException('The tooltip element is too tall to fit in')
                    }
                }
                else if(tipPos.top + tip[0].offsetHeight > coff.top + coff.height) {
                    let top = ((tipPos.top + tip[0].offsetHeight) - (coff.top + coff.height));
                    if(tipPos.top - top >= 0) {
                        tipPos.top -= top;
                        arrowPos.top += top;
                    }
                    else {
                        throw new DOMException('The tooltip element is too tall to fit in');
                    }
                }
            }

            function isOutOfRange() {
                return (place === 'left' && tipPos.left < coff.left) ||
                    (place === 'right' && tipPos.left + tip[0].offsetWidth > coff.left + coff.width) ||
                    (place === 'top' && tipPos.top < coff.top) ||
                    (place === 'bottom' && tipPos.top + tip[0].offsetHeight > coff.top + coff.height);
            }

            function placeAtFallback() {
                let fp = fallbackPlacements.filter(x => /^(top|bottom|left|right)$/.test(x));
                let position = () => {
                    if(place === 'left' || place === 'right')
                        positionTopBottom();
                    else
                        positionLeftRight();
                };

                if(fp.length > 0) {
                    place = fb[0];
                    tipPos = getTipPos();
                    arrowPos = getArrowPos();

                    if(isOutOfRange()) {
                        if(fp.length > 1) {
                            place = fb[1];
                            tipPos = getTipPos();
                            arrowPos = getArrowPos();

                            if(isOutOfRange()) {
                                if(fp.length > 2) {
                                    place = fb[2];
                                    tipPos = getTipPos();
                                    arrowPos = getArrowPos();

                                    if(isOutOfRange) {
                                        if(fp.length > 3) {
                                            place = fb[3];
                                            tipPos = getTipPos();
                                            arrowPos = getArrowPos();

                                            if(isOutOfRange()) {
                                                throw new DOMException('Could not find suitable fallback placement');
                                            }
                                            else {
                                                position();
                                            }
                                        }
                                        else {
                                            throw new DOMException('Could not find suitable fallback placement');
                                        }
                                    }
                                    else {
                                        position();
                                    }
                                }
                                else {
                                    throw new DOMException('Could not find suitable fallback placement');
                                }
                            }
                            else {
                                position();
                            }
                        }
                        else {
                            throw new DOMException('Could not find suitable fallback placement');
                        }
                    }
                    else {
                        position();
                    }
                }
                else {
                    throw new DOMException('Could not find suitable fallback placement');
                }
            };

            let isPopover = tip.hasClass('popover');
            let place = /^(left|right|top|bottom)$/.test(placement) ? placement : (isPopover ? 'right' : 'top');


            let arrow = angular.element(tip[0].querySelector(isPopover ? '.popover-arrow' : '.tooltip-arrow'));
            let rel = $bs5DOM.findRelativeParent(container);
            let coff = rel ? this.relativeOffset(container, rel) : this.offset(container);

            let resize = null;
            let tipPos = getTipPos();
            let arrowPos = getTipPos();

            if(angular.isArray(offset) && offset.length === 2 && angular.isNumber(offset[0]) && angular.isNumber(offset[1])) {
                tipPos.left += offset[0];
                tipPos.top += offset[1];
            }

            if(isOutOfRange()) {
                placeAtFallback();
            }

            return {tip: tipPos, arrow: arrowPos, placementClass: getPlacementClass()};
        };
    }])

    
    .service('$bs5DOM', ['$q', function($q) {

        
        this.findRelativeParent = function(elm) {
            let r = null;
            if(elm instanceof angular.element) {
                let node = elm;
                let style = window.getComputedStyle(node[0]);

                while(style.position !== 'relative' && node.length) {
                    node = node.parent();
                    style = window.getComputedStyle(node[0]);
                }

                r = node.length ? node : null;
            }

            return r;
        };

        
        this.contains = function(elm, container) {
            let node = elm;

            while(node[0] !== container[0] && node.length) {
                node = node.parent();
            }

            return !!node.length;
        };

        
        this.fade = function(elm, from= 0, to = 1,  duration= 300) {
            return $q(function(r, j) {
                if(!angular.isElement(elm)) {
                    j(TypeError('Parameter elm is not of type angular.element'));
                }
                else {
                    elm[0].animate([
                        {opacity: from},
                        {opacity: to}
                    ], {
                        duration: duration,
                        easing: 'linear',
                        iterations: 1,
                        direction: 'normal',
                        fill: 'forwards',
                        delay: 0,
                        endDelay: 0
                    }).onfinish = r;
                }
            });
        };

        
        this.slide = function(elm, from = 0, to = 1, horizontal = false, duration = 300) {
            return $q(function(r, j) {
                if(!angular.isElement(elm)) {
                    j(TypeError('Parameter elm is not of type angular.element'));
                }
                else {
                    elm.css('transform-origin', 'top left');
                    elm[0].animate([
                        horizontal ? {transform: 'scaleX(' + from + ')'} : {transform: 'scaleY(' + from + ')'},
                        horizontal ? {transform:'scaleX(' + to + ')'} : {transform: 'scaleY(' + to + ')'}
                    ], {
                        duration: duration,
                        easing: 'linear',
                        iterations: 1,
                        direction: 'normal',
                        fill: 'forwards',
                        delay: 0,
                        endDelay: 0
                    }).onfinish = r;
                }
            });
        };
    }]);


angular.module('bs5.forms', ['bs5.position'])


    .directive('bs5FormErrors', ['$bs5Position', '$timeout', '$q', function($bs5Position, $timeout, $q) {
        return {
            require: ['^^form', 'ngModel'],
            restrict: 'A',
            scope: {
                messages: '=bs5FormErrors',
                showOnTouched: '=?',
                showOnDirty: '=?'
            },
            link: function(scope, elm,  attrs, ctrls) {
                let model = ctrls[1];
                let form = ctrls[0];


                model.$overrideModelOptions({updateOn: 'blur input', debounce: {
                        blur: 0,
                        input: 0
                    }
                });

                function watch() {
                    angular.forEach(errors.find('div'), function (div) {
                        div.remove();
                    });

                    let count = 0;
                    for (let p in model.$error) {
                        if ((form.$submitted || (scope.showOnTouched && model.$touched) || (scope.showOnDirty && model.$dirty)) && scope.messages[p] && model.$invalid && model.$error[p]) {
                            errors.append(angular.element('<div>' + scope.messages[p] + '</div>'));
                            count++;
                        }
                    }

                    if (count) {
                        if(elm.next() !== errors)
                            elm.after(errors);
                    }
                    else {
                        errors.remove();
                    }
                };

                elm.on('blur', function() {
                    model.$setTouched();
                    watch();
                });

                elm.on('input', function() {
                    model.$setDirty();
                    watch();
                });

                let p = elm.parent();
                while(p.prop('tagName') !== 'FORM') {
                    p = p.parent();
                }

                p.on('submit', function() {
                    form.$setSubmitted();
                    watch();
                });


                let errors = angular.element('<div class="text-danger ps-3 mt-1"></div>');
                errors.css('font-size', '8pt');

                scope.$watch(() => !(form.$submitted || (scope.showOnTouched && model.$touched) || (scope.showOnDirty && model.$dirty)), function(value) {
                    if(value) {
                        errors.remove();
                    };
                });
            }
        }
    }]);


angular.module('bs5.modal', ['bs5.dom'])

    
    .service('$bs5Modal', ['$templateCache', '$controller', '$compile', '$rootScope', '$q', '$document', '$http', '$bs5DOM', '$$stack', '$$backdrop', function($templateCache, $controller, $compile, $rootScope, $q, $document, $http, $bs5DOM, $$stack, $$backdrop) {
        return function(options) {

            function show(onShown) {
                if(container[0] === document.body && $$backdrop.isOpen()) {
                    $$backdrop.prepend(elm);
                }
                else {
                    container.append(elm);
                }

                elm.css('display', 'block');
                $bs5DOM.fade(elm).then(angular.isFunction(onShown) ? onShown : angular.noop);
            }

            function hide(onHidden) {
                $bs5DOM.fade(elm, 1, 0).then(function() {
                    elm.remove();

                    if(angular.isFunction(onHidden))
                        onHidden();
                });
            }

            function close(data) {
                $$stack.pop();

                if(options.backdrop && !$$stack.hasBackdrop())
                    $$backdrop.close();

                modalDeferred.resolve(data);
                hide();

                let prevModal = stack.peek();
                if (prevModal)
                    prevModal.show();
            };

            function dismiss(reason) {
                $$stack.pop();

                if(options.backdrop && !$$stack.hasBackdrop())
                    $$backdrop.close();

                modalDeferred.reject(reason);
                hide();

                let prevModal = stack.peek();
                if (prevModal)
                    prevModal.show();
            };

            let defaults = {
                backdrop: false,
                size: null,
                centered: false,
                scrollable: false,
                container: 'body'
            };

            options = angular.extend({}, defaults, options);

            let container = angular.element(document.querySelector(options.container));

            if(!(container instanceof angular.element) || !container.length)
                throw new DOMException('$bs5Modal: The specified container was not found');

            let contentDeferred = $q.defer();
            let modalDeferred = $q.defer();
            let modal = null;

            if(angular.isString(options.templateUrl)) {
                $http({
                    method: 'GET',
                    url: options.templateUrl
                }).then(function(r) { contentDeferred.resolve(r.data); }, function() { contentDeferred.resolve($templateCache.get(options.templateUrl)); });
            }
            else if(angular.isString(options.template)) {
                contentDeferred.resolve(options.template);
            }
            else {
                throw new ReferenceError("Must provide either option template as an html template or option templateUrl as a url or the to an angular script template");
            }

            let windowScope = $rootScope.$new();
            let contentScope = windowScope.$new();

            windowScope.size = options.size;
            windowScope.centered = options.centered;
            windowScope.scrollable = options.scrollable;

            contentScope.modal = {
                promise: modalDeferred.promise,
                close: close,
                dismiss: dismiss
            }

            let elm = angular.element(
                '<div class="modal fade show">' +
                '<div class="modal-dialog {{size ? \'modal-\' + size : \'\'}}" ng-class="{\'modal-dialog-centered\': centered, \'modal-dialog-scrollable\': scrollable}">' +
                '<div class="modal-content"></div>' +
                '</div>' +
                '</div>'
            );

            $compile(elm)(windowScope);

            let content = angular.element(elm[0].querySelector('.modal-content'));

            contentDeferred.promise.then(function(html) {
                content.html(html);

                if(angular.isString(options.controller) || angular.isFunction(options.controller) || angular.isArray(options.controller)) {
                    let ctrl = $controller(options.controller, {$scope: contentScope});
                    ctrl = ctrl();

                    if(angular.isFunction(ctrl.$onInit))
                        ctrl.$onInit();
                }

                $compile(content)(contentScope);

                $$stack.push({
                    show: show,
                    hide: hide,
                    close: function(data) {
                        modalDeferred.resolve(data);
                        hide();
                    },
                    dismiss: function(reason) {
                        modalDeferred.reject(reason);
                        hide();
                    },
                    hasBackdrop: options.backdrop
                });

                if(!$$backdrop.isopen() && options.backdrop)
                    $$backdrop.open();

                let peek = $$stack.peek();
                if(peek) {
                    peek.hide(show);
                }
                else {
                    show();
                }
            });

            return {result: contentScope.modal.promise, close: close, dismiss: dismiss};

        }
    }])

    .service('$$backdrop', ['$$stack', '$bs5DOM', function($$stack, $bs5DOM) {
        let backdrop = angular.element('<div class="modal-backdrop fade show"></div>');

        let $body = angular.element(document.body);

        this.open = function() {
            $body.append(backdrop);
            $bsDOM.fade(backDrop, 0, 0.5);
            $body.addClass('modal-open');
        }

        this.close = function() {
            $bs5DOM(backdrop, 0.5, 0).then(function() {
                backdrop.remove();
            });

            $body.removeClass('modal-open');
        }

        this.isOpen =  function() {
            return $body.hasClass('modal-open');
        }

        this.prepend = function(modal) {
            backdrop.prepend(modal);
        }

        backdrop.on('click', function() {
            let modal;
            for(modal = $$stack.pop(); !modal.hasBackdrop(); modal = $$stack.pop()) {
                modal.dismiss('backdrop-clicked');
            }

            modal.dismiss('backdrop-clicked');

            if(!$$stack.hasBackdrop())
                this.close();

            let peek;
            if((peek = $$stack.peek()))
                peek.show();
        });

    }])

    .service('$$stack', ['$$backdrop', function($$backdrop) {
        let stack = [];

        this.push = function(modal) {
            stack.push(modal);
        }

        this.peek = function() {
            return stack.length ?  stack[stack.length - 1] : null;
        }

        this.pop = function() {
            let r = this.peek();

            if(r)
                stack.pop();

            return r;
        }

        this.hasBackdrop = function() {
            return !!stack.find(x => x.hasBackdrop);
        }

        this.size = function() {

        }

    }]);



angular.module('bs5.pagination', [])

    .constant('bs5PaginationConfig', {
        pageSize: 10,
        displayPagesRange: 5,
        firstPageText: 'First',
        previousPageText: 'Previous',
        nextPageText: 'Next',
        lastPageText: 'Last',
        withFirstLast: true,
        withPreviousNext: true,
        size: null,
        align: 'left'
    })

    
    .directive('bs5Pagination', ['bs5PaginationConfig', function(bs5PaginationConfig) {
        function range(p, q) {
            let ret = [];
            if(p <= q) {
                for(let i = p; i <= q; i++)
                    ret.push(i);
            }

            return ret;
        }

        return {
            restrict: 'E',
            replace: true,
            scope: {
                pageChange: '&?',
                currentPage: '=',
                numberItems: '=',
                pageSize: '=?',
            },
            templateUrl: function(elm, attrs) {
                return attrs.templateUrl || 'angular/bootstrap5/templates/pagination/pagination.html';
            },
            link: function(scope, elm, attrs) {
                function getStartEndRange() {
                    let start = null;
                    let end = null;

                    if(!scope.pages.length) {
                        if(pageRange + 1 >= scope.numberPages) {
                            start = 1;
                            end = scope.numberPages;
                        }
                        else if(scope.currnetPage - pageRange < 1) {
                            start = 1;
                            end = start + pageRange;
                        }
                        else if (scope.currentPage + pageRange > scope.numberPages){
                            end = scope.numberPages;
                            start = end - pageRange;
                        }
                        else {
                            start = scope.currentPage;
                            end = start + pageRange;
                        }
                    }
                    else {
                        if(pageRange + 1 >= scope.numberPages) {
                            start = 1;
                            end = scope.numberPages;
                        }
                        else if((scope.currentPage === scope.pages[scope.pages.length - 1] || scope.currentPage === scope.pages[scope.pages.length - 1] + 1) && scope.currentPage < scope.numberPages) {
                            start = scope.currentPage;

                            if(start + pageRange >= scope.numberPages) {
                                end = scope.numberPages;
                                start = end - pageRange;
                            }
                            else {
                                end = start + pageRange;
                            }
                        }
                        else if((scope.currentPage === scope.pages[0] || scope.currentPage === scope.pages[0] - 1) && scope.currentPage > 1) {
                            end = scope.currentPage;

                            if(end - pageRange <= 1) {
                                start = 1;
                                end = start + pageRange;
                            }
                            else {
                                start = end - pageRange;
                            }
                        }
                        else if(scope.currentPage === 1) {
                            start = 1;
                            end = start + pageRange;
                        }
                        else if(scope.currentPage === scope.numberPages) {
                            end = scope.numberPages;
                            start = end - pageRange;
                        }
                    }

                    return {
                        start: start,
                        end: end
                    }
                };


                let pageRange = scope.$eval(attrs.displayPagesRange);
                pageRange = (angular.isNumber(pageRange) ? pageRange : bs5PaginationConfig.displayPagesRange) - 1;

                scope.pageRange = pageRange;
                scope.withFirstLast = attrs.withFirstLast === 'true' || attrs.withFirstLast === 'false' ? scope.$eval(attrs.withFirstLast) : bs5PaginationConfig.withFirstLast;
                scope.withPreviousNext = attrs.withPreviousNext === 'true' || attrs.withPreviousNext === 'false' ? scope.$eval(attrs.withPreviousNext) : bs5PaginationConfig.withPreviousNext;
                scope.pageSize = scope.pageSize || bs5PaginationConfig.pageSize;
                scope.firstPageText = attrs.firstPageText || bs5PaginationConfig.firstPageText;
                scope.previousPageText = attrs.previousPageText || bs5PaginationConfig.previousPageText;
                scope.nextPageText = attrs.nextPageText || bs5PaginationConfig.nextPageText;
                scope.lastPageText = attrs.lastPageText || bs5PaginationConfig.lastPageText;
                scope.size = attrs.size || bs5PaginationConfig.size;
                scope.align = attrs.align || bs5PaginationConfig.align;
                scope.numberPages = Math.ceil(scope.numberItems / scope.pageSize);
                scope.pages = [];

                scope.$watch('numberItems', function(value, old) {
                    if(value !== old) {
                        scope.numberPages = Math.ceil(scope.numberItems / scope.pageSize);

                        if(scope.currrentPage > scope.numberPages) {
                            scope.pages = [];
                            scope.currentPage = scope.numberPages;
                        }
                        else if(scope.pageChange) {
                            scope.pageChange({$page: scope.currentPage, $pageSize: scope.pageSize});
                        }
                    }
                });

                scope.$watch('pageSize', function(value, old) {
                    if(value !== old) {
                        scope.numberPages = Math.ceil(scope.numberItems / scope.pageSize);


                        if(scope.currrentPage > scope.numberPages) {
                            scope.pages = [];
                            scope.currentPage = scope.numberPages;
                        }
                        else if(scope.pageChange) {
                            scope.pageChange({$page: scope.currentPage, $pageSize: scope.pageSize});
                        }
                    }
                });

                scope.$watch('currentPage', function(value, old) {
                    if(value !== old) {

                        if(scope.currentPage === scope.pages[0] || scope.currentPage === scope.pages[0] - 1 || scope.currentPage === scope.pages[scope.pages.length - 1] || scope.currentPage === scope.pages[scope.pages.length - 1] + 1 || scope.currentPage === 1 || scope.currentPage === scope.numberPages || !scope.pages.length) {
                            let r = getStartEndRange();
                            scope.pages = range(r.start, r.end);
                        }

                        if(scope.pageChange)
                            scope.pageChange({$page: scope.currentPage, $pageSize: scope.pageSize});
                    }
                });

                scope.changePage = function(page, evt) {
                    evt.preventDefault();

                    scope.currentPage = page;
                };

                let rng = getStartEndRange();
                scope.pages = range(rng.start, rng.end);
            }
        };
    }])

    .run(['$templateCache', function($templateCache) {
        $templateCache.put(
            'angular/bootstrap5/templates/pagination/pagination.html',
            '<nav>' +
            '<ul class="pagination {{size === \'lg\' || size === \'sm\' ? \'pagination-\' + size : \'\'}}" ng-class="{\'justify-content-center\': align === \'center\', \'justify-content-end\': align === \'right\'}">' +
            '<li class="page-item" ng-if="withFirstLast && numberPages > pageRange + 1" ng-disabled="currentPage <= 1" ng-class="{disabled: currentPage <= 1}">' +
            '<a class="page-link" href="#" ng-click="changePage(1, $event)">{{firstPageText}}</a>' +
            '</li>' +
            '<li class="page-item" ng-if="withPreviousNext" ng-disabled="currentPage <= 1" ng-class="{disabled: currentPage <= 1}">' +
            '<a class="page-link" href="#" ng-click="changePage(currentPage - 1, $event)">{{previousPageText}}</a>' +
            '</li>' +
            '<li class="page-item" ng-repeat-start="page in pages" ng-if="page !== currentPage"">' +
            '<a class="page-link" href="#" ng-click="changePage(page, $event)">{{page}}</a>' +
            '</li>' +
            '<li class="page-item active" ng-repeat-end ng-if="page === currentPage">' +
            '<a class="page-link" href="#" ng-click="$event.preventDefault()">{{page}}</a>' +
            '</li>' +
            '<li class="page-item" ng-if="withPreviousNext" ng-disabled="currentPage >= numberPages" ng-class="{disabled: currentPage >= numberPages}">' +
            '<a class="page-link" href="#" ng-click="changePage(currentPage + 1, $event)">{{nextPageText}}</a>' +
            '</li>' +
            '<li class="page-item" ng-if="withFirstLast && numberPages > pageRange + 1" ng-disabled="currentPage >= numberPages" ng-class="{disabled: currentPage >= numberPages}">' +
            '<a class="page-link" href="#" ng-click="changePage(numberPages, $event)">{{lastPageText}}</a>' +
            '</li>' +
            '</ul>' +
            '</nav>'
        );
    }]);


angular.module('bs5.popover', ['bs5.dom'])

    
    .directive('bs5Popover', ['$templateCache', '$document', '$compile', '$http', '$q', '$timeout', '$bs5Position', '$bs5DOM', '$controller', function($templateCache, $document, $compile, $http, $q, $timeout, $bs5Position, $bs5DOM, $controller) {

        return {
            restrict: 'A',
            scope: {
                onLoad: '&?handler'
            },
            link: function(scope, elm, attrs) {
                let deferred = $q.defer();

                let animate = angular.isDefined(attrs.animate) ? scope.$eval(attrs.animate) : true;
                let delay = scope.$eval(attrs.delay);
                let html = attrs.html ? scope.$eval(attrs.html) : false;
                let placement = attrs.placement === 'left' || attrs.placement === 'top' || attrs.placement === 'bottom' ? attrs.placement : 'right';
                let title = attrs.title || '';
                let trigger = attrs.trigger === 'focus' || attrs.trigger === 'hover' ? attrs.trigger : 'click';
                let off = scope.$eval(attrs.offset) || [0, 0];
                off = angular.isArray(off) && off.length > 1 && angular.isNumber(off[0]) && angular.isNumber(off[1]) ? off : [0, 0];
                let fp = attrs.fallbackPlacements || ['left', 'right', 'top', 'bottom'];
                let container = attrs.container ? angular.element(document.querySelector(attrs.container)) : angular.element(document.body);


                if(attrs.templateUrl) {
                    $http({
                        url: attrs.templateUrl,
                        method: 'GET'
                    }).then(function(r) {
                        html = true;
                        deferred.resolve(r.data);
                    }, function() {
                        deferred.resolve(attrs.bs5Popover);
                        elm.removeAttr('template-url');
                    });
                }
                else {
                    deferred.resolve(attrs.bs5Popover);
                }

                deferred.promise.then(function(content) {
                    let def = $q.defer();

                    let popoverTmp = $templateCache.get('angular/bootstrap5/templates/popover/popover.html');
                    if(attrs.popoverTemplateUrl) {
                        $http({
                            url: attrs.popoverTemplateUrl,
                            method: 'GET'
                        }).then(function(r) {
                            def.resolve(r.data);
                        }, function() {
                            def.resolve(popoverTmp);
                        });
                    }
                    else {
                        def.resolve(popoverTmp);
                    }

                    def.promise.then(function(tpl) {
                        let tplEl = angular.element(tpl);
                        let body = angular.element(tplEl[0].querySelector('.popover-body'));
                        html ? body.html(content) : body.text(content);

                        scope.$watch(function() { return elm.attr('bs5-popover'); }, function($new, $old) {
                            if($old !== $new && !elm.attr('template-url'))
                                html ? body.html(elm.attr('bs5-popover')) : body.text(elm.attr('bs5-popover'));
                        });

                        let Popover = function(popoverEl) {
                            let self = this;
                            let el = null;

                            let s = scope.$new();
                            s.title = title;

                            let deferred = $q.defer();
                            s.deferred = deferred;

                            scope.$watch(function() { return elm.attr('title'); },  function($new, $old) {
                                if($new !== $old) {
                                    s.title = elm.attr('title');
                                }
                            });

                            this.show = function() {
                                $timeout(function() {
                                    el = angular.copy(popoverEl);

                                    s.popover = this;

                                    s.close = function(data) {
                                        s.popover.hide();
                                        s.deferred.resolve(data);
                                    }

                                    s.dismiss = function(reason) {
                                        s.popover.hide();
                                        s.deferred.reject(reason);
                                    }

                                    $compile(el)(s);

                                    if(attrs.popoverController) {
                                        let ctrl = $controller(attrs.popoverController, {$scope: s});

                                        if(angular.isFunction(ctrl.$onInit))
                                            ctrl.$onInit();
                                    }


                                    $timeout(function () {

                                        el.css({
                                            'position': 'absolute',
                                            'opacity': animate ? 0 : 1,
                                            'z-index': 9999
                                        });

                                        container.append(el);

                                        $timeout(function () {
                                            try {
                                                let position = $bs5Position.positionTooltip(elm, el, container, placement, fp, off);

                                                el.addClass(position.placementClass);
                                                el.css({
                                                    left: position.tip.left + 'px',
                                                    top: position.tip.top + 'px'
                                                });

                                                angular.element(el[0].querySelector('.popover-arrow')).css({
                                                    position: 'absolute',
                                                    left: position.arrow.left + 'px',
                                                    top: position.arrow.top + 'px'
                                                })

                                                if (animate) {
                                                    $bs5DOM.fade(elm);
                                                }

                                                if (scope.onLoad) {
                                                    scope.onLoad({$promise: deferred.promise});
                                                }
                                            }
                                            catch(ex) {
                                                el.remove();
                                                el = null;

                                                throw ex;
                                            }
                                        });
                                    });
                                }, angular.isObject(delay) ? (angular.isNumber(delay.show) ? delay.show : 0) : (angular.isNumber(delay) ? delay : 0));
                            };

                            this.hide = function() {
                                let removeEl = function () {
                                    el.remove();
                                    el = null;
                                };
                                if (el) {
                                    $timeout(function() {
                                        if (animate) {
                                            $bs5DOM.fade(elm, 1, 0).then(removeEl);
                                        } else {
                                            removeEl();
                                        }
                                    }, angular.isObject(delay) ? (angular.isNumber(delay.hide) ? delay.hide : 0) : (angular.isNumber(delay) ? delay : 0));
                                }
                            };

                            this.toggle = function() {
                                if(el)
                                    this.hide();
                                else
                                    this.show();
                            };
                        };

                        let popover = new Popover(tplEl);


                        if(trigger === 'hover') {
                            elm.on('mouseenter', function() {
                                popover.show();
                            });

                            elm.on('mouseleave', function() {
                                popover.hide();
                            });
                        }
                        else if(trigger === 'focus') {
                            elm.on('focus', function() {
                                popover.show();
                            });

                            elm.on('blur', function() {
                                popover.hide();
                            });
                        }
                        else {
                            elm.on('click', function() {
                                popover.toggle();
                            });
                        }
                    });
                });
            }
        };
    }])

    .run(['$templateCache', function($templateCache) {
        $templateCache.put(
            'angular/bootstrap5/templates/popover/popover.html',
            '<div class="popover fade show">' +
            '<div class="popover-arrow"></div>' +
            '<div class="popover-header">{{title}}</div>' +
            '<div class="popover-body"></div>' +
            '</div>'
        );
    }]);


angular.module('bs5.progressbar', [])

    
    .directive('bs5Progressbar', ['$animate', '$injector', function($animate, $injector) {
        let $animateCss = $injector.has('$animateCss') ? $injector.get('$animateCss') : null;

        return {
            restrict: 'E',
            replace: true,
            scope: {
                value: '=',
                displayPercent: '=?',
                showStatus: '=?',
                showCount: '=?',
                statusText: '@?',
                countCompleted: '=?',
                countTotal: '=?',
                countType: '@'
            },
            templateUrl: function(elm, attrs) {
                return attrs.templateUrl || 'angular/bootstrap5/templates/progressbar/progressbar.html';
            },
            link: function(scope, elm, attrs) {
                scope.type = attrs.type ? attrs.type : null;
                scope.striped =  !!scope.$eval(attrs.striped);
                scope.animate = !!scope.$eval(attrs.animate) && scope.striped;

                if(scope.value < 0)
                    scope.value = 0;
                else if(scope.value > 100)
                    scope.value = 100;
                let old = scope.value;

                scope.$watch('value', function($new, $old) {
                    if(!angular.equals($new, $old) && angular.isDefined($old)) {
                        if($new < 0)
                            scope.value = 0;
                        else if($new > 100)
                            scope.value = 100;


                        elm[0].querySelector('.progress-bar').animate([
                            {width: $old + 'px'},
                            {width: $new + 'px'}
                        ], {
                            duration: 300,
                            easing: 'linear',
                            iterations: 1,
                            direction: 'normal',
                            fill: 'forwards',
                            delay: 0,
                            endDelay: 0
                        });
                    }
                });
            }
        }
    }])

    .run(['$templateCache', function($templateCache) {
        $templateCache.put(
            'angular/bootstrap5/templates/progressbar/progressbar.html',
            '<div class="progress">' +
                '<div class="progress-bar {{type ? \'bg-\' + type : \'\'}}" ng-class="{\'progress-bar-striped\': striped, \'progress-bar-animated\': animate}" style="width: {{value}}%" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="100">' +
                    '<span ng-if="displayPercent">{{value}}%</span>' +
                '</div>' +
            '</div>'
        );
    }]);


angular.module('bs5.rating', [])

    
    .directive('bs5Rating', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                readonly: '=?',
                onRatingChange: '&?',
                color: '@?'
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
    .run(['$templateCache', function($templateCache) {
        $templateCache.put(
            'angular/bootstrap5/templates/rating/rating.html',
            '<i class="bi {{$index < value ? stateOnIcon : stateOffIcon}}" ng-style="{cursor: readonly ? \'inheriit\' : \'pointer\', color: color || \'inherit\', font-size: size || \'inherit\'}" ng-repeat="r in range" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" ng-mouseleave="leave()"></i>'
        );
    }]);


angular.module('bs5.tabs', ['bs5.dom'])

    
    .controller('Bs5TabsetController', ['$scope', function($scope) {
        let ctrl = this;
        let ndx = null;
        ctrl.tabs = [];

        
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

        
        ctrl.addTab = function(tab) {
            ctrl.tabs.push(tab);

            let index = ctrl.findTabIndex(tab);

            if(!angular.isNumber(ctrl.active)) {
                ctrl.select(0);
            }
        }


        
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

    
    .directive('bs5Tabset', function() {
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


angular.module('bs5.tooltip', ['bs5.dom'])

    
    .directive('bs5Tooltip', ['$templateCache', '$document', '$compile', '$http', '$q', '$bs5Position', '$bs5DOM', '$timeout', function($templateCache, $document, $compile, $http, $q, $bs5Position, $bs5DOM, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                let deferred = $q.defer();
                let offset = /^\[ *?\d+?, *?\d+? *?\]$/.test(attrs.offset) ? scope.$eval(attrs.offset) : [0, 0];
                let delay = $scope.$eval(attrs.delay);
                let animate = scope.$eval(attrs.animate);
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
                    let tooltipTpl = $templateCache.get('angular/bootstrap5/templates/tooltip/tooltip.html');

                    if(attrs.tooltipTemplateUrl) {
                        $http({
                            url: attrs.tooltipTemplateUrl,
                            method: 'GET'
                        }).then(function(r) {
                            def.resolve(r.data);
                        }, function() {
                            def.resolve(tooltipTpl);
                        });
                    }
                    else {
                        def.resolve(tooltipTpl);
                    }

                    def.promise.then(function(tpl) {
                        let Tooltip = function(tooltipEl) {
                            let self = this;
                            let el = null;

                            this.show = function() {

                                $timeout(function() {

                                    el.css({
                                        'position': 'absolute',
                                        'z-index': 9999
                                    });

                                    container.append(el);

                                    $timeout(function(){
                                        try {
                                            let position = $bs5Position.positionTooltip(elm, el, placement, fp, offset);

                                            el.css({
                                                'left': position.tip.left,
                                                'top': position.tip.top
                                            });

                                            angular.element(el[0].querySelector('.tooltip-arrow')).css({
                                                position: 'absolute',
                                                left: position.arrow.left + 'px',
                                                top: position.arrow.top + 'px'
                                            });

                                            if (animate) {
                                                $bs5DOM.fade(el);
                                            }
                                        }
                                        catch(ex) {
                                            el.remove();
                                            el  = null;
                                            console.error(ex);
                                        }
                                    });

                                }, angular.isObject(delay) ? (angular.isNumber(delay.show) ? delay.show : 0) : (angular.isNumber(delay) ? delay : 0));
                            };

                            this.hide = function() {
                                let removeEl = function() {
                                    el.remove();
                                    el = null;
                                };

                                if(el) {
                                    $timeout(function() {
                                        if (animate) {
                                            $bs5DOM.fade(el, 1, 0).then(removeEl);
                                        }
                                        else {
                                            removeEl();
                                        }
                                    }, angular.isObject(delay) ? (angular.isNumber(delay.hide) ? delay.hide : 0) : (angular.isNumber(delay) ? delay : 0));
                                }
                            };

                            this.toggle = function() {
                                if(el)
                                    self.hide();
                                else
                                    self.show();
                            };
                        };

                        let tplEl = angular.element(tpl);
                        tplEl.css('max-width', '200px');
                        let body = angular.element(tplEl[0].querySelector('.tooltip-inner'))
                        html ? body.html(content) : body.text(content);

                        let tooltip = new Tooltip(tplEl);

                        if(attrs.trigger === 'click') {
                            elm.on('click', function() {
                                tooltip.toggle();
                            });
                        }
                        else if(attrs.trigger === 'focus') {
                            elm.on('focus', function() {
                                tooltip.show();
                            });

                            elm.on('blur', function() {
                                tooltip.hide();
                            });
                        }
                        else {
                            elm.on('mouseenter', function() {
                                tooltip.show();
                            });

                            elm.on('mouseleave', function() {
                                tooltip.hide();
                            });
                        }
                    });
                });
            }
        };
    }])

    .run(['$templateCache', function($templateCache) {
        $templateCache.put(
            'angular/bootstrap5/templates/tooltip/tooltip.html',
            '<div class="tooltip fade show">' +
            '<div class="tooltip-arrow"></div>' +
            '<div class="tooltip-inner"></div>' +
            '</div>'
        );
    }]);

