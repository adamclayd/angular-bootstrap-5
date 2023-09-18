/**
 * Module: bs5.collapse
 */
angular.module('bs5.collapse', ['bs5.dom'])

/**
 * Directive: bs5Collapse
 *
 * Attributes:
 *      bs5-collapse: <boolean> indicates whether to collapse or expand the element
 *
 *      horizontal:    <boolean>             if true then the expanding and collapsing animations will
 *                                           be horizontal
 *
 *      on-expanded:   <expression>          the event handler that is fired after the collapse has expanded
 *
 *      on-collapsed   <expression>          the event handler that is fired after the collapse has collapsed
 */
.directive('bs5Collapse', ['$timeout', '$bs5DOM', function($timeout, $bs5DOM) {
    return {
        restrict: 'A',
        scope: {
            onExpanded: '&?',
            onCollapsed: '&?',
            horizontal: '=?'
        },
        link: function(scope, elm, attrs) {

            elm.css({
                'overflow': 'hidden'
            });

            elm.addClass('collapse');

            if(scope.$eval(attrs.bs5Collapse))
                elm.addClass('show');


            scope.$watch(attrs.bs5Collapse, function($new, $old) {
                if(!angular.equals($new, $old)) {
                    if ($new && angular.isDefined($old)) {
                        $bs5DOM.slide(elm, 1, 0, scope.horizontal).then(function () {
                            elm.removeClass('show');
                            scope.onCollapsed();
                        });
                    }
                    else if (angular.isDefined($old)) {
                        elm.addClass('show');
                        $bs5DOM.slide(elm, 0, 1, scope.horizontal).then(scope.onExpanded);
                    }
                }
            });
        }
    }
}]);