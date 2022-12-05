(function(){
	var app = angular.module('demo', ['ngAnimate', 'ngBootstrap5']);
	
	app.controller('MainController', ['$scope', '$bs5Modal', '$q', function($scope, $bs5Modal, $q) {
		$scope.collapse = {
			collapsed: true,
			toggle: function() {
				$scope.collapse.collapsed = !$scope.collapse.collapsed;
			}
		};
		
		$scope.progressbar = {
			setProgress: function() {
				$scope.progressbar.progress = Math.floor(Math.random() * 100);
			}
		};
		
		$scope.progressbar.setProgress();
		
		$scope.modal = {
			open: function() {
				var modal = $bs5Modal({
					controller: ['$scope', function(scope) {
						scope.title = 'Modal';
						scope.resolver = 'Alert some text';
						
						scope.close = function() {
							modal.dismiss();
						};
						
						scope.resolve = function() {
							modal.close(scope.resolver);
						};
					}],
					templateUrl: 'modal.html'
				});
				
				modal.result.then(function(data) {
					alert(data);
				});
			}
		};
		
		$scope.pagination = {
			headers: ['Ut', 'varius', 'tincidunt', 'libero', 'tempor', 'cursus'],
			data: [
				['Etiam', 'iaculis', 'nunc', 'metus', 'mauris', 'rutrum'],
				['Fusce', 'fermentum', 'odio', 'arcu', 'Nullam', 'mollis'],
				['Proin', 'magna', 'Fusce', 'diam', 'Pellentesque', 'Donec'],
				['Aenean', 'vulputate', 'eleifend', 'tellus', 'varius', 'quam'],
				['Curabitur', 'tristique', 'sem', 'rutrum', 'lectus', 'tincidunt'],
				['Proin', 'magna', 'Fusce', 'diam', 'Pellentesque', 'Donec'],
				['Etiam', 'iaculis', 'nunc', 'metus', 'mauris', 'rutrum'],
				['Fusce', 'fermentum', 'odio', 'arcu', 'Nullam', 'mollis'],
				['Curabitur', 'tristique', 'sem', 'rutrum', 'lectus', 'tincidunt'],
				['Curabitur', 'tristique', 'sem', 'rutrum', 'lectus', 'tincidunt'],
				['Proin', 'magna', 'Fusce', 'diam', 'Pellentesque', 'Donec'],
				['Aenean', 'vulputate', 'eleifend', 'tellus', 'varius', 'quam'],
				['Curabitur', 'tristique', 'sem', 'rutrum', 'lectus', 'tincidunt'],
				['Etiam', 'iaculis', 'nunc', 'metus', 'mauris', 'rutrum'],
				['Fusce', 'fermentum', 'odio', 'arcu', 'Nullam', 'mollis'],
				['Aenean', 'vulputate', 'eleifend', 'tellus', 'varius', 'quam'],
				['Curabitur', 'tristique', 'sem', 'rutrum', 'lectus', 'tincidunt'],
				['Curabitur', 'tristique', 'sem', 'rutrum', 'lectus', 'tincidunt'],
				['Etiam', 'iaculis', 'nunc', 'metus', 'mauris', 'rutrum'],
				['Fusce', 'fermentum', 'odio', 'arcu', 'Nullam', 'mollis'],
				['Aenean', 'vulputate', 'eleifend', 'tellus', 'varius', 'quam'],
				['Curabitur', 'tristique', 'sem', 'rutrum', 'lectus', 'tincidunt'],
				['Etiam', 'iaculis', 'nunc', 'metus', 'mauris', 'rutrum'],
				['Proin', 'magna', 'Fusce', 'diam', 'Pellentesque', 'Donec'],
				['Curabitur', 'tristique', 'sem', 'rutrum', 'lectus', 'tincidunt'],
				['Etiam', 'iaculis', 'nunc', 'metus', 'mauris', 'rutrum'],
				['Fusce', 'fermentum', 'odio', 'arcu', 'Nullam', 'mollis'],
				['Aenean', 'vulputate', 'eleifend', 'tellus', 'varius', 'quam'],
				['Proin', 'magna', 'Fusce', 'diam', 'Pellentesque', 'Donec'],
				['Aenean', 'vulputate', 'eleifend', 'tellus', 'varius', 'quam'],
				['Curabitur', 'tristique', 'sem', 'rutrum', 'lectus', 'tincidunt'],
				['Proin', 'magna', 'Fusce', 'diam', 'Pellentesque', 'Donec'],
				['Aenean', 'vulputate', 'eleifend', 'tellus', 'varius', 'quam'],
				['Curabitur', 'tristique', 'sem', 'rutrum', 'lectus', 'tincidunt'],
				['Etiam', 'iaculis', 'nunc', 'metus', 'mauris', 'rutrum'],
				['Fusce', 'fermentum', 'odio', 'arcu', 'Nullam', 'mollis'],
				['Proin', 'magna', 'Fusce', 'diam', 'Pellentesque', 'Donec'],
				['Aenean', 'vulputate', 'eleifend', 'tellus', 'varius', 'quam'],
				['Curabitur', 'tristique', 'sem', 'rutrum', 'lectus', 'tincidunt'],
				['Proin', 'magna', 'Fusce', 'diam', 'Pellentesque', 'Donec'],
				['Curabitur', 'tristique', 'sem', 'rutrum', 'lectus', 'tincidunt'],
				['Etiam', 'iaculis', 'nunc', 'metus', 'mauris', 'rutrum'],
			],
			changePage: function(page, pageSize) {
				if (!angular.isDefined($scope.pagination.pager))
					$scope.pagination.pager = {};
					
				$scope.pagination.pager.page = page;
				$scope.pagination.pager.pageSize = pageSize;
				$scope.pagination.pager.numItems = $scope.pagination.data.length;
				$scope.pagination.pager.items = [];
				
				for(var i = (page - 1) * pageSize; i < ((page - 1) * pageSize) + pageSize && i < $scope.pagination.data.length; i++) {
					$scope.pagination.pager.items.push($scope.pagination.data[i]);
				}
			}
		};
		
		$scope.pagination.changePage(1, 5);
		
		$scope.datepicker = {model: null};
		
		$scope.autocomplete = {
			model: null,
			datasource: ['Foo', 'Bar', 'Baz', 'Foobaz', 'Barfoo', 'Foobar', 'Bazfoo']
		};
		
		$scope.rating = {
			model: 0
		};
	}]);
})();