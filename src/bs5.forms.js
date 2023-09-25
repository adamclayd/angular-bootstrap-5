/**
 * Module: Forms
 */
angular.module('bs5.forms', ['bs5.dom'])

/**
 * Directive: bs5FormsErrors
 *
 * Adds a list of predefined error messages under the element when each
 * error occurs.
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
 *      container           <boolean>   a selector for the container that you want to put the errors in
 *                                      by default it is added after the element so if you have a
 *                                      group of inlines like radio or check boxes it be would be suggested
 *                                      to put it in the container that contains their container
 *
 * Note:
 *      The errors will be displayed when the form is submitted no matter what
 */
    .directive('bs5FormErrors', ['$bs5DOM', '$timeout', '$q', function($bs5DOM, $timeout, $q) {
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
                let container = angular.element(document.querySelector(attrs.container));


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
                        if(angular.isElement(container) && container.length) {
                            if(!$bs5DOM.contains(errors, container))
                                container.append(errors);
                        }
                        else if(elm.next()[0] !== errors[0]) {
                            elm.after(errors);
                        }
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


                let errors = angular.element('<div class="invalid-feedback mt-1"></div>');

                scope.$watch(() => !(form.$submitted || (scope.showOnTouched && model.$touched) || (scope.showOnDirty && model.$dirty)), function(value) {
                    if(value) {
                        errors.remove();
                    }
                });
            }
        }
    }]);