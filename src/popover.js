/**
 * @ngdoc module
 * @name bs5#popover
 *
 * @description
 * ### Bootstrap 5 Popover Module
 */
angular.module('bs5.popover', ['bs5.dom'])

    /**
     * @ngdoc type
     * @name bs5.popover#Popover
     *
     * @description
     * The type that is put into the scope of a popover controller as `$scope.popover`
     */

    /**
     * @ngdoc method
     * @name Popover#show
     *
     * @description
     * Show the popover
     */

    /**
     * @ngoc method
     * @name Popover#hide
     *
     * @description
     * Hide the Popover
     */

    /**
     * @ngdoc method
     * @name Popover#toggle
     *
     * @description
     * Toggles the popover to be hidden or dismissed
     */

    /**
     * @ngdoc directive
     * @name bs5Popover
     * @requires $templateCache
     * @requires $http
     * @requires $q
     * @requires $timeout
     * @requires $bs5Position
     * @requires $bs5DOM
     *
     * @param {string} bs5Popover
     * The popover content. (overridden if template-url is defined)
     *
     * @param {number[]} [offset=[0, 0]]
     * [x, y] will move the popover to the left or right by x pixels and up or down by y pixels {default: [0, 0]}
     *
     * @param {number | Delay} [delay=0]
     * Will delay the popover from appearing or vanishing for a number of milliseconds. Refer {@link Delay} for more details
     *
     * @param {boolean} [html=false]
     * Whether or not to allow html in the popover
     *
     * @param {string} [placement='right']
     * Where to place the popover around the element. Possible values are 'left', 'right', 'top', or 'bottom'.
     *
     * @param {string[]} [fallbackPlacement=['left', 'right', 'top', 'bottom']]
     * An array of fallback placements to place the popover incase it is out of the bounds of the container.
     * Possible array element values are 'left', 'right', 'top', or 'bottom'.
     *
     * @param {string} [trigger='click']
     * How to trigger the popover. Possible values are 'hover', 'focus', or 'click'.
     *
     * @param {string} [title='']
     * The title for the popover.
     *
     * @param {string} [templateUrl]
     * Url to the popover content. Can be remote url or a angular script template url. if the url is not found then the content is overridden by
     * the `bs5Popover` parameter. `html` attribute is set to true if the url is found
     *
     * @param {expression} [handler]
     * The handler for popover after that is fired after it has closed. You have to call `close($data)` in one of the expressions of your html like
     * `ng-click`, or you have to use the a controller and call the `$scope.close(data)` method for the handler to fire. It passes $data to the expression which
     * is the data returned after closing te popover.
     * Expression: `handler($data)`
     *
     * @param {string} [popoverController]
     * The name of a defined controller (controller as syntax is supported).
     *
     * @description
     * ### Bootstraps 5 Popover
     *
     *
     * #### Advanced Use:
     * This is for if you want to put something like a form in popover and if you want to get the data from the form or
     * just pass a value back to back to your controller. The `handler` attribute passes data `$data` to the expression.
     * The popover is compiled with a scope that has functions `$scope.close(value: <any>)` and `$scope.dismiss(reason)`
     * that you can access in the html content of the popover. `$scope.close` closes te popover and calls the handler
     * with the data. `dismiss` just closes the popover. You can get a return value from the popover by calling `close`
     * in the html of the popover. The scope also has a `popover` propetry of type {@link Popover}.
     *
     * Example:
     *
     *  index.html:
     *  ```html
     *  <button type="button" class="btn btn-light" bs5-popover template-url="popover-content.html" handler="logPopoverResult($data)">Popover</button>
     *
     *  popover-content.html:
     *  ```html
     *  <button type="button" class="btn btn-primary" ng-click="close('Resolved')">Close</button>
     *  <button type="button" class="btn btn-danger" ng-click="dismiss()">Dismiss</button>
     *
     *  Main Controller:
     *  ```js
     *  $scope.logPopoverResult = function(data) {
     *     console.log(data);
     *  }
     *  ```
     *
     * Popover Controller:
     * The popover controller has the exact same scope as the one mentioned above. So it has the functions `$scope.close`and `$scope.dismiss`. You
     * could use the controller to do something like process a form and then call `$scope.close` to pass the result to the promise handler in the main
     * controller.
     * You don't necessarily have to define the `handler` parameter with a Controller. You could just process and submit the form in the popover's controller and
     * dismiss the popover.
     *
     *
     <example name="popover" module="popover">
         <file name="index.html">
             <div ng-controller="MainController">
                <button type="button" class="btn btn-warning" bs5-popover="............... Text ..............."  html="true" popover-controller="PopoverController" title="Name Form">Normal</button>
                <button type="button" class="btn btn-warning" bs5-popover template-url="popover.html" popover-controller="PopoverController" title="Name Form" handler="handler($data)">Advanced</button>
                <div class="row mb-3 m-md-2">
                     <label class="col-12 col-md-3 col-lg-2 col-form-label text-md-end">First Name</label>
                     <div class="col-12 col-md-9 col-md-10">
                         <input type="text" class="form-control" ng-model="data.fname" disabled>
                     </div>
                </div>
                 <div class="row mb-3 m-md-2">
                     <label class="col-12 col-md-3 col-lg-2 col-form-label text-md-end">Last Name</label>
                     <div class="col-12 col-md-9 col-md-10">
                         <input type="text" class="form-control" ng-model="data.lname" disabled>
                     </div>
                 </div>
             </div>
             <script src="text/ng-template" id="popover.html">
                 <form name="form" ng-submit="submit()">
                     <div class="row mb-3">
                         <label class="col-12 col-form-label">First Name</label>
                         <div class="col-12">
                             <input type="text" class="from-control" name="fname" ng-model="frm.fname" />
                         </div>
                     </div>
                     <div class="row mb-4">
                         <label class="col-12 col-form-label">Last Name</label>
                         <div class="col-12">
                             <input type="text" class="from-control" name="lname" ng-model="frm.lname" />
                         </div>
                     </div>
                     <div class="text-end">
                         <button type="submit" class="btn btn-primary">Submit</button>
                     </div>
                 </form>
             </script>
         </file>
         <file name="script.js">
             module = angular.module('popover', ['ngBootstrap5']);
             module.controller('PopoverController' ['$scope', function($scope) {
                $scope.frm = {
                    fname: null,
                    lname: null
                };

                function process() {
                    return angular.copy($scope.frm);
                }

                 $scope.submit = function() {
                     result = process();

                     if(result)
                         $scope.close(result);
                     else
                         $scope.dismiss();
                 }
             }]);

             module.controller('MainController', ['$scope', function($scope) {
                 $scope.data = {
                     fname: null,
                     lname: null
                 }

                 $scope.handler = function(data) {
                     $scope.data = data;
                 }
             }]);
         </file>
     </example>
     */
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
    }]);