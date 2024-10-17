/**
 * @ngdoc module
 * @name bs5.accordion
 *
 * @discription
 * ### Bootstrap 5 Accordion Module
 *
 *
 * #### Accordion Group Heading
 * You can use the `heading` attribute to set the header of the accordion group. If you use this you will only be limited to text. To put html into the
 * header you can use the `bs5-accordion-heading` tag within the `bs5-accordion-group` tag.
 *
 * #### How To Use
 <example name="accordion" module="accordion">
     <file name="index.html">
         <bs5-accordion>
             <bs5-accordion-group heading="Text Heading" is-open="false">
                 <div style="background-color: var(--bs-primary-bg-subtle); height: 150px;"></div>
             </bs5-accordion-group>
             <bs5-accordion-group is-open="false">
                 <bs5-accordion-heading><bs5-icon icon="person-fill"> Html Heading</bs5-accordion-heading>
                 <div style="background-color: var(--bs-primary-bg-subtle); height: 150px;"></div>
             </bs5-accordion-group>
         </bs5-accordion>
         <script>
             angular.module('accordion', ['ngBootstrap5']);
         </script>
     </file>
 </example>
 */
angular.module('bs5.accordion', ['bs5.dom'])

    .constant('bs5AccordionConfig', {
        closeOthers: true
    })

    /**
     * @ngdoc type
     * @name bs5Accordion.AccordionController
     *
     * @description
     * Controller that contains methods for manipulating an accordion
     */
    .controller('Bs5AccordionController', ['$scope', '$attrs', 'bs5AccordionConfig', function($scope, $attrs, bs5AccordionConfig) {
        this.groups = [];
        let self = this;

        /**
         * @ngdoc method
         * @name bs5Accordion.AccordionController#closeOthers
         *
         * @param {$rootScope.Scope} openGroup
         * The accordion group that is to be left open
         *
         * @description
         * Closes all other accordion groups within the accordion except for the one passed to `openGroup`
         */
        this.closeOthers = function (openGroup) {
            let closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : bs5AccordionConfig.closeOthers;
            if (closeOthers) {
                angular.forEach(self.groups, function (group) {
                    if (group !== openGroup)
                        group.isOpen = false;
                });
            }
        };

        /**
         * @ngdoc method
         * @name bs5Accordion.AccordionController#addGroup
         *
         * @param {$rootScope.Scope} groupScope
         * The scope of an accordion group to add
         *
         * @description
         * Add an accordion group to the accordion
         */
        this.addGroup = function (groupScope) {
            self.groups.push(groupScope);
            groupScope.$on('$destory', function (event) {
                self.removeGroup(groupScope);
            });
        };

        /**
         * @ngdoc method
         * @name bs5Accordion.AccordionController#removeGroup
         *
         * @param {$rootScope.Scope} group
         * The scope of an accordion group to remove
         *
         * @description
         * Remove an accordion group from the accordion
         */
        this.removeGroup = function (group) {
            let index = self.groups.indexOf(group);
            if (index >= 0)
                self.groups.splice(index, 1);
        };
    }])

    /**
     * @ngdoc directive
     * @name bs5Accordion
     * @module bs5.accordion
     *
     * @restrict E
     *
     * @description
     * This directive is the outer container for an accordion
     *
     * How To Use:
     * ```html
     * <bs5-accordion>
     *     <!-- put {@link bs5AccordionGroup} diectives here -->
     * </bs5-accordion>
     * ```
     */
    .directive('bs5Accordion', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: 'templates/bs5/accordion/accordion.html',
            controller: 'Bs5AccordionController',
            controllerAs: 'accordion'
        };
    })

    /**
     * @ngdoc directive
     * @name bs5AccordionGroup
     * @module bs5.accordion
     * @restrict E
     *
     *
     * @param {string} [heading]
     * The text to display in the header
     *
     * @param {boolean} isOpen
     * Indicates whether or not to open the accordion group
     *
     * @param {boolean} [isDisabled]
     * Indicates whether or not to disable the accordion group
     *
     * @description
     * This is the directive that you put your accordion group content in
     * See {@link bs5.accordion} for detailed examples.
     *
     * How to Use:
     * ```html
     * <bs5-accordion-group heading="Group Heading">
     *     <!-- Accordion Group Content -->
     * </bs5-accordion-group>
     * ```
     */
    .directive('bs5AccordionGroup', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            require: '^bs5Accordion',
            templateUrl: 'templates/bs5/accordion/accordion-group.html',
            controller: function () {
                let self = this;
                this.setHeading = function (elm) {
                    self.heading = elm;
                };
            },
            scope: {
                heading: '@',
                isOpen: '=?',
                isDisabled: '=?'
            },
            link: function (scope, elm, attrs, accordionCtrl) {
                accordionCtrl.addGroup(scope);
                scope.$watch('isOpen', function (value) {
                    if (value)
                        accordionCtrl.closeOthers(scope);
                });
                scope.toggleOpen = function (event) {
                    if (!scope.isDisabled) {
                        if (!event || event.which === 32)
                            scope.isOpen = !scope.isOpen;
                    }
                }
            }
        }
    })

    .directive('bs5AccordionHeading', function() {
        return {
            require: '^bs5AccordionGroup',
            transclude: true,
            template: '',
            replace: true,
            link: function (scope, elm, attrs, accordionGroup, transclude) {
                accordionGroup.setHeading(transclude(scope, angular.noop));
            }
        }
    })

    .directive('bs5AccordionTransclude', function() {
        return {
            require: '^bs5AccordionGroup',
            link: function (scope, elm, attrs, accordionGroup) {
                scope.$watch(function () {
                    return accordionGroup[attrs.bs5AccordionTransclude];}, function (heading) {
                    if (heading) {
                        let elem = angular.element(elm[0].querySelector('bs5-accordion-header, data-bs5-accordion-header, [bs5-accordion-header], [data-bs5-accordion-header]'));
                        elem.html('');
                        elem.append(heading);
                    }
                });
            }
        }
    });