/**
 * Module: bs5.modal
 */
angular.module('bs5.modal', ['bs5.dom'])

    /**
     * Service: $bs5Modal
     *
     * Opens a modal from the passed
     *
     * @param options {object} {
     *     backdrop: <boolean> - put a backdrop up for the modal. When you add a backdrop you can stack up modals without backdrops
     *                           in front of one with a back drop you can dismiss all the modals going all the way back to the one
     *                           with the backdrop when you click on the backdrop. {default: false}
     *
     *     size: <'sm' | 'lg' | 'xl' | null> - bootstrap size for the modal. {default: null}
     *
     *     centered: <boolean> -  whether to vertically center the modal or not. {default: false}
     *
     *     scrollable: <boolean> - whether to make the modal body scrollable. {default: false}
     *
     *     container: <string | angular.element> - a tag selector or element of where to insert the modal into. {default: 'body'}
     *
     *     controller <string | Function> - a string containing a defined controller. You can also use the controller as syntax with a string.
     *                                      Or a controller constructor Function. $scope has properties $scope.modal.promise which is the promise
     *                                      for the modal, $scope.modal.close(value: any) which will close the modal and resolve the promise with value, and
     *                                      $scope.modal.dismiss(value: any) closes the modal and rejects the promise with value.
     *
     *     template: <string> - required without templateUrl - the html template of the inner modal such as the modal-header, modal-body, and modal-footer
     *
     *     templateUrl: <string> - required without template - the path to the url that has the contains the template or the url to an angular script template
     *
     * }
     *
     * @return {{result: promise, close: function, dismiss: function}}  result is the promise that resolves from closing or dismissing, close(value: any) closes the modal and
     * resolves the promise with value, dismiss(value: any) closes the modal and rejects the promise with value;
     */
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
            $bs5DOM.fade(backdrop, 0.5, 0).then(function() {
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

    .service('$$stack', function() {
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
            return stack.length;
        }

    });
