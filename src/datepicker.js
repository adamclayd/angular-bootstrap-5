/**
 * @ngdoc module
 * @name bs5.datepicker
 */
angular.module('bs5.datepicker', ['bs5.dom'])

    /**
     * @ngdoc directive
     * @name datepicker
     * @module bs5.datepicker
     *
     * @restrict E
     *
     * @param {Date} [minDate=null]
     * The minimum date that the user can pick as an integer string or as a valid date string.
     *
     * @param {Date} [maxDate=null]
     * The maximum date that the user can pick as an integer string or as a valid date string.
     *
     * @param {string} [name]
     * The name of the form control
     *
     * @param {string} [size]
     * The size of the disabled input. Valid values are 'sm' or 'lg'
     *
     * @param {Date} ngModel
     *
     * @description
     * Bootstrap 5 Datepicker
     */
    .directive('bs5Datepicker', ['$bs5Position', '$bs5DOM', '$timeout', function($bs5Position, $bs5DOM, $timeout) {
        return {
            restrict: 'E',
            transclude: false,
            templateUrl: 'templates/bs5/datepicker/calendar.html',
            require: ['ngModel', '?^^form'],
            scope: {
                ngModel: '=',
                maxDate: '=?',
                minDate: '=?'
            },
            link: function(scope, elm, attrs, ctrls) {
                let model = ctrls[1];
                let form = ctrls[2];
                if(attrs.name)
                    model.$name = attrs.name;

                if(form)
                    form.$addControl(model);

                let input = angular.element(elm[0].querySelector('input'));
                let calendar = angular.element(elm[0].querySelector('.calendar'));
                let ref = getDate(scope.ngModel) || new Date();
                let isOpen = false;

                scope.months = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ];

                scope.years = [];
                for(let i = 1900; i <= 2200; i++) {
                    scope.years.push(i);
                }

                function getDate(date) {
                    date = parseInt(date) ? parseInt(date) : date;
                    date = date ? new Date(date) : null;
                    return date && !isNaN(date) ? date : null;
                }

                function showCalendar() {
                    function setCell(i, j) {
                        scope.calendar[i][j].number = day;
                        scope.calendar[i][j].date = angular.copy(ref);
                        scope.calendar[i][j].selected =  scope.ngModel.getTime() === scope.calendar[i][j].date.getTime();
                    }

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

                    let month = ref.getMonth();
                    let year = ref.getFullYear();
                    let day = 1;
                    ref.setDate(day);
                    ref.setHours(0, 0, 0, 0);


                    let brake = false;

                    for(let i = 0; i < scope.calendar.length && day <= 31; i++) {
                        for(let j = ref.getDay(); j < scope.calendar[i].length && day <= 31 && !brake; j++) {
                            setCell(i, j);
                            day++;
                            ref.setDate(day);
                            ref.setHours(0, 0, 0, 0);

                            if(ref.getMonth() !== month)
                                brake = true;
                        }
                    }

                    ref.setFullYear(year, month, 1);
                    ref.setHours(0, 0, 0, 0);

                    scope.month = month;
                    scope.year = year;
                }

                scope.$watch('minDate', function(date, old) {

                    if(!angular.equals(date, old)) {
                        scope.minDate = getDate(date);
                        scope.minDate.setHours(0, 0, 0, 0);
                    }
                });

                scope.$watch('maxDate', function(date, old) {
                    if(!angular.equals(date, old)) {
                        scope.maxDate = getDate(date);
                        scope.maxDate.setHours(23, 59, 59, 999);
                    }
                });

                scope.$watch('maxDate', function(date, old) {
                    if(!angular.equals(date, old)) {
                        scope.maxDate = getDate(date);
                        scope.maxDate.setHours(23, 59, 59, 999);
                    }
                });

                scope.$watch('ngModel', function(date, old) {
                    if(!angular.equals(date, old)) {
                        scope.ngModel = getDate(date);
                        scope.ngModel.setHours(23, 59, 59, 999);
                    }
                });

                attrs.$observe('size',  function(sz) {
                    scope.size = /^(sm|lg)$/.test(sz) ? sz : null;
                });

                scope.ngModel = getDate(scope.ngModel);

                scope.changeMonth = function() {
                    if(ref) {
                        ref.setMonth(scope.month);
                        showCalendar();
                    }
                }

                scope.changeYear = function() {
                    if(ref) {
                        ref.setFullYear(scope.year);
                        showCalendar();
                    }
                }

                scope.previousMonth = function() {
                    if(ref) {
                        ref.setMonth(ref.getMonth() - 1);
                        scope.year = ref.getFullYear();
                        scope.month = ref.getMonth();

                        showCalendar();
                    }
                }

                scope.nextMonth = function() {
                    if(ref) {
                        ref.setMonth(ref.getMonth() + 1);
                        scope.year = ref.getFullYear();
                        scope.month = ref.getMonth();

                        showCalendar();
                    }
                }

                scope.open = function() {
                    if(!isOpen) {
                        calendar.removeClass('d-none');
                        $bs5DOM.fade(calendar);
                        isOpen = true;
                    }
                }

                scope.close = function() {
                    if (isOpen) {
                        $bs5DOM.fade(calendar, () => calendar.addClass('d-none'));
                        isOpen = false;
                    }
                }

                scope.selectCell = function(cell) {
                    scope.calendar.forEach(x => x.forEach(y => y.selected = false));
                    cell.selected = true;
                    scope.ngModel = angular.copy(cell.date);

                    let month = cell.date.getMonth() + 1;
                    month = month < 10 ? '0' + month : month;

                    let day = cell.date.getDate();
                    day = day < 10 ? '0' + day : day;

                    input.val(cell.date.getFullYear() + '-' + month + '-' + day);

                    scope.close();
                }


                let t = $bs5Position.translateTarget(input, calendar, 'bottom');
                $bs5DOM.translate(calendar, t.x, t.y);

                $timeout(() => calendar.addClass('d-none'), 0, false);

                showCalendar();
            }
        }
    }])