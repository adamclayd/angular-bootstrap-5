/**
 * Module: ns5.datepicker
 */
angular.module('bs5.datepicker', ['bs5.dom'])

    /**
     * Directive: bs5Datepicker
     *
     * A bootstrap 5 date picker that can be applied to  a date type input box
     *
     * Requires:
     * 		input[date]
     * 		ngModel
     *
     * Attributes:
     *
     * 		min-date: 		<Date> all dates before this day will be disabled
     *
     * 		max-date: 		<Date> all dates after this day will be disabled
     */
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

    /**
     * Constant: bs5MonthNames
     */
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

    /**
     * Directive: bs5DatepickerCalendar
     *
     * The actual date picker that appears under the input box
     * (not for public use)
     */
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

    /**
     * Datepicker Template
     */
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