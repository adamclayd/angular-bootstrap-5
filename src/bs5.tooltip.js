/**
 * Module: bs5.tooltip
 */
angular.module('bs5.tooltip', ['bs5.dom'])

    /**
     * Directive: bs5Tooltip
     *
     * Attributes:
     *
     * 		bs5-tooltip:          <string>                                   the tooltip content
     *
     * 		offset:              <Array<number>>                            [x, y] will move the tooltip to the left or right by x pixels and will move it up or down by y pixels
     * 	                                                                    {default: [0, 0]}
     *
     * 		delay:               <number | {show: number, hide: number}>    will delay the tooltip from appearing or vanashing for a number of milliseconds. If you
     * 	                                                                    pass the object it will delay the tooltip from appearing for `delay.hide` milliseconds
     * 	                                                                    and it will delay the vanishing for `delay.hide` milliseconds
     *
     * 		animate:             <boolean>                                 whether or not to animate the tooltip {default: true}
     *
     * 		html:                <boolean>                                 whether or not to allow html in the tooltip {default: false}
     *
     * 		placement:           <'left' | 'right' | 'top' | 'bottom'>     where to place the tooltip around the element
     *
     * 	    fallbackPlacements: <Array<string>>                            an array of placements to fallback to incase the tooltip element is out of the bounds
     * 	                                                                   of the container
     *
     * 	    container:          <string>                                  selector of an element that the tooltip goes in. {default: 'body'}
     */
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