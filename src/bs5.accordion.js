/**
 * Module: bs5.accordion
 */
angular.module('bs5.accordion', ['bs5.collapse'])

    /**
     * Constant: bs5AccordionConfig
     */
    .constant('bs5AccordionConfig', {
        closeOthers: true
    })

    /**
     * Controller: bs5AccordionController
     */
    .controller('Bs5AccordionController', ['$scope', '$attrs', 'bs5AccordionConfig', function($scope, $attrs, bs5AccordionConfig) {
        this.groups = [];

        let self = this;

        /**
         * Closes all other accordion groups other than the passed open group if the
         * option is set to true.
         *
         * @param openGroup {Object} the scope to the accordion that you do not
         * want to close
         */
        this.closeOthers = function(openGroup) {
            let closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : bs5AccordionConfig.closeOthers;

            if(closeOthers) {
                angular.forEach(self.groups, function(group) {
                    if(group !== openGroup)
                        group.isOpen = false;
                });
            }
        };

        /**
         * Adds an accordion group to the accordion
         *
         * @param groupScope {Object} the scope to the accordion group
         * you want to add
         */
        this.addGroup = function(groupScope) {
            self.groups.push(groupScope);


            groupScope.$on('$destory', function(event) {
                self.removeGroup(groupScope);
            });
        };

        /**
         * Removes an accordion group from the accordion.
         *
         * @param group {Object} the scope of the accordion group that
         * you want to remove
         */
        this.removeGroup = function(group) {
            let index = self.groups.indexOf(group);

            if(index >= 0)
                self.groups.splice(index, 1);
        };
    }])

    /**
     * Directive: bs5Accordion
     *
     * The accordion outer container
     */
    .directive('bs5Accordion', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: function(element, attrs) {
                return attrs.templateUrl || 'angular/bootstrap5/templates/accordion/accordion.html';
            },
            controller: 'Bs5AccordionController',
            controllerAs: 'accordion'
        };
    })

    /**
     * Directive: bs5AccordionGroup
     *
     * Accordion section container.
     *
     * Requires:
     *      ^bs5Accordion
     *
     * Attributes:
     *      heading:     <string>     the text to display in the header
     *      is-open:     <boolean>    whether or not to open the accordion group
     *      is-disabled: <boolean>    whether or not to disable the accordion group
     *
     * Accordion Group Heading:
     *      You can use the `heading` attribute to set the header of the accordion group. If you use this you will only be limited to text. To put html into the
     *      header you can use the `bs5-accordion-header` tag within the `bs5-accordion-group` tag.
     *
     *      Example:
     *          <bs5-accordion-group>
     *              <bs5-accordion-header><img src="header.png"></bs5-accordion-header>
     *              ... Accordion Group Content ...
     *          </bs5-accordion-group>
     */
    .directive('bs5AccordionGroup', function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            require: '^bs5Accordion',
            templateUrl: function(element, attrs) {
                return attrs.templateUrl || 'angular/bootstrap5/templates/accordion/accordion-group.html';
            },
            controller: function() {
                let self = this;

                this.setHeading = function(elm){
                    self.heading = elm;
                };
            },
            scope: {
                heading: '@',
                isOpen: '=?',
                isDisabled: '=?'
            },
            link: function(scope, elm, attrs, accordionCtrl) {
                accordionCtrl.addGroup(scope);
                scope.$watch('isOpen', function(value) {
                    if(value)
                        accordionCtrl.closeOthers(scope);
                });


                scope.toggleOpen = function(event) {
                    if(!scope.isDisabled) {
                        if(!event || event.which === 32)
                            scope.isOpen = !scope.isOpen;
                    }
                }
            }
        }
    })

    /**
     * Directive: bs5AccordionHeading
     *
     * Sets a transcluded bs5-accordion-heading element as the
     * accordion group header (not for public use)
     */
    .directive('bs5AccordionHeading', function() {
        return {
            require: '^bs5AccordionGroup',
            transclude: true,
            template: '',
            replace: true,
            link: function(scope, elm, attrs, accordionGroup, transclude) {
                accordionGroup.setHeading(transclude(scope, angular.noop));
            }
        }
    })

    /**
     * Directive: bs5AccordionTransclude
     *
     * moves heading element from accordion group element and puts it in
     * the accordion header element (not for public use)
     */
    .directive('bs5AccordionTransclude', function() {
        return {
            require: '^bs5AccordionGroup',
            link: function(scope, elm, attrs, accordionGroup) {
                scope.$watch(function() { return accordionGroup[attrs.bs5AccordionTransclude]; }, function(heading) {
                    if(heading) {
                        let elem = angular.element(elm[0].querySelector('bs5-accordion-header, data-bs5-accordion-header, [bs5-accordion-header], [data-bs5-accordion-header]'));
                        elem.html('');
                        elem.append(heading);
                    }
                });
            }
        }
    })

    /**
     * Accordion templates
     */
    .run(['$templateCache', function($templateCache){
        $templateCache.put(
            'angular/bootstrap5/templates/accordion/accordion.html',
            '<div class="accordion">' +
                '<ng-transclude></ng-transclude>' +
            '</div>'
        );

        $templateCache.put(
            'angular/bootstrap5/templates/accordion/accordion-group.html',
            '<div class="accordion-item">' +
                '<h2 class="accordion-header">' +
                    '<button type="button" ng-click="toggleOpen()" ng-class="{collapsed: !isOpen}" class="accordion-button" bs5-accordion-transclude><span bs5-accordion-header>{{heading}}</span></button>' +
                '</h2>' +
                '<div class="accordion-collapse" bs5-collapse="!isOpen">' +
                    '<div class="accordion-body">' +
                        '<ng-transclude></ng-transclude>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }]);