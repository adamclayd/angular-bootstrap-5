angular.module('bs5.tooltip', ['bs5.dom'])

    /**
     * @ngdoc object
     * @name Delay
     * @module bs5.tooltip
     *
     * @property {number} show
     * Show after so many milliseconds
     *
     * @property {number} hide
     * Hide after so many milliseconds
     */

    /**
     * @ngdoc directive
     * @name bs5Tooltip
     * @scope
     * @restrict A
     *
     * @param {string} bs5Tooltip
     * the tooltip content
     *
     * @param {number[]} [offset=[0, 0]]
     * [x, y] will move the tooltip to the left or right by x pixels and will move it up or down by y pixels
     *
     * @param {number | Delay} [delay=0]
     * will delay the tooltip from appearing or vanishing for a number of milliseconds. Refer to {@link Delay} for more
     * details
     *
     * @param {boolean} [animate=true]
     * whether or not to animate the tooltip {default: true}
     *
     * @param {boolean} [html=false]
     * whether or not to allow html in the tooltip
     *
     * @param {string} [placement="top"]
     * where to place the tooltip around the element
     *
     * Possible Values:    'left' | 'right' | 'top'  | 'bottom'
     *
     * @param {string[]} [fallbackPlacements=['left', 'right', 'top', 'bottom']]
     * an array of placements to fall back to in case the tooltip element is out of the bounds
     * of the container
     *
     * Possible Values For Array Element:    'left' | 'right' | 'top' | 'bottom'
     *
     * @param {string | angular.element} [container='body'}
     * selector of an element that the tooltip goes in
     */
    .directive('bs5Tooltip', ['$templateCache', '$compile', '$http', '$q', '$bs5Position', '$bs5DOM', '$timeout', function($templateCache, $compile, $http, $q, $bs5Position, $bs5DOM, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                let deferred = $q.defer();

                let offset = /^\[ *?\d+?, *?\d+? *?\]$/.test(attrs.offset) ? scope.$eval(attrs.offset) : [0, 0];
                let delay = scope.$eval(attrs.delay);
                let animate = attrs.animate ? scope.$eval(attrs.animate) : true;
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
                    let tpl = $templateCache.get('templates/bs5/tooltip/tooltip.html');
                    let Tooltip = function (tooltipEl) {
                        let self = this;
                        let el = null;
                        let visible = false;

                        this.show = function () {

                            $timeout(function () {
                                if (el) el.remove();
                                el = angular.copy(tooltipEl);

                                let arrow = angular.element(el[0].querySelector('.tooltip-arrow'));

                                el.css({
                                    'position': 'absolute',
                                });

                                arrow.css('position', 'absolute');

                                container.append(el);

                                $timeout(function () {
                                    let css = $bs5Position.translateTooltip(elm, el, container, placement, fp, offset);

                                    el.addClass(css.placementClass);

                                    el.css(css.tip);

                                    arrow.css(css.arrow);

                                    if (animate) {
                                        $bs5DOM.fade(el);
                                    }

                                    visible = true;
                                });
                            }, angular.isObject(delay) ? (angular.isNumber(delay.show) ? delay.show : 0) : (angular.isNumber(delay) ? delay : 0));
                        };

                        this.hide = function () {
                            let removeEl = function () {
                                el.remove();
                                console.log('el removed');
                                visible = false;
                            };
                            $timeout(function () {
                                if (animate) {
                                    $bs5DOM.fade(el, removeEl);
                                } else {
                                    removeEl();
                                }
                            }, angular.isObject(delay) ? (angular.isNumber(delay.hide) ? delay.hide : 0) : (angular.isNumber(delay) ? delay : 0), false);
                        };

                        this.toggle = function () {
                            if (visible)
                                self.hide();
                            else
                                self.show();
                        };
                    };

                    let tplEl = angular.element(tpl);
                    tplEl.css('max-width', '200px');

                    if (animate)
                        tplEl.addClass('fade');
                    else
                        tplEl.addClass('show');

                    let body = angular.element(tplEl[0].querySelector('.tooltip-inner'))
                    html ? body.html(content) : body.text(content);

                    let tooltip = new Tooltip(tplEl);

                    if (attrs.trigger === 'click') {
                        elm.on('click', function () {
                            tooltip.toggle();
                        });
                    } else if (attrs.trigger === 'focus') {
                        elm.on('focus', function () {
                            tooltip.show();
                        });

                        elm.on('blur', function () {
                            tooltip.hide();
                        });
                    } else {
                        elm.on('mouseenter', function () {
                            tooltip.show();
                        });

                        elm.on('mouseleave', function () {
                            tooltip.hide();
                        });
                    }
                });
            }
        };
    }]);