/**
 * @ngdoc module
 * @name bs5.autocomplete
 */
angular.module('bs5.autocomplete', ['bs5.dom'])

    /**
     * @ngdoc directive
     * @name bs5Autocomplete
     * @module bs5.autocomple
     *
     * @restrict AC
     *
     * @param {string} [remoteAddr]
     * Set the autocomplete to make a remote call to the value of this attribute to get it's items.
     *
     * @param {string} [remoteAddrMethod='GET']
     * The request method for the remote sever call
     *
     * Possible Values            'GET' | 'POST' | 'UPDATE' | 'DELETE' |
     *                            'PATCH' | 'OPTIONS'
     *
     *
     * @param {Object} [remoteAddrParams]
     * additional parameters to send remote server call
     *
     * @param {string[]} [datasource]
     * If remoteAddr is not set then the autocomplete will use this array of strings for it's items.
     *
     * @param {string} [matches='start']
     * How to match the view value with the datasource parameter
     *
     * It can be any of these values:
     * |--------------|--------------------------------------------------------------------|
     * |    'start'   |    matches datasource's elements if they start with the view value |
     * |    'end'     |    matches datasourc's elements if they  end with the view vslue   |
     * |    'middle'  |    matches if datasouce's elemnets contain the view value          |
     * |--------------|--------------------------------------------------------------------|
     *
     *
     * @param {number} [minChars=2]
     * The minimum number of characters that has to be type in for the autocomplete to activate
     *
     *
     * @description
     * Autocomplete for input boxes. It matches the
     *
     * Making Remote Server Calls:
     *        When using the remote-addr attribute autocomplete sends a GET variable called 'term' that is the value typed in the text box to the server.
     *        When using 'GET' as request method the addition parameters are passed as get variables in the url. Otherwise they are passed to the body of the request.
     *
     *        bs5Autocomplete expects for the response type to be in JSON format. The server should return an array of strings for the list of items to display to the user
     *
     * How to Use
     <example name="autocomplete" module="autocomplete">
         <file name="index.html">
             <div class="row" ng-controller="AutocompleteController">
                  <div class="col">
                      <h6 class="mb-3">From Array</h6>
                      <input type="text" class="form-control" bs5-autocomplete datasource="datasource">
                  </div>
                  <div class="col">
                      <h6 class="mb-3">From Remote Address</h6>
                      <input type="text" remote-addr="https://apis.adamclayd.workers.dev/ngbs5/examples/autocomlete" remote-addr-method="GET">
                  </div>
             </div>
         </file>
         <file name="script.js">
             angular.module("autocomplete", ['ngBootstrap5'])
                 .controller("AutocompleteController", ["$scope", function($scope) {
                     $scope.datasource = ["Cade Champlin", "Kane Schimmel","Wilmer Spencer", "Vincenza Stoltenberg","Lazaro O'Reilly",
                     "Mack Gutkowski","Mariano Abbott", "Vernon Mohr","Sheila Douglas", "Amya Jacobson","Gennaro Lind", "Corine Satterfield",
                     "Emiliano Zboncak", "Marilyne Welch","Abelardo Cormier", "Vernice Walsh","Darien Emmerich", "Yoshiko McLaughlin",
                     "Claudia Hintz", "Kaelyn Huel","Graciela White", "Neil Friesen","Selmer Lueilwitz", "Christine Konopelski","Donnell O'Reilly",
                     "Ricky Nienow","Ibrahim Gislason", "Xander Cummerata","Conner Bradtke", "Billy Goyette","Gavin Wyman", "Eve DuBuque",
                     "Gwendolyn Hegmann", "Breanna Johnson","Kristin Spinka", "Emil Kautzer","Ignacio Runte", "Yadira Torp","Claire Luettgen",
                     "Tavares Huels","Tyrique Schneider", "Peyton Hamill","Lance O'Hara", "Jacey Schiller","Jaylin Armstrong", "Elmore Skiles",
                     "Torey Ledner", "Amanda Streich","Trycia Kunze", "Rick Roob"];
                 }]);
         </file>
         <file name="remote-addr.js">
              // server side code from https://apis.adamclayd.workers.dev/ngbs5/examples/autocomplete
              function autocomplete (request) {
                  let url = new URL(request.url);
                  let term = url.searchParams.has("term") ? url.searchParams.get("term") : "";

                  let names = ["Simeon Ortiz", "Liliane Bashirian", "David Ryan", "Carson O'Kon", "Sarina Kirlin", "Trudie Orn", "Deshawn Jast",
                  "Christiana Rempel", "Daphne Raynor", "Cecelia Rice", "Merl Brekke", "Josie Hagenes", "Christine Jacobs", "Raegan West",
                  "Christopher McGlynn", "Beryl Zulauf", "Kelley Hessel", "Gilda Hartmann", "Billie Marvin", "Kathlyn Greenfelder", "Rory Kertzmann", "Demetris Hane",
                  "Gilbert Moen", "Whitney Predovic", "Bernhard Waters", "Earl Hane", "Mercedes Luettgen", "Jaleel Schimmel", "Kaitlyn Lemke", "Rebecca Yost",
                  "Carlo Graham", "Cameron Kub", "Henri Toy", "Katarina Quigley", "Demetris Vandervort", "Roslyn Kohler", "Elizabeth Emmerich", "Katlynn Lowe",
                  "Celine Dooley", "Cleveland Howe", "Frankie Zieme", "Kale Bahringer", "Shane Stoltenberg", "Jenifer Bradtke", "Beatrice Kuhlman",
                  "Felicita Jakubowski", "Cade Crona", "Dena Kozey", "Urban Wilderman", "Marcelina Bayer"];


                  return new Response(JSON.stringify(names.filter(x => x.toLowerCase().indexOf(term.toLowerCase()) > -1).sort()), {
                      headers: {
                          "Content-Type": "application/json",
                      }
                  });
              }
         </file>
     </example>
     */
    .directive("bs5Autocomplete", ["$timeout", "$http", "$compile", function($timeout, $http, $compile) {
        return {
            restrict: "AC",
            require: 'ngModel',
            scope: {
                ngModel: "=",
                datasource: "=?",
                matches: '@?',
                remoteAddr: "@?",
                remoteAddrParams: "=?",
                remoteAddrMethod: "@?",
                minChars: '=?',
            },
            link: function (scope, elm, attrs, ctrl) {
                $timeout(function () {
                    if(elm[0].tagName !== 'INPUT' || elm[0].type !== 'text')
                        throw new Error("bs5Autocomplete directive can only be used in input tags");

                    scope.minChars = angular.isNumber(scope.minChars) ? scope.minChars : 2;
                    scope.modelCtrl = ctrl;
                    scope.remoteAddrParams = scope.remoteAddrParams || {};
                    scope.items = [];
                    scope.triggered = false;

                    let list = angular.element('<bs5-autocomplete-list ng-if="triggered" items="items" ng-model="ngModel" model-ctrl="modelCtrl"></bs5-autocomplete-list>');
                    elm.after(list);
                    $compile(list)(scope);

                    elm.on("input", function () {
                        scope.$apply(function () {
                            if (ctrl.$viewValue.length >= scope.minChars) {
                                if (scope.remoteAddr) {
                                    scope.remoteAddrMethod = scope.remoteAddrMethod || "GET";
                                    if (scope.remoteAddrMethod.toLowerCase() !== "get") {
                                        let params = {term: ctrl.$modelValue};
                                        if (angular.isObject(scope.remoteAddrParams))
                                            params = angular.extend({}, scope.remoteAddrParams, params);
                                        $http({
                                            url: scope.remoteAddr,
                                            method: scope.remoteAddrMethod,
                                            data: params,
                                            returnType: "json",
                                        }).then(function (r) {
                                            scope.items = r.data;
                                            scope.triggered = true;
                                        });
                                    } else {
                                        let url = scope.remoteAddr + "?term=" + ctrl.$viewValue;
                                        if (angular.isObject(scope.remoteAddrParams)) {
                                            for (let p in scope.remoteAddrParams)
                                                url += "&" + p + "=" + scope.remoteAddrParams[p];
                                        }
                                        $http({
                                            url: url,
                                            method: scope.remoteAddrMethod,
                                            returnType: "json",
                                        }).then(function (r) {
                                            scope.items = r.data;
                                            scope.triggered = true;
                                        });
                                    }
                                } else if (angular.isArray(scope.datasource)) {
                                    scope.matches = /^(start|end|middle)$/.test(scope.matches) ? scope.matches : 'start';

                                    scope.items = scope.datasource.filter(x => scope.matches === 'start' ? x.toLowerCase().startsWith(ctrl.$viewValue.toLowerCase()) : (scope.matches === 'end' ? x.toLowerCase().endsWith(ctrl.$viewValue.toLowerCase()) : x.toLowerCase().indexOf(ctrl.$viewValue.toLowerCase()) > -1)).sort();
                                    scope.triggered = true;
                                }
                            } else {
                                scope.items = [];
                            }
                        });
                    });

                    elm.on("blur", function () {
                        scope.$apply(function () {
                            scope.triggered = false;
                        });
                    });
                }, 250);
            }
        };
    }])


    .directive("bs5AutocompleteList", ["$document", "$timeout", "$bs5DOM", "$bs5Position", function($document, $timeout, $bs5DOM, $bs5Position) {
        return {
            restrict: "E",
            scope: {
                items: "=",
                modelCtrl: "="
            },
            templateUrl: 'templates/bs5/autocomplete/list.html',
            link: function (scope, elm, attrs, ctrl) {
                let input = $bs5DOM.prev(elm);

                let translator = $bs5Position.translateTarget(input, elm, 'bottom');

                elm.css({
                    width: input[0].offsetWidth,
                    transform: 'translate(' + translator.x + ', ' + translator.y + ')'
                });

                scope.highlighted = null;

                scope.highlight = function (index) {
                    scope.highlighted = index;
                };

                scope.unhighlight = function () {
                    scope.highlighted = null;
                };

                scope.selectItem = function () {
                    scope.modelCtrl.$setViewValue(scope.items[scope.highlighted]);
                    scope.modelCtrl.$commitViewValue();
                    scope.modelCtrl.$render();
                    scope.triggered = false;
                };

                let keydown = function (e) {
                    if (e.which === 38) {
                        scope.$apply(function() {
                            if (scope.highlighted && scope.highlighted > 0) {
                                scope.highlighted--;
                            }
                        });
                    } else if (e.which === 40) {
                        scope.$apply(function() {
                            if (scope.highlighted === null)
                                scope.highlighted = 0;

                            else if (scope.highlighted < scope.items.length - 1)
                                scope.highlighted++;
                        });
                    } else if (e.which === 13) {
                        scope.$apply(scope.selectItem);
                    }
                };

                input.on("keydown", keydown);
            }
        };
    }]);