/**
 * Module: bs5.progressbar
 */
angular.module('bs5.progressbar', ['bs5.dom'])

    /**
     * Directive: bs5Progressbar
     *
     * Attributes:
     *
     * 		value:          <number>     the progress value;
     * 	    display-percent <boolean>    if true the percentage will be displayed in the progressbar
     */
    .directive('bs5Progressbar', ['$bs5DOM', function($bs5DOM) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                value: '=',
                displayPercent: '=?',
                showStatus: '=?',
                showCount: '=?',
                statusText: '@?',
                countCompleted: '=?',
                countTotal: '=?',
                countType: '@?'
            },
            templateUrl: function(elm, attrs) {
                return attrs.templateUrl || 'angular/bootstrap5/templates/progressbar/progressbar.html';
            },
            link: function(scope, elm, attrs) {
                scope.type = attrs.type ? attrs.type : null;
                scope.striped =  !!scope.$eval(attrs.striped);
                scope.animate = !!scope.$eval(attrs.animate) && scope.striped;

                if(scope.value < 0)
                    scope.value = 0;
                else if(scope.value > 100)
                    scope.value = 100;
                let old = scope.value;

                scope.$watch('value', function($new, $old) {
                    if(!angular.equals($new, $old) && angular.isDefined($old)) {
                        if($new < 0)
                            scope.value = 0;
                        else if($new > 100)
                            scope.value = 100;


                        $bs5DOM.animate(elm[0].querySelector('.progress-bar'), [
                            {width: $old + 'px'},
                            {width: $new + 'px'}
                        ], 300);
                    }
                });
            }
        }
    }])

    .run(['$templateCache', function($templateCache) {
        $templateCache.put(
            'angular/bootstrap5/templates/progressbar/progressbar.html',
            '<div class="progress">' +
                '<div class="progress-bar {{type ? \'bg-\' + type : \'\'}}" ng-class="{\'progress-bar-striped\': striped, \'progress-bar-animated\': animate}" style="width: {{value}}%" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="100">' +
                    '<span ng-if="displayPercent">{{value}}%</span>' +
                '</div>' +
            '</div>'
        );
    }]);