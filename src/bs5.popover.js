/**
 * Module: bs5.popover
 */
angular.module('bs5.popover', ['bs5.dom'])

    /**
     * Directive: bs5Popover
     *
     * Attributes:
     *
     * 		bs5-popover         <string>                                  the popover content. (overridden if template-url is defined)
     *
     * 		offset:             <Array<number>>                           [x, y] will move the popover to the left or right by x pixels and up or down by y pixels {default: [0, 0]}
     *
     *      delay:              <number | {show: number, hide: number}>   will delay the popover from appearing or vanashing for a number of milliseconds. If you
     *                                                                    pass the object it will delay the tooltip from appearing for `delay.hide` milliseconds
     *                                                                    and it will delay the vanishing for `delay.hide` milliseconds
     *
     *		html:               <boolean>                                 whether or not to allow html in the popover
     *
     *		placement:          <'left' | 'right' | 'top' | 'bottom'>     where to place the popover around the element {default: 'right'}
     *
     *      fallbackPlacement:   <Array<string>>                          an array of fallback placements to place the popover at incase it is out of bounds
     *                                                                    bounds of the container {default: ['left], 'right', 'top', 'bottom'}
     *
     *      container:          <string>                                  a selector for the container to place the popover element in. {default: 'body'}
     *
     *		trigger:            <'focus' | 'hover' | 'click'>             how to trigger the popover {default: 'click'}
     *
     *		title:              <string>                                  the title for the popover
     *
     *		template-url        <string>                                  url to the popover content or url to a angular script template. if the url is not found	then the
     *	                                                                  content is overridden by the bs5-popover attribute. html is set to true
     *
     *	    handler:            <expression>                              the handler for popover the popover's promise. $promise can be applied to the expression
     *
     *	    popover-controller: <string>                                  the name of a defined controller (`controller as` syntax is supported)
     *
     *
     * Advanced Use:
     * 		The `load` attribute passes a promise `$promise` to the expression. The popover is compiled with a scope that has functions `close(value: <any>)`
     * 		and `dismiss(value: <any>)` that you can access in the html content of the popover. `close` closes te popover and resolves the promise with `value`.
     * 		`dismiss` closes the popover and rejects the promise with `value`. You can get a return value from the popover by calling `close` in the html of th popover.
     * 		Here is an example:
     *
     * 			Popover Element:
     * 				<button	type="button" class="btn btn-light" bs5-popover template-url="popover-content.html" handler="logPopoverResult($promise)">Popover</button>
     *
     * 			popover-content.html:
     * 				<button type="button" class="btn btn-primary" ng-click="close('Resolved')">Close</button>
     * 				<button type="button" class="btn btn-danger" ng-click="dismiss('Reject6ed')">Dismiss</button>
     *
     * 			Main Controller:
     * 				$scope.logPopoverResult = function(promise) {
     * 					promise.then(console.log, console.log)
     * 				}
     *
     * 		Popover Controller:
     *			The popover controller has the exact same scope as the one mentioned above. So it has the functions `$scope.close`and `$scope.dismiss`. You could use the
     *			controller to do something like process a form and then call `$scope.close` to pass the result to the promise handler in the main controller.
     *
     *			Example:
     *				Popover Controller:
     *					function submitForm() {
     *					 	// submit form and return result
     *					}
     *
     *					$scope.processForm = function() {
     *					 	result = submitForm();
     *
     *					 	if(result)
     *					 		$scope.close(result);
     *					 	else
     *					 		$scope.dismiss('there was an error submitting the form')
     *					}
     *
     *				Main Controller:
     *              	$scope.logPopoverResult = function(promise) {
     * 						promise.then(console.log, console.log)
     *					}
     *
     */
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