/**
 * @ngdoc module
 * @name bs5#dom
 */
angular.module('bs5.dom', [])

    /**
     * @ngdoc type
     * @name Position
     * @module bs5.dom
     *
     * @property {number} top
     * Top of position of an element
     *
     * @property {number} left
     * Left Position of an element
     *
     * @property {number} bottom
     * The offset for the bottom of the target element
     *
     * @property {number} right
     * The offset for the right of the target element
     *
     * @description
     * A object that contains the absolute position offsets the that you can use to move the target element.
     * This is the type of value returned from {@link $bs5Position.positionTarget}
     *
     * You can apply it in following ways to move the target:
     *
     * ```js
     * let {top, left} = position;
     *
     * targetElm.style.top = top + 'px';
     * targetElm.style.left = left + 'px';
     * ```
     *
     * or:
     *
     * ```js
     * let {bottom, right} = position;
     *
     * targetElm.style.bottom = bottom + 'px';
     * targetElm.style.right = right + 'px';
     * ```
     */

    /**
     * @ngdoc type
     * @name Offset
     * @module bs5.dom
     *
     * @property {number} top
     * Left position of on element
     *
     * @property {number} left
     * Top of position of an element
     *
     * @property {number} width
     * The width of an element
     *
     * @property {number} height
     * The height of an element
     *
     * @description
     * A absolute position offset returned by {@link $bs5Position.offset} it also contains dimensions for the element.
     */

    /**
     * @ngdoc type
     * @name RelativeOffset
     * @module bs5.dom
     *
     * @property {number} top
     * Left position of on element that is relative to its container
     *
     * @property {number} left
     * Top of position of an element that is relative to its container
     *
     * @property {number} width
     * The width of an element
     *
     * @property {number} height
     * The height the an element
     *
     * @property {DOMElement} container
     * The relatively positioned container that
     *
     * @description
     * This is a relative position offset returned by {@link $bs5Position.relativeOffset} it also contains dimensions
     * for the element.
     */

    /**
     * @ngdoc type
     * @name RelativePosition
     * @module bs5.dom
     *
     * @property {number} top
     * The Left relative offset
     *
     * @property {number} left
     * The top relative offset
     *
     * @property {number} bottom
     * The bottom relative offset
     *
     * @property {number} right
     * The right relative offset
     *
     * @description
     * An offset that has coordinates that are local relatively positioned container. This is the type of value that is
     * returned from {@link $bs5Position.positionTargetRelative]. The value can be used to move the target element.
     *
     * You can apply it in following ways to move the target:
     *
     * ```js
     * let {top, left} = relativePosition;
     *
     * targetElm.style.top = top + 'px';
     * targetElm.style.left = left + 'px';
     * ```
     *
     * or:
     *
     * ```js
     * let {bottom, right} = relativePosition;
     *
     * targetElm.style.bottom = bottom + 'px';
     * targetElm.style.right = right + 'px';
     * ```
     */

    /**
     * @ngdoc object
     * @name Translator
     * @kind object
     * @module bs5.dom
     * @property {number} x
     * The x coordinates for the translate functions that the
     * transform css property accepts
     *
     * @property {number} y
     * The y coordinates for the translate functions that the
     * transform css property accepts
     *
     * @property {number[]} matrix
     * The values for the the matrix function that the
     * transform css property uses.
     *
     * @property {number} left
     * Left Position of an element
     *
     * @property {number} top
     * Top of position of an element
     *
     * @description
     * Translator is an object that you can use to translate an element with the css transform property. It is what
     * {@link $bs5Position.translateTarget} returns.
     *
     * The normal way to apply it would be:
     *
     * ```js
     * let {x, y} = translator;
     * targetElm.style.transform = `translate(${x}px, ${y}px)`;
     * ```
     *
     * matrix is an array that contains all of the transformations. Use it instead of x and y to translate the target if you
     * want to keep the other applied transformations. It has 6 elements. matrix[4] and matrix[5] are are the x and y
     * coordinates to be translate to. Use the following to translate the target and keep the other applied transformations
     * The following will translate a target and keep all other transformations if there are any:
     *
     * ```js
     * let [a, b, c. d, x, y] =  translator.matrix;
     * targetElm.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, ${x}, ${y})`;
     * ```
     *
     * left and top are the absolute coordinates that for the target that would be placed at. One reason to use them is to
     * reposition the target when the translated coordinates would leave the target a where it would be placed outside the
     * bounds of a container.
     */

    /**
     * @ngdoc service
     * @name $bs5Position
     * @module bs5.dom
     * @kind object
     *
     * @description
     * Contains methods for getting offsets and returning the new position of an element around another element. The
     * methods in this service do not actually modify the DOM. They return a result that will allow you to move an
     * element by applying values from the result to the an element's css properties.
     *
     */
    .service('$bs5Position', ['$bs5DOM', function ($bs5DOM) {
        let self = this;

        /**
         * @ngdoc method
         * @name $bs5Position#offset
         * @kind function
         *
         * @param {DOMElement} elm
         * The element that you want the offset of
         *
         * @returns {Offset}
         * See {@link Offset} for more details
         *
         * @description
         * Get the absolute offset of an element
         */
        self.offset = function(elm) {
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
         * @ngdoc method
         * @name $bs5Position#relativeOffset
         * @kind function
         * @param {DOMElement} elm
         * @returns {RelativeOffset | null}
         * If elm is relative or if it has a relative positioned container this method will return an object with properties
         * {@link RelativeOffset}. It will return null otherwise.
         *
         * @description
         * Get the element offset if it is position relative or if it is in a relative container
         */
        self.relativeOffset = function (elm) {
            elm = elm instanceof HTMLElement ? angular.element(elm) : elm;
            let relativeTo = $bs5DOM.findRelativeContainer(elm);

            let r = null;

            if (relativeTo) {
                let relOffset = self.offset(relativeTo);
                let elOffset = self.offset(elm);

                r = {
                    left: elOffset.left - relOffset.left,
                    top: elOffset.top - relOffset.top,
                    width: elm[0].offsetWidth,
                    height: elm[0].offsetHeight,
                    container: relativeTo
                };
            }

            return r;

        }

        /**
         * @ngdoc method
         * @name $bs5Position#positionTarget
         * @kind function
         *
         *
         * @param {DOMElement} hostElm
         * The host element which to place targetElm around
         *
         * @param {DOMElement} targetElm
         * The target element to be placed around <span class="fw-bold param">hostElm</span>
         *
         * @param {string} placement
         * A string that can be any of the following:
         * | value            |  Details                                                                                 |
         * |-------------------|-----------------------------------------------------------------------------------------------------|
         * | `'top'`           | Will return a new position where targetElment be placed to the top of  hostElm                      |
         * | `'left'`          | Will return a new position where targetElm  can be placed to the left of  hostElm                   |
         * | `'bottom'`        | Will return a new position where targetElm can be placed to the bottom of  hostElm                  |
         * | `'right'`         | Will return a new position where targetElm can be placed to the right of  hostElm                   |
         * | `'top-left'`      | Will return a new position where targetElm can be placed above the top left corner of hostElm       |
         * |  `'top-right'`    | Will return a new position where targetElm Will be placed above the top right corner of hostElm     |
         * | `'bottom-left'`   | Will return a new position where targetElm Will be placed below the bottom left corner of hostElm   |
         * | `'bottom-right'`  | Will return a new position where targetElm can be placed below the bottom right corner of hostElm   |
         * | `'top-center'`    | Will return a new position where targetElm can be placed over the top center of hostElm             |
         * | `'left-center'`   | Will return a new position where targetElm can be placed to the left center of  hostElm             |
         * | `'bottom-center'` | Will return a new position where targetElm can be placed to the bottom center of hostElm            |
         * | `'right-center'`  | Will return a new position where  targetElm can be placed to the right center of hostElm            |
         *
         * @param {Array<number>} [offset=[0, 0]]
         * [x, y] values to add to the top and left properties of the returned offset.
         *
         * @returns {Position}
         * An absolute position (see {@link Position} for details} that you can use to place targetElm around hostElm.
         *
         * @description
         * Get the new position of the target element that would be placed around a host element. This method is only to used to position targetElm
         * if it is not contained in a "relative" positioned container
         */
        self.positionTarget = function (hostElm, targetElm, placement, offset) {
            hostElm = hostElm instanceof HTMLElement ? angular.element(hostElm) : hostElm;
            targetElm = hostElm instanceof HTMLElement ? angular.element(targetElm) : targetElm;

            let host = this.offset(hostElm);
            let target = this.offset(targetElm);


            let left = host.left;
            let top = host.top;
            if (placement === 'top') {
                top = host.top - target.height;
            } else if (placement === 'left') {
                left = host.left - target.width
            } else if (placement === 'bottom') {
                top = host.top + host.height;
            } else if (placement === 'right') {
                left = host.left + host.width
            } else if (placement === 'top-left') {
                left = host.left - target.width;
                top = host.top - target.height;
            } else if (placement === 'top-right') {
                left = host.left + host.width;
                top = host.top - target.height;
            } else if (placement === 'bottom-left') {
                left = host.left - target.width;
                top = host.top + host.height;
            } else if (placement === 'bottom-right') {
                left = host.left + host.width;
                top = host.top + host.height;
            } else if (placement === 'top-center') {
                top = host.top - target.height;
                let diff = (host.width / 2) - (target.width / 2);
                left = host.left + diff;
            } else if (placement === 'left-center') {
                left = host.left - target.width;
                let diff = (host.height / 2) - (target.height / 2);
                top = host.top + diff;
            } else if (placement === 'bottom-center') {
                top = host.top + host.height;
                let diff = (host.width / 2) - (target.width / 2);
                left = host.left + diff;
            } else if (placement === 'right-center') {
                left = host.left + host.width;
                let diff = (host.height / 2) - (target.height / 2);
                top = host.top + diff;
            }
            else {
                console.error('$bs5Position.positionTarget: Invalid value for parameter placement');

                // return not moved
                left =  target.left;
                top = target.top;
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
        };

        /**
         * @ngdoc method
         * @name $bs5Position#positionTargetRelative
         * @kind function
         * @param {DOMElement} hostElm
         * @param {DOMElement} targetElm
         * @param {string} placement
         * @param {number[]} [offset=[0, 0]]
         * @returns {RelativePosition | null}
         * If hostElm and targetElm are in a "relative" positioned container and are in the same container the method
         * returns a {@link RelativePosition} that you can use to place targetElm around hostElm. It returns null if the
         * `hostElm` and `targetElm` are not contained in a relatively positioned element and are not contained in the
         * same relatively positioned container
         *
         *
         * @description
         * Get a new relative position to place a target element around a host element. This method is to only be used if
         * hostElm and targetElm are in the same "relative" positioned container
         *
         * Look at {@link $bs5Position.positionTarget} for details on the parameters
         */
        self.positionTargetRelative = function (hostElm, targetElm, placement, offset) {
            hostElm = hostElm instanceof HTMLElement ? angular.element(hostElm) : hostElm;
            targetElm = hostElm instanceof HTMLElement ? angular.element(targetElm) : targetElm;

            let host = self.relativeOffset(hostElm);
            let target = this.relativeOffset(targetElm);

            let r = null;

            if(hostElm && targetElm && angular.equals(host.container[0], target.container[0])) {

                let left = host.left;
                let top = host.top;

                if (placement === 'right') {
                    left += host.width;
                } else if (placement === 'bottom') {
                    top += host.height;
                } else if (placement === 'left') {
                    left -= target.width;
                } else if (placement === 'top') {
                    top -= target.height;
                } else if (placement === 'top-left') {
                    top -= target.height;
                    left -= target.width;
                } else if (placement === 'top-right') {
                    top -= target.height;
                    left += host.width;
                } else if (placement === 'bottom-left') {
                    top += host.height;
                    left -= target.width;
                } else if (placement === 'bottom-right') {
                    top += host.height;
                    left += host.width;
                } else if (placement === 'top-center') {
                    top -= target.height;
                    let diff = (host.width / 2) - (target.width / 2);
                    left += diff;
                } else if (placement === 'bottom-center') {
                    top += host.height;
                    let diff = (host.width / 2) - (target.width / 2);
                    left += diff;
                } else if (placement === 'left-center') {
                    left -= target.width;
                    let diff = (host.height / 2) - (target.height / 2);
                    top += diff;
                } else if (placement === 'right-center') {
                    left += host.width;
                    let diff = (host.height / 2) - (target.height / 2);
                    top += diff;
                }

                left += angular.isArray(offset) && offset.length > 0 && angular.isNumber(offset[0]) ? offset[0] : 0;
                top += angular.isArray(offset) && offset.length > 1 && angular.isNumber(offset[1]) ? offset[1] : 0;


                r = {
                    top: top,
                    left: left,
                    bottom: top + target.height,
                    right: left + target.width
                };
            }

            return r;
        };

        /**
         * @ngdoc method
         * @name $bs5Position#translateTarget
         * @kind function
         *
         * @param {DOMElement} hostElm
         * @param {DOMElement} targetElm
         * @param {string} placement
         * @param {number[]} [offset=[0, 0]]
         *
         * @return {Translator}
         * The translate coordinates for targetElm. Refer to  {@link Trsnslator} for details on what to do the the value
         *
         * @description
         * Get the translate coordinates for a target element that placed it around a host element.
         *
         * Refer to {@link $bs5Position.positionTarget} for details about the parameters.
         */
        self.translateTarget = function (hostElm, targetElm, placement, offset = [0, 0]) {
            hostElm = hostElm instanceof HTMLElement ? angular.element(hostElm) : hostElm;
            targetElm = hostElm instanceof HTMLElement ? angular.element(targetElm) : targetElm;

            let transform = window.getComputedStyle(targetElm[0]).transform;

            let host = self.offset(hostElm);
            let target = self.offset(targetElm);

            let strs = /^matrix\((\d+?\.?\d*?), (\d+?\.?\d*?), (\d+?\.?\d*?), (\d+?\.?\d*?), (\d+?\.?\d*?), (\d+?\.?\d*?)\)$/.exec(transform);
            let matrix = [];


            if(strs) {
                for(let i = 1; i < strs.length; i++) {
                    matrix.push(parsesFloat(strs[i], 10));
                }

                target.left -= matrix[4];
                target.top -= matrix[5];
            }




            let x = host.left - target.left;
            let y = host.top - target.top;

            let left = host.left;
            let top = host.top;

            if (placement === 'right') {
                x += host.width;
                left += host.width;
            } else if (placement === 'bottom') {
                y += host.height;
                top += host.height;
            } else if (placement === 'left') {
                x -= target.width;
                left -= target.width;
            } else if (placement === 'top') {
                y -= target.height;
                top -= target.height;
            } else if (placement === 'top-left') {
                y -= target.height;
                x -= target.width;

                top -= target.height;
                left -= target.width;
            } else if (placement === 'top-right') {
                y -= target.height;
                x += host.width;

                top -= target.height;
                left += host.width;
            } else if (placement === 'bottom-left') {
                y += host.height;
                x -= target.width;

                top += host.height;
                left -= target.width;
            } else if (placement === 'bottom-right') {
                y += host.height;
                x += host.width;

                top += host.height;
                left += host.width;
            } else if (placement === 'top-center') {
                let diff = (host.width / 2) - (target.width / 2);

                y -= target.height;
                x += diff;

                top -= target.height;
                left += diff;
            } else if (placement === 'bottom-center') {
                let diff = (host.width / 2) - (target.width / 2);

                y += host.height;
                x += diff;

                top += host.height;
                left += diff;
            } else if (placement === 'left-center') {
                let diff = (host.height / 2) - (target.height / 2);

                x -= target.width;
                y += diff;

                left -= target.width;
                top += diff;
            } else if (placement === 'right-center') {
                let diff = (host.height / 2) - (target.height / 2);

                x += host.width;
                y += diff;

                left += host.width;
                top += diff;
            }

            x += angular.isArray(offset) && angular.isNumber(offset[0]) ? offset[0] : 0;
            y += angular.isArray(offset) && angular.isNumber(offset[1]) ? offset[1] : 0;
            left += angular.isArray(offset) && angular.isNumber(offset[0]) ? offset[0] : 0;
            top += angular.isArray(offset) && angular.isNumber(offset[1]) ? offset[1] : 0;



            if(matrix.length === 6) {
                matrix[4] = x;
                matrix[5] = y;
            }

            return {
                x: x,
                y: y,
                left: left,
                top: top,
                matrix: matrix
            };
        }


        self.translateTooltip = function (host, tip, container, placement, fallbackPlacements = ['left', 'right', 'top', 'bottom'], offset = [0, 0]) {
            // set the arrow position
            function getArrowPos() {
                let plc = place === 'left' ? 'right' : (place === 'right' ? 'left' : (place === 'top' ? 'bottom' : 'top'));
                plc += '-center';
                let pos = self.translateTarget(tip, arrow, plc);

                // needed due to the fact that placementClass has not been applied to the tooltip
                if (isPopover) {
                    if (place === 'left' || place === 'right')
                        pos.y -= 5;
                } else {
                    if (place === 'left' || place === 'right') {
                        pos.y -= 3;
                    }
                }

                return pos;
            };

            // set the tooltip position
            function getTipPos() {
                const ttOff = 6;
                const tooltipOff = [place === 'left' ? -ttOff : (place === 'right' ? ttOff : 0), place === 'top' ? -ttOff : (place === 'bottom' ? ttOff : 0)];

                const poOff = 8;
                const popoverOff = [place === 'left' ? -poOff : (place === 'right' ? poOff : 0), place === 'top' ? -poOff : (place === 'bottom' ? poOff : 0)];

                let plc = place + '-center';

                return self.translateTarget(host, tip, plc, isPopover ? popoverOff : tooltipOff);

            };

            // get placement class to apply to the tooltip when applying the css to move it
            function getPlacementClass() {
                let lastPlcClass;

                if (place === 'left')
                    lastPlcClass = isPopover ? 'bs-popover-start' : 'bs-tooltip-start';

                else if (place === 'right')
                    lastPlcClass = isPopover ? 'bs-popover-end' : 'bs-tooltip-end';

                else if (place === 'top')
                    lastPlcClass = isPopover ? 'bs-popover-top' : 'bs-tooltip-top';

                else
                    lastPlcClass = isPopover ? 'bs-popover-bottom' : 'bs-tooltip-bottom';

                return lastPlcClass;
            };

            let coff = self.offset(container);

            // try to position the tooltip if the it is being placed on the top or bottom
            // so it may fit in the container
            function positionLeftRight() {
                if (tipPos.left < coff.left) {
                    if (tip[0].offsetWidth <= coff.width) {
                        let diff = coff.left - tipPos.left;
                        tipPos.x += diff;
                        arrowPos.x -= diff;

                        tipPos.left += diff;
                        arrowPos.left -= diff;
                    }
                }
                // if tipPos.right > coff.right
                else if (tipPos.left + tip[0].offsetWidth > coff.left + coff.width) {
                    // left = tipPos.right - coff.right
                    let left = ((tipPos.left + tip[0].offsetWidth) - (coff.left + coff.width));
                    if (tipPos.left - left >= coff.left) {
                        tipPos.x -= left;
                        arrowPos.x += left;

                        tipPos.left -= left;
                        arrowPos.left += left;
                    }
                }
            };

            // try to position the tooltip if the it is being placed on the left or right
            // so it may fit in the container
            function positionTopBottom() {
                if (tipPos.top < coff.top) {
                    if (tip[0].offsetHeight <= coff.height) {
                        let diff = coff.top - tipPos.top;

                        // move the tooltip inside the container and keep the arrow centered with trigger element
                        tipPos.y += diff;
                        arrowPos.y -= diff;

                        tipPos.top += diff;
                        arrowPos.top -= diff;
                    }
                }
                // if tipPos.bottom > coff.bottom
                else if (tipPos.top + tip[0].offsetHeight > coff.top + coff.height) {
                    // top = tipPos.bottom - coff.bottom
                    let top = ((tipPos.top + tip[0].offsetHeight) - (coff.top + coff.height));
                    if (tipPos.top - top >= coff.top) {
                        // move the tooltip inside the container and keep the arrow centered with trigger element
                        tipPos.y -= top;
                        arrowPos.y += top;

                        tipPos.top -= top;
                        arrowPos.top += top;
                    }
                }
            };

            // if the tooltip will not fit in the container
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
                    return;

                place = fp[index];
                tipPos = getTipPos();
                arrowPos = getArrowPos();

                if (isOutOfRange()) {
                    position();

                    if (isOutOfRange())
                        placeFallback(fp, index + 1);
                } else {
                    position();
                }
            };

            // initializer for placeFallback function
            function placeAtFallback() {
                placeFallback(fallbackPlacements.filter(x => /^(top|bottom|left|right)$/.test(x)), 0);
            }

            let isPopover = tip.hasClass('popover');
            let place = /^(left|right|top|bottom)$/.test(placement) ? placement : (isPopover ? 'right' : 'top');


            let arrow = angular.element(tip[0].querySelector(isPopover ? '.popover-arrow' : '.tooltip-arrow'));
            let tipPos = getTipPos();
            let arrowPos = getArrowPos();

            if (angular.isArray(offset) && offset.length === 2 && angular.isNumber(offset[0]) && angular.isNumber(offset[1])) {
                tipPos.x += offset[0];
                tipPos.y += offset[1];
            }

            if (isOutOfRange()) {
                placeAtFallback();
            }

            return {
                tip: {'transform': 'translate(' + tipPos.x + 'px,' + tipPos.y + 'px)'},
                arrow: {'transform': place === 'bottom' || place === 'top' ? 'translateX(' + arrowPos.x + 'px)' : 'translateY(' + arrowPos.y + 'px)'},
                placementClass: getPlacementClass()
            };
        };
    }])

    /**
     * @ngdoc service
     * @name $bs5DOM
     * @description
     * Provides extra DOM functionality*
     */
    .service('$bs5DOM', ['$q', '$animate', '$timeout', function ($q, $animate, $timeout) {
        /**
         * @ngdoc method
         * @name $bs5DOM#findRelativeContainer
         * @kind function
         *
         * @param elm {DOMElement}
         * The element that possibly has a relatively position container
         *
         * @return {DOMElement | null}
         * The relative positioned container or null if the element has no
         * relative positioned container
         *
         * @description
         * Find the relative positioned container of an element
         */
        this.findRelativeContainer = function (elm) {
            elm = elm instanceof HTMLElement ? angular.element(elm) : elm;

            let node = elm;
            let style = window.getComputedStyle(node[0]);

            while (style && style.position !== 'relative') {
                node = node.parent();
                style = node[0] !== document ? window.getComputedStyle(node[0]) : null;
            }

            return style ? node : null;
        };

        /**
         * @ngdoc method
         * @name $bs5DOM#findScrollableElmemnt
         *
         * @param {DOMEleement} elm
         * The element that is possibly contained in a scrollable container
         *
         * @return {DOMelEmement | null} The container of the element parameter or null if it does not have one
         *
         *@description
         * Find the element's scrollable container.
         */
        this.findScrollableElement = function(elm) {
            let container = null;
            let node = elm.parent();
            let style = window.getComputedStyle(node[0]);
            let exp = /^(auto|scroll)$/;

            while(!exp.test(style.overflow) && !exp.test(style.overflowX) && !exp.test(style.overflowY) && node.length) {
                node = elm.parent();
                style = window.getComputedStyle(node)[0];
            }

            return node.length ? node : null;
        }

        /**
         * @ngdoc method
         * @name $bs5Dom#contains
         * @kind function
         *
         * @param {DOMElement} elm
         * Element to check
         *
         * @param {DOMElement} container
         * Container that possibly contains the element 
         *
         * @return {boolean}
         * It returns true if the element is the container or false if it is not. 
         *
         * @desription
         * Check whether an element is contained within a container or not.
         */
        this.contains = function (elm, container) {
            elm = elm instanceof HTMLElement ? angular.element(elm) : elm;
            container = container instanceof HTMLElement ? angular.element(container) : container;

            let node = elm.parent();

            while (!angular.equals(node, container) && node.length) {
                node = node.parent();
            }

            return !!node.length;
        };

        /**
         * @ngdoc method
         * @name $bs5DOM#prev
         * @kind function
         *
         * @param {DOMElement} elm
         *
         * @return {DOMElement}
         * Returns the previous sibling element
         *
         * @description
         * Get the previous sibling of an element
         */
        this.prev = function(elm) {
            elm = elm instanceof HTMLElement ? angular.element(elm) : elm;

            let children = elm.parent().children();
            let prev = angular.element([]);

            for(let i = 1; i <= children.length; i++) {
                if(children[i] === elm[0])
                    prev = angular.element(children[i - 1]);
            }

            return prev;
        };

        /**
         * @ngdoc method
         * @name $bs5DOM#getCssTimeUnitMs
         * @kind function
         *
         * @param {DOMElement} elm
         * The element to check
         *
         * @param {string} property
         * The css property to check
         *
         * @return {number}
         * The number in milliseconds of the time unit property or 0 if the property is not a css time unit
         *
         * @description
         * Get the milliseconds of a css time unit property from an element
         */
        this.getCssTimeUnitMs = function(elm, property) {
            elm = elm instanceof HTMLElement ? angular.element(elm) : elm;

            property = property
                .replaceAll(/(^[-_]+|[-_]+$)/g, '')
                .replaceAll(/[-_]+/g, '-');

            let split = property.split('-');
            split[0] = split[0].substring(0, 1).toLowerCase() + split[0].substring(1, split[0].length);

            for(let i = 1; i < split.length; i++)
                split[i] = split[i].substring(0, 1).toUpperCase() + split[i].substring(1, split[i].length);

            property = split.join('');

            property = window.getComputedStyle(elm[0])[property];


            return
                property.endsWith('ms') ? parseFloat(property.substring(0, property.length - 2)) :
                (prop.endsWith('s') ? parseFloat(property.substring(0, property.length - 1) * 1000) : 0);
        }

        /**
         * @ngdoc method
         * @name $bs5DOM#fade
         * @kind function
         *
         * @param {DOMElement} elm
         * Element to animate
         *
         * @param {function} [callback]
         * Callback that is called when the animation is done
         *
         * @description
         * Applies Bootstrap 5's fade effect to an element. If the element does not have the 'fade' class then it will
         * not animate. The callback will still be called even if no animation takes place.
         */
        this.fade = function(elm, callback) {
            elm = elm instanceof HTMLElement ? angular.element(elm) : elm;

            let d = window.getComputedStyle(elm[0]).transitionDuration;
            d = elm.hasClass('fade') ? (d.endsWith('ms') ? parseFloat(d.replace('ms', '')) : parseFloat(d.replace('s', '')) * 1000) : d;

            let fn = function () {
                if (elm.hasClass('fade') && typeof callback === 'function')
                    $timeout(callback, d, false);

                else if (typeof callback === 'function')
                    callback();
            }

            $timeout(function () {
                if (elm.hasClass('fade')) {
                    if (elm.hasClass('show')) {
                        elm.removeClass('show');
                        fn();
                    } else {
                        elm.addClass('show');
                        fn();
                    }
                } else {
                    fn();
                }
            }, 0, false)
        }
    }]);