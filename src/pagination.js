angular.module('bs5.pagination', [])

    .constant('bs5PaginationConfig', {
        displayPagesRange: 5,
        firstPageText: '<<',
        previousPageText: '<',
        nextPageText: '>',
        lastPageText: '>>',
        withFirstLast: true,
        withPreviousNext: true,
        size: null,
        align: 'left',
        useIcons: true,
        lastPageIcon: 'chevron-bar-right',
        firstPageIcon: 'chevron-bar-left',
        previousPage: 'chevron-left',
        nextPageIcon: 'chevron-right',
        align: 'left',
        pivot: false
    })

    /**
     * @ngdoc directive
     * @name bs5Pagination
     * @scope
     *
     * @param {expression} [pageChange]
     * The event handler that is fired when the page is changed $page is the page that the paginator changed to can be applied to the expression
     *
     * @param {number} currentPage
     * The current page number. You would probably want to set it 1 to start the paginator off
     *
     * @param {number} numberItems
     * the number of items in the entire result set
     *
     * @param {number} pageSize
     * The number of items on each page
     *
     * @param {number} [pageRange=5]
     * The number of pages that the paginator displays. If pivot is true then you it and this
     * value is an even number then 1 gets added to it to keep the active page in the middle.
     *
     * @param {boolean} [withFirstLast=true]
     * Indicates whether or not to display the first and last page links
     *
     * @param {boolean} [withPreviousNext=true]
     * Indicates whether or not to display the previous an next page links
     *
     * @param {string} [firstPageText='<<']
     * The text for the first page link
     *
     * @param {string} [lastPageText='>>']
     * The text for the last page link
     *
     * @param {string} [previousPageText='<']
     * The text for the previous page link
     *
     * @param {string} [nextPageText='>']
     * The text for the next page link
     *
     * @param {string} [size]
     * The bootstrap size for pagination. The value can be 'sm' or 'lg'
     *
     * @param {string} [align='left']
     * The horizontal alignment. Valid value are  'left', 'center', or 'right'
     *
     * @param {boolean} [pivot=false]
     * If true then pagination will set the active page at the center of the page list.
     *
     * @description
     * Bootstrap 5 styled pagination. You will be able to change pages by utilizing the page-change attribute
     */
    .directive('bs5Pagination', ['bs5PaginationConfig', function(bs5PaginationConfig) {
        return {
            restrict: 'E',
            scope: {
                pageChange: '&?',
                currentPage: '=',
                numberItems: '=',
                pageSize: '=',
                pageRange: '=?',
                withFirstLast: '=?',
                withPreviousNext: '=?',
                firstPageText: '@?',
                lastPageText: '@?',
                previousPageText: '@?',
                nextPageText: '@?',
                size: '@?',
                icons: '=?',
                firstPageIcon: '@?',
                lastPageIcon: '@?',
                nextPageIcon: '@?',
                previousPageIcon: '@?',
                align: '@?',
                pivot: '=?'
            },
            templateUrl: 'templates/bs5/pagination/pagination.html',
            link: function(scope, elm, attrs) {
                scope.pageRange = scope.pageRange || bs5PaginationConfig.displayPagesRange;
                scope.withFirstLast = angular.isDefined(scope.withFirstLast) ? scope.withFirstLast : bs5PaginationConfig.withFirstLast;
                scope.withPreviousNext = angular.isDefined(scope.withPreviousNext) ? scope.withPreviousNext : bs5PaginationConfig.withPreviousNext;
                scope.pageSize = angular.isDefined(scope.pageSize) ? scope.pageSize : bs5PaginationConfig.pageSize;
                scope.firstPageText = scope.firstPageText || bs5PaginationConfig.firstPageText;
                scope.previousPageText = scope.previousPageText || bs5PaginationConfig.previousPageText;
                scope.nextPageText = scope.nextPageText || bs5PaginationConfig.nextPageText;
                scope.lastPageText = scope.lastPageText || bs5PaginationConfig.lastPageText;
                scope.size = scope.size || bs5PaginationConfig.size;
                scope.align = scope.align || bs5PaginationConfig.align;
                scope.numberPages = Math.ceil(scope.numberItems / scope.pageSize);
                scope.pages = [];
                scope.pivot = angular.isDefined(scope.pivot) ? scope.pivot : bs5PaginationConfig.pivot;

                scope.$watch('numberItems', function(value, old) {
                    if(!angular.equals(value, old)) {
                        scope.numberPages = Math.ceil(scope.numberItems / scope.pageSize);

                        if(scope.currrentPage > scope.numberPages) {
                            scope.pages = [];
                            scope.currentPage = scope.numberPages;
                            displayPages();
                        }

                        if(scope.pageChange) {
                            scope.pageChange({$page: scope.currentPage, $pageSize: scope.pageSize});
                        }
                    }
                });

                scope.$watch('pageSize', function(value, old) {
                    if(!angular.equals(value, old)) {
                        scope.numberPages = Math.ceil(scope.numberItems / scope.pageSize);

                        if(scope.currrentPage > scope.numberPages)
                            displayPages();

                        if(scope.pageChange) {
                            scope.pageChange({$page: scope.currentPage, $pageSize: scope.pageSize});
                        }
                    }
                });

                scope.$watch('currentPage', function(value, old) {
                    if(!angular.equals(value, old)) {
                        displayPages();

                        if(scope.pageChange)
                            scope.pageChange({$page: scope.currentPage, $pageSize: scope.pageSize});
                    }
                });

                scope.changePage = function(page, evt) {
                    evt.preventDefault();

                    scope.currentPage = page;
                };

                function range(r1, r2) {
                    let ret = [];
                    for(let i = r1; i < r2; i++)
                        ret.push(i);

                    return ret;
                }

                function displayPages() {
                    let page = scope.currentPage;
                    let r = page % scope.pageRange;
                    let r2 = page + (scope.pageRange - r);
                    let r1 = page - r;

                    if (scope.numberPages < scope.pageRange) {
                        r1 = 1;
                        r2 = scope.numberPages;
                    } else if (r2 >= scope.numberPages) {
                        r2 = scope.numberPages;
                        r1 = r2 - scope.pageRange;
                    }

                    if(scope.pivot) {
                        let pivot = Math.ceil(scope.pageRange / 2);

                        if(page >= pivot) {
                            r1 = page - pivot;
                            r2 = r1 + scope.pageRange;

                            if(r2 >= scope.numberPages) {
                                r2 = scope.numberPages;
                                r1 = r2 - scope.pageRange;
                            }
                        }
                    }

                    scope.pages = range(r1 + 1, r2 + 1);
                }

                displayPages();
            }
        };
    }]);