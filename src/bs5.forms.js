/**
 * Module: Forms
 */
angular.module('bs5.forms', [])

/**
 * Directive: bs5FormsErrors
 *
 * Adds a list of predefined error messages under the element when each
 * error occurs
 *
 * Requires:
 *      ^^form
 *      ngModel
 *
 * Attributes:
 *      bs5-form-errors:    <object>    an object with the error messages as values and validator name as the keys
 *
 *      show-on-touched:    <boolean>   whether or not to display the errors when the element is touched
 *
 *      show-on-dirty:      <boolean>   whether or not to display the errors if the element was typed in
 *
 * Note:
 *      The errors will be displayed when the form is submitted no matter what
 */
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