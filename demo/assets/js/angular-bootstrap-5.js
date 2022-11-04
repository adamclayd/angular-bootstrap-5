(function() {
	var bootstrap4 = angular.module('ngBootstrap5', [
		'bs5.templates', 
		'bs5.collapse', 
		'bs5.accordion',
		'bs5.alert'
	]);
	var templates = angular.module('bs5.templates', [
		'angular/bootstrap5/templates/accordion/accordion.html', 
		'angular/bootstrap5/templates/accordion/accordion-group.html',
		'angular/bootstrap5/templates/alert/alert.html'
	]);
	
	
	
	var collapse = angular.module('bs5.collapse', []);
	
	collapse.directive('bs5Collapse', ['$parse', function($parse) {
		return {
			link: function(scope, elm, attrs) {
				
				var onExpanding = $parse(attrs.expanding);
				var onExpanded = $parse(attrs.expanded);
				var onCollapsing = $parse(attrs.collapsing);
				var onCollapsed = $parse(attrs.collapsed);
				
				var dom = elm[0];
				var collapse = new bootstrap.Collapse(dom, {toggle: scope.$eval(!attrs.bs5Collapse)});
				
				dom.addEventListener('show.bs.collapse', function() {
					onExpanding(scope);
				});
				
				dom.addEventListener('shown.bs.collapse', function() {
					onExpanded(scope);
				});
				
				dom.addEventListener('hide.bs.collapse', function() {
					onCollapsing(scope);
				});
				
				dom.addEventListener('hidden.bs.collapse', function() {
					onCollapsed(scope);
				});
				
				scope.$watch(attrs.bs5Collapse, function(shouldCollapse) {
					if(shouldCollapse) {
						collapse.hide();
					}
					else {
						collapse.show();
					}
				});
			}
		}
	}]);
	
	var tabindex = angular.module('bs5.tabindex', []);
	
	tabindex.directive('bs5TabindexToggle', function() {
		return {
			restrict: 'A',
			link: function(scope, elm, attrs) {
				attrs.$observe('disabled', function(disabled) {
					attrs.$set('tabindex', disabled ? -1 : null);
				});
			}
		};
	})
	
	
	var accordion = angular.module('bs5.accordion', ['bs5.collapse'])
	
	accordion.constant('bs5AccordionConfig', {
		closeOthers: true
	});

	accordion.controller('Bs5AccordionController', ['$scope', '$attrs', 'bs5AccordionConfig', function($scope, $attrs, bs5AccordionConfig) {
		this.groups = [];
				
		var self = this;
				
		this.addGroup = function(groupScope) {
			self.groups.push(groupScope);
			
			this.closeOthers = function(openGroup) {
				var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : bs5AccordionConfig.closeOthers;
				
				if(closeOthers) {
					angular.forEach(self.groups, function(group) {
						if(group !== openGroup)
							group.isOpen = false;
					});
				}
			};
			
			groupScope.$on('$destory', function(event) {
				self.removeGroup(groupScope);
			});
		};
		
		this.removeGroup = function(group) {
			var index = self.groups.indexOf(group);
			
			if(index >= 0)
				self.groups.splice(index, 1);
		};
	}]);
	
	accordion.directive('bs5Accordion', function() {
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
	});
	
	accordion.directive('bs5AccordionGroup', function() {
		return {
			restrict: 'E',
			transclude: true,
			replace: true,
			require: '^bs5Accordion',
			templateUrl: function(element, attrs) {
				return attrs.templateUrl || 'angular/bootstrap5/templates/accordion/accordion-group.html';
			},
			controller: function() {
				var self = this;
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
	});
	
	accordion.directive('bs5AccordionHeading', function() {
		return {
			require: '^bs5AccordionGroup',
			transclude: true,
			template: '',
			replace: true,
			link: function(scope, elm, attrs, accordionGroup, transclude) {
				accordionGroup.setHeading(transclude(scope, angular.noop));
			}
		}
	});
	
	accordion.directive('bs5AccordionTransclude', function() {
		return {
			require: '^bs5AccordionGroup',
			link: function(scope, elm, attrs, accordionGroup) {
				scope.$watch(function() { return accordionGroup[attrs.bs4AccordionTransclude]; }, function(heading) {
					if(heading) {
						var elem = angular.element(elm[0].querySelector('bs5-accordion-header, data-bs5-accordion-header, [bs5-accordion-header], [data-bs5-accordion-header]'));
						elem.html('');
						elem.append(heading);
					}
				});
			}
		}
	});
	
	var alert = angular.module('bs5.alert', []);
	
	alert.directive('bs5Alert', function() {
		return {
			retrict: 'E',
			transclude: true,
			replace: true,
			templateUrl: function(elm, attrs) {
				return attrs.templateUrl || 'angular/bootstrap5/templates/alert/alert.html'
			},
			scope: {
				type: '@',
				dismissible: '='
			},
			link: function(scope, elm, attrs) {
				scope.close = function() {
					elm.remove();
				}
			}
		};
	});
	
	
	angular.module('angular/bootstrap5/templates/accordion/accordion.html', []).run(['$templateCache', function($templateCache){
		$templateCache.put(
			'angular/bootstrap5/templates/accordion/accordion.html',
			'<div class="accordion">' +
				'<ng-transclude></ng-transclude>' +
			'</div>'                                        
		);
	}]);
	
	angular.module('angular/bootstrap5/templates/accordion/accordion-group.html', []).run(['$templateCache', function($templateCache) {
		$templateCache.put(
			'angular/bootstrap5/templates/accordion/accordion-group.html',
			'<div class="accordion-item">' +
				'<h2 class="accordion-header">' + 
					'<button type="button" ng-click="toggleOpen()" ng-class="{collapsed: !isOpen}" class="accordion-button" aria-expanded="{{isOpen.toString()}}" bs5-accordion-transclude="heading"><span bs5-accordion-header>{{heading}}</span></button>' +
				'</h2>' +
				'<div class="accordion-collapse collapse" bs5-collapse="!isOpen">' +
					'<div class="accordion-body">' + 
						'<ng-transclude></ng-transclude>' +
					'</div>' +
			'</div>'
		);
	}]);
	
	angular.module('angular/bootstrap5/templates/alert/alert.html', []).run(['$templateCache', function($templateCache) {
		$templateCache.put(
			'angular/bootstrap5/templates/alert/alert.html',
			'<div class="alert alert-{{type || \'primary\'}} d-flex align-items-center" ng-class="{\'alert-dismissible\': dismissible}" role="alert">' +
				'<ng-transclude></ng-transclude>' +
				'<button ng-if="dismissible" ng-click="close()" type="button" class="btn-close"></button>' +
			'</div>'
		);
	}]);
})();