/**
 * @ngdoc module
 * @name bs5.modal
 * @description
 * Modules that contains all of the services for opening and closing a modal window
 */
angular.module('bs5.modal', ['bs5.dom'])

    /**
     * @ngdoc type
     * @name ModalResult
     * @module bs5.modal
     *
     * @property {Promise} result
     * A promise that gets resolved when the modal is closed or rejected when the modal gets dismissed.
     *
     * @description
     * ModalResult is the result of the modal that is returned ofter a modal is opened with {@link $bs5Modal}. For it to be closed means that it closed
     * expectedly.
     */

    /**
     * @ngdoc method
     * @name ModalResult#dismiss
     *
     * @param {*} reason
     * The value to pass after the modal has been dismissed
     *
     * @description
     * Calling this will dismiss a modal with a reason. For a modal to be dismissed means that it was closed for an
     * unexpected reason. For example a backdrop that is not static gets clicked then the modal will dismissed with
     * 'backdrop-clicked'.
     */

    /**
     * @ngdoc method
     * @name ModalResult#close
     *
     * @param {*} data
     * That data to pass after the modal is closed.
     *
     * @description
     * Closes the modal and pass the data to the result. For a modal to close means that it got closed in an expected way.
     */

    /**
     * @ngdoc service
     * @name $bs5Modal
     * @module bs5.modal
     *
     * @param {Object} options
     * @param {boolean} [options.staticBackdrop=false]
     * Boolean to make the backdrop static. meaning it wont close the modal after clicking it. {default: false}
     *
     * @param {string} [options.size=null]
     * bootstrap size for the modal. It can be 'sm', 'lg', or 'xl'
     *
     * @param {boolean} [options.centered=false]
     * Whether to vertically center the modal or not.
     *
     * @param {boolean} [options.scrollable=false]
     * whether to make the modal body scrollable.
     *
     * @param {string | Function | Array} [options.controller]
     * You can use the controller as syntax with a string. Or a you can use controller constructor Function. $scope has
     * properties $scope.close(data: any) which will close the modal and resolves the promise in the returned object
     * with a value and $scope.dismiss(reason: any) closes the modal and rejects the promise in the returned object with
     * a value.
     *
     * @param {string} [options.template]
     * This is required without templateUrl. The html template of the inner modal such as the modal-header, modal-body,
     * and modal-footer. This is required if potions.templateUrl is not defined;
     *
     * @param {string} [options.templateUrl]
     * This is required without template. The path to the url that has the contains the template or the url to an angular
     * script template. This is required if options.template is not defined.
     *
     * @param {string} [options.controllerAs]
     * A string that defines the  controller as as the value to use to reference your controller instance in your template.
     * You only need to use this if you pass a controller constructor to the controller option because the controller option
     * supports controller as syntax for strings. This is only to be used if you pass a controller function to
     * options.controller
     *
     * @param {boolean} [options.animate=true]
     * Enable or disable animations
     *
     * @return {ModalResult}
     * Returns a modal result that can be used to detect when the modal closes.
     *
     * @description
     * Opens a modal that is created with from template or templateUrl and returns a promise that is resolved when the modal
     * is closed or dismissed.
     *
     <example module="modal">
        <file name="index.html">
            <div ng-controller="MainController">
                <div class="pb-3"">
                    <button type="button" class="btn btn-primary" ng-click="openNameModal()">Open Name Modal</button>
                    <button type="button" class="btn btn-primary" ng-click="openAnimalModal()">Open Animal Modal</button>
                    <button type="button" class="btn btn-primary" ng-click="openFruitModal()">Open Fruit Modal</button>
                <div>
                <table class="table table-borderless">
                    <tr>
                        <th>Name</th>
                        <td>{{name}}</td>
                    <tr>
                        <th>Favorite Animal</th>
                        <td>{{animal}}</td>
                    </tr>
                    <tr>
                        <th>Favorite Fruit</th>
                        <td>{{fruit}}</td>
                    </tr>
                </table>
            </div>
            <script type="text/ng-template" id="name.modal.html">
                <form name="from" ng-submit="close(name)">
                    <div class="modal-header">
                        <button type="button" class="btn-close" ng-click="close()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-12 col-md-6 offset-md-3">
                                <div class="row">
                                    <label class="col-form-label col-form-label-sm col-12">What is your full name?</label>
                                    <input type="text" class="form-control form-control-sm" ng-model="name" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger btn-sm" ng-click="close()">Cancel</button>
                        <button type="submit" class="btn btn-primary btn-sm">Submit</button>
                    </div>
                </form>
            </script>
            <script type="text/ng-template" id="animal.modal.html">
                <form name="from" ng-submit="close(animal)">
                    <div class="modal-header">
                        <button type="button" class="btn-close" ng-click="close()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-12 col-md-6 offset-md-3">
                                <div class="row">
                                    <label class="col-form-label col-form-label-sm col-12">What is favorite animal?</label>
                                    <input type="text" class="form-control form-control-sm" ng-model="name" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger btn-sm" ng-click="close()">Cancel</button>
                        <button type="submit" class="btn btn-primary btn-sm">Submit</button>
                    </div>
                </form>
            </script>
            <script type="text/ng-template" id="fruit.modal.html">
                <div ng-controller="NoController">
                    <form name="from" ng-submit="close(fruit)">
                        <div class="modal-header">
                            <h5 class="modal-title">Alert</h5>
                            <button type="button" class="btn-close" ng-click="close()"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-12 col-md-6 offset-md-3">
                                    <div class="row">
                                        <label class="col-form-label col-form-label-sm col-12">What is your favorite fruit</label>
                                        <input type="text" class="form-control form-control-sm" ng-model="fruit" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger btn-sm" ng-click="close()">Cancel</button>
                            <button type="submit" class="btn btn-primary btn-sm"
                        </div>
                    </form>
                </div>
            </script>
        </file>
        <file name="script.js">
            angular.module('modal', ['ngBootstrap5'])
     .          .controller('MainController', ['$scope', '$bs5Modal', function($scope, $bs5Modal) {
                    $scope.name = '';
                    $scope.animal = '';
                    $scope.fruit = '';

                    // with a predefined controller
                    $scope.openNameModal = function() {
                        $bs5Modal({
                            size: 'lg',
                            centered: true,
                            templateUrl: 'name.modal.html',
                            controller: 'NameController'
                        }).then(function(data) {
                            if(typeof data !== 'undefined')
                                $scope.name = data;
                        });
                    };

                    // with a controller constructor
                    $scope.openAnimalModal = function() {
                        $bs5Modal({
                            size: 'lg',
                            centered: true,
                            templateUrl: 'animal.modal.html',
                            controller: ['$scope', function(scope) {
                                scope.animal = '';
                            }]
                        }).then(function(data) {
                            if(typeof data !== 'undefined')
                                $scope.animal = data;
                        });
                    };

                    // with out controller
                    $scope.openFruitModal = function() {
                        $bs5DModal({
                            size: 'lg',
                            center: true,
                            templateUrl: 'fruit.modal.html'
                        }).then(function(data) {
                            $scope.fruit  = data;
                        });
                    };
                }])

                .controller('NameController', ['$scope', function ($scope) {
                    $scope.name = '';
                }])

                .controller('FruitController', ['$scope', function ($scope) {
                    $scope.fruit = '';
                }]);
        </file>
     </example>
     */
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

    });