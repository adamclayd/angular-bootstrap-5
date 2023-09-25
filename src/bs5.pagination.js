/**
 * Module: bs5.pagination
 */
angular.module('bs5.pagination', [])

    .constant('bs5PaginationConfig', {
        pageSize: 10,
        displayPagesRange: 5,
        firstPageText: 'First',
        previousPageText: 'Previous',
        nextPageText: 'Next',
        lastPageText: 'Last',
        withFirstLast: true,
        withPreviousNext: true,
        size: null,
        align: 'left'
    })

    /**
     * Directive: bs5Pagination
     *
     * Attributes:
     *
     *      pageChange:           <expression>                        the event handler that is fired when the page is changed. $page and $pageSize can be applied to the
     *                                                                expression
     *
     *      currentPage:          <number>                            the current page number
     *
     *      numberItems:          <number>                            the number of items in the entire result set
     *
     *      pageSize:             <number>                            the number of items on each page
     *
     *      with-first-last:      <boolean>                           whether or not to display the first and last page links {default: true}
     *
     *      with-previous-next:   <boolean>                           whether or not to display the previous an next page links {default: true}
     *
     *      first-page-text:      <string>                            the text for the first page link {default: 'First'}
     *
     *      last-page-text:       <string>                            the text for the last page link {default: 'Last'}
     *
     *      previous-page-text:   <string>                            the text for the previous page link {default: 'Previous'}
     *
     *      next-page-text:       <string>                            the text for the next page link {default: 'Next'}
     *
     *      size:                 <'sm' | 'lg' | null>                the bootstrap size for pagination {default: null}
     *
     *      align:                <'left' | 'center' | 'right'>       the horizontal alignment {default: 'left'}
     */
    .directive('bs5Pagination', ['bs5PaginationConfig', function(bs5PaginationConfig) {
        function range(p, q) {
            let ret = [];
            if(p <= q) {
                for(let i = p; i <= q; i++)
                    ret.push(i);
            }

            return ret;
        }

        return {
            restrict: 'E',
            replace: true,
            scope: {
                pageChange: '&?',
                currentPage: '=',
                numberItems: '=',
                pageSize: '=?',
            },
            templateUrl: function(elm, attrs) {
                return attrs.templateUrl || 'angular/bootstrap5/templates/pagination/pagination.html';
            },
            link: function(scope, elm, attrs) {
                function getStartEndRange() {
                    let start = null;
                    let end = null;

                    if(!scope.pages.length) {
                        if(pageRange + 1 >= scope.numberPages) {
                            start = 1;
                            end = scope.numberPages;
                        }
                        else if(scope.currnetPage - pageRange < 1) {
                            start = 1;
                            end = start + pageRange;
                        }
                        else if (scope.currentPage + pageRange > scope.numberPages){
                            end = scope.numberPages;
                            start = end - pageRange;
                        }
                        else {
                            start = scope.currentPage;
                            end = start + pageRange;
                        }
                    }
                    else {
                        if(pageRange + 1 >= scope.numberPages) {
                            start = 1;
                            end = scope.numberPages;
                        }
                        else if((scope.currentPage === scope.pages[scope.pages.length - 1] || scope.currentPage === scope.pages[scope.pages.length - 1] + 1) && scope.currentPage < scope.numberPages) {
                            start = scope.currentPage;

                            if(start + pageRange >= scope.numberPages) {
                                end = scope.numberPages;
                                start = end - pageRange;
                            }
                            else {
                                end = start + pageRange;
                            }
                        }
                        else if((scope.currentPage === scope.pages[0] || scope.currentPage === scope.pages[0] - 1) && scope.currentPage > 1) {
                            end = scope.currentPage;

                            if(end - pageRange <= 1) {
                                start = 1;
                                end = start + pageRange;
                            }
                            else {
                                start = end - pageRange;
                            }
                        }
                        else if(scope.currentPage === 1) {
                            start = 1;
                            end = start + pageRange;
                        }
                        else if(scope.currentPage === scope.numberPages) {
                            end = scope.numberPages;
                            start = end - pageRange;
                        }
                    }

                    return {
                        start: start,
                        end: end
                    }
                };


                let pageRange = scope.$eval(attrs.displayPagesRange);
                pageRange = (angular.isNumber(pageRange) ? pageRange : bs5PaginationConfig.displayPagesRange) - 1;

                scope.pageRange = pageRange;
                scope.withFirstLast = attrs.withFirstLast === 'true' || attrs.withFirstLast === 'false' ? scope.$eval(attrs.withFirstLast) : bs5PaginationConfig.withFirstLast;
                scope.withPreviousNext = attrs.withPreviousNext === 'true' || attrs.withPreviousNext === 'false' ? scope.$eval(attrs.withPreviousNext) : bs5PaginationConfig.withPreviousNext;
                scope.pageSize = scope.pageSize || bs5PaginationConfig.pageSize;
                scope.firstPageText = attrs.firstPageText || bs5PaginationConfig.firstPageText;
                scope.previousPageText = attrs.previousPageText || bs5PaginationConfig.previousPageText;
                scope.nextPageText = attrs.nextPageText || bs5PaginationConfig.nextPageText;
                scope.lastPageText = attrs.lastPageText || bs5PaginationConfig.lastPageText;
                scope.size = attrs.size || bs5PaginationConfig.size;
                scope.align = attrs.align || bs5PaginationConfig.align;
                scope.numberPages = Math.ceil(scope.numberItems / scope.pageSize);
                scope.pages = [];

                scope.$watch('numberItems', function(value, old) {
                    if(value !== old) {
                        scope.numberPages = Math.ceil(scope.numberItems / scope.pageSize);

                        if(scope.currrentPage > scope.numberPages) {
                            scope.pages = [];
                            scope.currentPage = scope.numberPages;
                        }
                        else if(scope.pageChange) {
                            scope.pageChange({$page: scope.currentPage, $pageSize: scope.pageSize});
                        }
                    }
                });

                scope.$watch('pageSize', function(value, old) {
                    if(value !== old) {
                        scope.numberPages = Math.ceil(scope.numberItems / scope.pageSize);


                        if(scope.currrentPage > scope.numberPages) {
                            scope.pages = [];
                            scope.currentPage = scope.numberPages;
                        }
                        else if(scope.pageChange) {
                            scope.pageChange({$page: scope.currentPage, $pageSize: scope.pageSize});
                        }
                    }
                });

                scope.$watch('currentPage', function(value, old) {
                    if(value !== old) {

                        if(scope.currentPage === scope.pages[0] || scope.currentPage === scope.pages[0] - 1 || scope.currentPage === scope.pages[scope.pages.length - 1] || scope.currentPage === scope.pages[scope.pages.length - 1] + 1 || scope.currentPage === 1 || scope.currentPage === scope.numberPages || !scope.pages.length) {
                            let r = getStartEndRange();
                            scope.pages = range(r.start, r.end);
                        }

                        if(scope.pageChange)
                            scope.pageChange({$page: scope.currentPage, $pageSize: scope.pageSize});
                    }
                });

                scope.changePage = function(page, evt) {
                    evt.preventDefault();

                    scope.currentPage = page;
                };

                let rng = getStartEndRange();
                scope.pages = range(rng.start, rng.end);
            }
        };
    }])

    .run(['$templateCache', function($templateCache) {
        $templateCache.put(
            'angular/bootstrap5/templates/pagination/pagination.html',
            '<nav>' +
            '<ul class="pagination {{size === \'lg\' || size === \'sm\' ? \'pagination-\' + size : \'\'}}" ng-class="{\'justify-content-center\': align === \'center\', \'justify-content-end\': align === \'right\'}">' +
            '<li class="page-item" ng-if="withFirstLast && numberPages > pageRange + 1" ng-disabled="currentPage <= 1" ng-class="{disabled: currentPage <= 1}">' +
            '<a class="page-link" href="#" ng-click="changePage(1, $event)">{{firstPageText}}</a>' +
            '</li>' +
            '<li class="page-item" ng-if="withPreviousNext" ng-disabled="currentPage <= 1" ng-class="{disabled: currentPage <= 1}">' +
            '<a class="page-link" href="#" ng-click="changePage(currentPage - 1, $event)">{{previousPageText}}</a>' +
            '</li>' +
            '<li class="page-item" ng-repeat-start="page in pages" ng-if="page !== currentPage"">' +
            '<a class="page-link" href="#" ng-click="changePage(page, $event)">{{page}}</a>' +
            '</li>' +
            '<li class="page-item active" ng-repeat-end ng-if="page === currentPage">' +
            '<a class="page-link" href="#" ng-click="$event.preventDefault()">{{page}}</a>' +
            '</li>' +
            '<li class="page-item" ng-if="withPreviousNext" ng-disabled="currentPage >= numberPages" ng-class="{disabled: currentPage >= numberPages}">' +
            '<a class="page-link" href="#" ng-click="changePage(currentPage + 1, $event)">{{nextPageText}}</a>' +
            '</li>' +
            '<li class="page-item" ng-if="withFirstLast && numberPages > pageRange + 1" ng-disabled="currentPage >= numberPages" ng-class="{disabled: currentPage >= numberPages}">' +
            '<a class="page-link" href="#" ng-click="changePage(numberPages, $event)">{{lastPageText}}</a>' +
            '</li>' +
            '</ul>' +
            '</nav>'
        );
    }]);