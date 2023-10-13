/**
 * Module: bs5.dom
 */
angular.module('bs5.dom', [])


    /**
     * Service: $bs5Position
     *
     * Contains methods for getting offsets and the new positions of an element
     * around another element
     */
    .service('$bs5Position', ['$bs5DOM', function($bs5DOM) {

        /**
         * Get an offset to an element
         * @param elm {angular.element} the angular element to get the offset of
         * @returns {{top: number, left: number, width: number, height: number}} an offset with width and height components
         */
        this.offset = function(elm) {
            elm = elm instanceof HTMLElement ? elm : elm[0];
            let rect =  elm.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft,
                width: elm.offsetWidth,
                height: elm.offsetHeight
            };
        };


        /**
         * Get the element offset relative to another element
         *
         * @param elm {angular.element} angular element to get the offset of
         * @param relativeTo {angular.element} angular element that the elm param is relative to
         * @returns {{top: number, left: number, width: number, height: number} | null} offset or null if the elm param
         * is not relative to the relativeTo param
         */
        this.relativeOffset = function(elm, relativeTo) {
            let r = null

            if($bs5DOM.contains(elm, relativeTo)) {
                let relOffset = {x: relativeTo[0].offsetLeft, y: relativeTo[0].offsetTop};
                let elOffset = {x: elm[0].offsetLeft, y: elm[0].offsetTop};

                r = {
                    left: elOffset.x - relOffset.x,
                    top: elOffset.y - relOffset.y,
                    width: elm[0].offsetWidth,
                    height: elm[0].offsetHeight
                };
            }

            return r;

        }

        /**
         * Get the new position of the target element that would be placed around a host element
         *
         * @param hostElm {angular.element} the host element which to place the target element around
         * @param targetElm {angular.element} the target element that would be placed around the host element
         * @param {'top' | 'left' | 'bottom' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'left-center' | 'bottom-center' | 'right-center' | '*'}
         * 			'top' - will return a new position where targetElm can be placed directly to the top of hostElm
         * 			'left' - will return a new position where targetElm can be placed directly to the left of hostElm
         * 			'bottom' - will return a new position where targetElm can be placed directly to the bottom of hostElm
         * 			'right' - will return a new position where targetElm can be placed directly to the right of hostElm
         * 			'top-left' - will return a new position where targetElm can be placed above the top left corner of hostElm
         *			'top-right' - will return a new position where targetElm can be placed above the top right corner of hostElm
         *			'bottom-left' - will return a new position where targetElm can be placed below the bottom left corner of hostElm
         *			'bottom-right' - will return a new position where targetElm can be placed below the bottom right corner of hostElm
         *			'top-center' - will return a new position where targetElm can be placed to the top of hostElm and aligned in the center of hostElm
         *          'left-center' - will return a new position where targetElm can be placed to the left of hostElm and aligned in the center of hostElm
         *          'bottom-center' - will return a new position where targetElm can be placed to the bottom of hostElm and aligned in the center of hostElm
         *          'right-center' - will return a new position where targetElm can be placed to the right of hostElm and aligned in the center of hostElm
         *          anything else - will return a new position where targetElm will be placed over hostElm
         * @param {Array<number>} offset [x, y] values to add to the top and left properties of the returned offset. The result by the default is [0, 0]
         * @returns {{top: number, left: number}} a position that you can use to place targetElm around hostElm
         */
        this.positionTarget = function(hostElm, targetElm, placement, offset) {
            let r = null;
            if (angular.isElement(hostElm) && angular.isElement(targetElm)) {
                let host = this.offset(hostElm);
                let target = this.offset(targetElm);


                let left = host.left;
                let top = host.top;
                if (placement === 'top') {
                    top = host.top - target.height;
                }
                else if (placement === 'left') {
                    left = host.left - target.width
                }
                else if (placement === 'bottom') {
                    top = host.top + host.height;
                }
                else if (placement === 'right') {
                    left = host.left + host.width
                }
                else if (placement === 'top-left') {
                    left = host.left - target.width;
                    top = host.top - target.height;
                }
                else if (placement === 'top-right') {
                    left = host.left + host.width;
                    top = host.top - target.height;
                }
                else if (placement === 'bottom-left') {
                    left = host.left - target.width;
                    top = host.top + host.height;
                }
                else if (placement === 'bottom-right') {
                    left = host.left + host.width;
                    top = host.top + host.height;
                }
                else if (placement === 'top-center') {
                    top = host.top - target.height;
                    let diff = (host.width / 2) - (target.width / 2);
                    left = host.left + diff;
                }
                else if (placement === 'left-center') {
                    left = host.left - target.width;
                    let diff = (host.height / 2) - (target.height / 2);
                    top = host.top + diff;
                }
                else if (placement === 'bottom-center') {
                    top = host.top + host.height;
                    let diff = (host.width / 2) - (target.width / 2);
                    left = host.left + diff;
                }
                else if (placement === 'right-center') {
                    left = host.left + host.width;
                    let diff = (host.height / 2) - (target.height / 2);
                    top = host.top + diff;
                }

                if (!angular.isArray(offset) || offset.length < 2)
                    offset = [0, 0];

                if (angular.isNumber(offset[0]))
                    left += offset[0];

                if (angular.isNumber(offset[1]))
                    top += offset[1];

                return {
                    left: left,
                    top: top
                };
            }
            else {
                throw new TypeError(!angular.isElement(hostElm) && !angular.isElement(targetElm) ? 'hostELm and targetElm are not of the type angular.elmemnt' : (!angular.isElement(hostElm) ? 'hostELm is not of the type angular.elmemnt' : 'targetELm is not of the type angular.elmemnt'));
            }
        };

        /**
         * Get a new relative position to place a target element around a host element.
         *
         * @param hostElm {angular.element}
         * @param targetElm {angular.element}
         * @param relativeTo {angular.element} The element that hostElm is relative to.
         * @param placement {'top' | 'left' | 'bottom' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'left-center' | 'bottom-center' | 'right-center' | '*'}
         * @param offset {Array<number>}
         * @returns {{top: number, left: number}}
         * @see $bs5Position.positionTarget
         */
        this.positionTargetRelative = function(hostElm, targetElm, relativeTo, placement, offset) {
            if(angular.isElement(hostElm) && angular.isElement(targetElm) && angular.isElement(relativeTo)) {

                let host = this.relativeOffset(hostElm, relativeTo);
                let target = this.relativeOffset(targetElm, relativeTo);

                if(!host && !target)
                    throw new DOMException('hostElm and targetElm are not relative to ' + relativeTo[0].localName + '[class="' + relativeTo[0].classList.value + '"][id="' + relativeTo[0].id + '"]');
                else if(!host)
                    throw new DOMException('hostElm is not relative to ' + relativeTo[0].localName + '[class="' + relativeTo[0].classList.value + '"][id="' + relativeTo[0].id + '"]');
                else if(!target)
                    throw new DOMException('targetElm is not relative to ' + relativeTo[0].localName + '[class="' + relativeTo[0].classList.value + '"][id="' + relativeTo[0].id + '"]');


                let left = host.left;
                let top = host.top;

                if(host && target) {

                    if (placement === 'right') {
                        left += host.width;
                    }
                    else if (placement === 'bottom') {
                        top += host.height;
                    }
                    else if (placement === 'left') {
                        left -= target.width;
                    }
                    else if (placement === 'top') {
                        top -= target.height;
                    }
                    else if (placement === 'top-left') {
                        top -= target.height;
                        left -= target.width;
                    }
                    else if (placement === 'top-right') {
                        top -= target.height;
                        left += host.width;
                    }
                    else if (placement === 'bottom-left') {
                        top += host.height;
                        left -= target.width;
                    }
                    else if (placement === 'bottom-right') {
                        top += host.height;
                        left += host.width;
                    }
                    else if (placement === 'top-center') {
                        top -= target.height;
                        let diff = (host.width / 2) - (target.width / 2);
                        left += diff;
                    }
                    else if (placement === 'bottom-center') {
                        top += host.height;
                        let diff = (host.width / 2) - (target.width / 2);
                        left += diff;
                    }
                    else if (placement === 'left-center') {
                        left -= target.width;
                        let diff = (host.height / 2) - (target.height / 2);
                        top += diff;
                    }
                    else if (placement === 'right-center') {
                        left += host.width;
                        let diff = (host.height / 2) - (target.height / 2);
                        top += diff;
                    }

                    left += angular.isArray(offset) && offset.length > 0 && angular.isNumber(offset[0]) ? offset[0] : 0;
                    top += angular.isArray(offset) && offset.length > 1 && angular.isNumber(offset[1]) ? offset[1] : 0;


                    return {
                        left: left,
                        top: top
                    };
                }
            }
            else {
                if(!angular.isElement(hostElm) && !angular.isElement(targetElm) && !angular.isElement(relativeTo))
                    throw new TypeError('hostElm, targetElm, and relativeTo are not of type angular.element');
                else if(!angular.isElement(hostElm) && !angular.isElement(targetElm))
                    throw new TypeError('hostElm and targetElm are not of type angular.element');
                else if(!angular.isElement(hostElm) && !angular.isElement(relativeTo))
                    throw new TypeError('hostElm and relativeTo are not of type angular.element');
                else if(!angular.isElement(relativeTo) && !angular.isElement(targetElm))
                    throw new TypeError('relativeTo and targetElm are not of type angular.element');
                else if(!angular.isElement(hostElm))
                    throw new TypeError('hostElm is not of type angular.element');
                else if(!angular.isElement(targetElm))
                    throw new TypeError('targeetElm is not of type angular.element');
                else
                    throw new TypeError('relativeTo is not of type angular.element');

            }
        };

        this.positionTooltip = function(host, tip, container, placement, fallbackPlacements = ['left', 'right', 'top', 'bottom'], offset = [0, 0]) {
            function getArrowPos() {
                const ttOff = 6;
                const tooltipOff = [place === 'left' ? ttOff : (place === 'right' ? -ttOff : 0), place === 'top' ? ttOff : (place === 'bottom' ? -ttOff: 0)];

                const poOff = 0;
                const popoverOff = [place === 'left' ? poOff : (place === 'right' ? -poOff : 0), place === 'top' ? poOff : (place === 'bottom' ? -poOff: 0)];

                let plc = place + '-center';

                return this.positionTargetRelative(tip, arrow, tip, plc, isPopover ? popoverOff : tooltipOff);
            };

            function getTipPos() {
                const ttOff = 4;
                const tooltipOff = [place === 'left' ? -ttOff : (place === 'right' ? ttOff : 0), place === 'top' ? -ttOff : (place === 'bottom' ? ttOff: 0)];

                const poOff = 4;
                const popoverOff = [place === 'left' ? -poOff : (place === 'right' ? poOff : 0), place === 'top' ? -poOff : (place === 'bottom' ? poOff: 0)];

                let plc = place + '-center';

                return rel ?
                    this.positionTargetRelative(host, tip, rel, plc, isPopover ? popoverOff : tooltipOff) :
                    this.positionTarget(host, tip, plc, isPopover ? popoverOff : tooltipOff);
            };

            function getPlacementClass() {
                let lastPlcClass;

                if(place === 'left')
                    lastPlcClass = isPopover ? 'bs-popover-start' :  'bs-tooltip-start';

                else if(place === 'right')
                    lastPlcClass = isPopover ? 'bs-popover-end' : 'bs-tooltip-end';

                else if(place === 'top')
                    lastPlcClass = isPopover ? 'bs-popover-top' : 'bs-tooltip-top';

                else
                    lastPlcClass = isPopover ? 'bs-popover-bottom' :  'bs-tooltip-bottom';

                return lastPlcClass;
            };

            function positionLeftRight() {
                if(tipPos.left < coff.left) {

                    if (tip[0].offsetWidth <= coff.width) {
                        let diff = Math.abs(tipPos.left + coff.left);
                        tipPos.left += diff;
                        arrowPos.left -= diff;
                    }
                    else {
                        throw new DOMException('The tooltip element is too wide to fit in the container')
                    }
                }
                else if(tipPos.left + tip[0].offsetWidth > coff.left + coff.width) {
                    let left = ((tipPos.left + tip[0].offsetWidth) - (coff.left + coff.width));
                    if(tipPos.left - left >= coff.left) {
                        tipPos.left -= left;
                        arrowPos.left += left;
                    }
                    else {
                        throw new DOMException('The tooltip element is too wide to fit in the container')
                    }
                }
            };

            function positionTopBottom() {
                if(tipPos.top < coff.top) {
                    if(tip[0].offsetHeight <= coff.height) {
                        let diff = Math.abs(tipPos.top + coff.top);
                        tipPos.top = coff.top;
                        arrowPos.top -= diff;
                    }
                    else {
                        throw new DOMException('The tooltip element is too tall to fit in')
                    }
                }
                else if(tipPos.top + tip[0].offsetHeight > coff.top + coff.height) {
                    let top = ((tipPos.top + tip[0].offsetHeight) - (coff.top + coff.height));
                    if(tipPos.top - top >= 0) {
                        tipPos.top -= top;
                        arrowPos.top += top;
                    }
                    else {
                        throw new DOMException('The tooltip element is too tall to fit in');
                    }
                }
            };

            function isOutOfRange() {
                return (place === 'left' && tipPos.left < coff.left) ||
                    (place === 'right' && tipPos.left + tip[0].offsetWidth > coff.left + coff.width) ||
                    (place === 'top' && tipPos.top < coff.top) ||
                    (place === 'bottom' && tipPos.top + tip[0].offsetHeight > coff.top + coff.height);
            };

            function placeFallback(fp, index) {
                let position = () => {
                    if (place === 'left' || place === 'right')
                        positionTopBottom();
                    else
                        positionLeftRight();
                };

                if (index >= fp.length)
                    return false;

                place = fb[index];
                tipPos = getTipPos();
                arrowPos = getArrowPos();

                if (isOutOfRange()) {
                    placeFallback(fp, index);
                } else {
                    return true;
                }
            };

            function placeAtFallback() {
                if(!placeFallback(fallbackPlacements.filter(x => /^(top|bottom|left|right)$/.test(x)), 0))
                    throw new DOMException('Could not find suitable fallback placement');
            }

            let isPopover = tip.hasClass('popover');
            let place = /^(left|right|top|bottom)$/.test(placement) ? placement : (isPopover ? 'right' : 'top');


            let arrow = angular.element(tip[0].querySelector(isPopover ? '.popover-arrow' : '.tooltip-arrow'));
            let rel = $bs5DOM.findRelativeParent(container);
            let coff = rel ? this.relativeOffset(container, rel) : this.offset(container);

            let resize = null;
            let tipPos = getTipPos();
            let arrowPos = getTipPos();

            if(angular.isArray(offset) && offset.length === 2 && angular.isNumber(offset[0]) && angular.isNumber(offset[1])) {
                tipPos.left += offset[0];
                tipPos.top += offset[1];
            }

            if(isOutOfRange()) {
                placeAtFallback();
            }

            return {tip: tipPos, arrow: arrowPos, placementClass: getPlacementClass()};
        };
    }])

    /**
     * Service: $bs5DOM
     *
     * Provides extra DOM functionality
     */
    .service('$bs5DOM', ['$q', function($q) {

        /**
         * Search for the relative positioned element tha an element is contained in
         *
         * @param elm {angular.element} element that maybe in a relative positioned container
         * @return {angular.element | null} the relative positioned container if found or null if not
         */
        this.findRelativeParent = function(elm) {
            let r = null;
            if(elm instanceof angular.element) {
                let node = elm;
                let style = window.getComputedStyle(node[0]);

                while(style.position !== 'relative' && node.length) {
                    node = node.parent();
                    style = window.getComputedStyle(node[0]);
                }

                r = node.length ? node : null;
            }

            return r;
        };

        /**
         * Check whether an element is contained in another or not
         *
         * @param elm {angular.element | HTMLElement} the element to search for
         * @param container {angular.element | HTMLElement} the container element to search in
         * @return {boolean}
         */
        this.contains = function(elm, container) {
            elm = elm instanceof HTMLElement ? angular.element(elm) : elm;
            container = container instanceof HTMLElement ? angular.element(container) : container;

            let node = elm;

            while(node[0] !== container[0] && node.length) {
                node = node.parent();
            }

            return !!node.length;
        };

        /**
         * Bootstrap 5's fade effect. This will animate the fade effect if the element has the 'fade' class.
         * If the element has the 'show' class the animation will fade out and if it does not the animation
         * will fade in
         * @param elm {angular.element | HTMLElement} element to aqnimate
         * @param opacity {number} Number between 0 and 1. What the elements opacity should be when it is
         * completely visible. {default: 1}
         * @return {$q.promise<void>} a promise that is resolved when the animation is done
         */
        this.fade = function(elm,  opacity = 1) {
            elm = elm instanceof HTMLElement ? angular.element(elm) : elm;
            opacity = opacity < 0 ? 0 : (opacity > 1 ? 1 : opacity);
            return $q(function(r) {
                new Promise(function (res) {
                    if (elm.hasClass('fade')) {
                        if (elm.hasClass('show')) {
                            elm[0].style.opacity = opacity;

                            setTimeout(function () {
                                elm[0].style.opacity = 0;

                                setTimeout(function () {
                                    elm[0].style.opacity = null;
                                    elm.removeClass('show');
                                    res();
                                }, 150);
                            });
                        } else {
                            elm[0].style.opacity = 0;
                            setTimeout(function() {
                                elm[0].style.opacity = opacity;
                                setTimeout(function () {
                                    elm.addClass('show');
                                    elm[0].style.opacity = null;
                                    res();
                                }, 150);
                            });
                        }
                    } else {
                        res();
                    }
                }).then(r);
            });
        };

    }]);