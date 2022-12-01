/**
 * ngBootStrap5 v0.1
 */
(function() {
	
	if(typeof bootstrap === 'undefined') {
		throw "Must include the Bootstrap 5 javascript file";
	}
	
	var bootstrap5 = angular.module('ngBootstrap5', [
		'bs5.templates', 
		'bs5.collapse', 
		'bs5.accordion',
		'bs5.alert',
		'bs5.progressbar',
		'bs5.tabs',
		'bs5.modal'
	]);
	
	var templates = angular.module('bs5.templates', [
		'angular/bootstrap5/templates/accordion/accordion.html', 
		'angular/bootstrap5/templates/accordion/accordion-group.html',
		'angular/bootstrap5/templates/alert/alert.html',
		'angular/bootstrap5/templates/progressbar/progressbar.html',
		'angular/bootstrap5/templates/tabs/tabset.html',
		'angular/bootstrap5/templates/tabs/tab.html'
	]);
	
	
	
	var collapse = angular.module('bs5.collapse', []);
	
	collapse.directive('bs5Collapse', ['$parse', function($parse) {
		return {
			restrict: 'EA',
			link: function(scope, elm, attrs) {
				var onExpanding = $parse(attrs.expanding);
				var onExpanded = $parse(attrs.expanded);
				var onCollapsing = $parse(attrs.collapsing);
				var onCollapsed = $parse(attrs.collapsed);
				
				var collapse = new bootstrap.Collapse(elm[0], {toggle: false});
				
				elm.on('show.bs.collapse', function() {
					onExpanding(scope);
				});
				
				elm.on('shown.bs.collapse', function() {
					onExpanded(scope);
				});
				
				elm.on('hide.bs.collapse', function() {
					onCollapsing(scope);
				});
				
				elm.on('hidden.bs.collapse', function() {
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
		this.closeOthers = function(openGroup) {
			var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : bs5AccordionConfig.closeOthers;
				
			if(closeOthers) {
				angular.forEach(self.groups, function(group) {
					if(group !== openGroup)
						group.isOpen = false;
				});
			}
		};
		
		this.addGroup = function(groupScope) {
			self.groups.push(groupScope);
			
			
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
	
	angular.module('angular/bootstrap5/templates/alert/alert.html', []).run(['$templateCache', function($templateCache) {
		$templateCache.put(
			'angular/bootstrap5/templates/alert/alert.html',
			'<div class="alert alert-{{type || \'primary\'}} d-flex align-items-center" ng-class="{\'alert-dismissible\': dismissible}" role="alert">' +
				'<ng-transclude></ng-transclude>' +
				'<button ng-if="dismissible" ng-click="close()" type="button" class="btn-close"></button>' +
			'</div>'
		);
	}]);
	
	var progressbar = angular.module('bs5.progressbar', []);
	
	progressbar.directive('bs5Progressbar', ['$animate', '$injector', function($animate, $injector) {
		var $animateCss = $injector.has('$animateCss') ? $injector.get('$animateCss') : null;
		
		return {
			restrict: 'E',
			replace: true,
			scope: {
				value: '=',
				displayPercent: '='
			},
			templateUrl: function(elm, attrs) {
				return attrs.templateUrl || 'angular/bootstrap5/templates/progressbar/progressbar.html';
			},
			link: function(scope, elm, attrs) {
				var old = scope.value;
				scope.$watch(scope.value, function(value) {
					if(old !== value) {
						if($animateCss) {
							$animateCss(elm.find('.progress-bar'), {
								from: {width: old + '%'},
								to: {width: value + '%'},
								duration: 0.25
							});
						}
						else {
							$animate.animate(elm.find('.progress-bar'), {width: old + '%'}, {width: value + '%'});
						}
					}
					
					old = value;
				});
			}
		}
	}]);
	
	angular.module('angular/bootstrap5/templates/progressbar/progressbar.html', []).run(['$templateCache', function($templateCache) {
		$templateCache.put(
			'angular/bootstrap5/templates/progressbar/progressbar.html',
			'<div class="progress">' +
				'<div class="progress-bar" style="width: {{value}}%" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="100">' +
					'<span ng-if="displayPercent">{{value}}%</span>' + 
				'</div>' +
			'</div>'
		);
	}]);
	
	var tabs = angular.module('bs5.tabs', []);
	
	tabs.controller('Bs5TabsetController', ['$scope', function($scope) {
		var ctrl = this;
		var oldIndex = null;
		ctrl.tabs = [];
		
		ctrl.select = function(index, evt) {
			if(evt && evt.target.tagName.toLowerCase() === 'a')
					evt.preventDefault();
			
			if(!destroyed && index >= 0 && index < ctrl.tabs.length) {
				if(angular.isNumber(oldIndex)) {
					ctrl.tabs[oldIndex].onDeselect({$tabIndex: ctrl.active, $event: evt});
					ctrl.tabs[oldIndex].active = false;
				}
				
				oldIndex = ctrl.active;
				
				ctrl.active = index;
				ctrl.tabs[index].onSelect({$tabIndex: index, $event: evt});
				ctrl.tabs[index].active = true;
			}
		};
		
		ctrl.addTab = function(tab) {
			ctrl.tabs.push(tab);
			
			if(!angular.isNumber(ctrl.active) && ctrl.tabs.length === 1)
				ctrl.select(0);
			else if(ctrl.active === ctrl.tabs.length - 1)
				ctrl.select(ctrl.active);
		};
		
		ctrl.removeTab = function(tab) {
			var index = ctrl.findTabIndex(tab);
			
			if(index !== null) {
				ctrl.tabs.splice(index, 1);
				
				if(index === ctrl.active) {
					var newIndex = ctrl.active === ctrl.tabs.length ? ctrl.active - 1 : (ctrl.active + 1) % ctrl.tabs.length;
					ctrl.select(newIndex);
				}
			}
		};
		
		ctrl.findTabIndex = function(tab) {
			var index = null;
			for(var i = 0; i < ctrl.tabs.length; i++) {
				if(ctrl.tabs[i] === tab) {
					index = i;
					break;
				}
			}
			
			return index;
		}
		
		$scope.$watch('tabset.active', function(val) {
			if(angular.isDefined(val) && val !== oldIndex) {
				ctrl.select(val);
			}
		});
		
		var destroyed;
		$scope.$on('$destroy', function() {
			destroyed = true;
		});
	}]);
	
	tabs.directive('bs5Tabset', function() {
		return {
			restrict: 'E',
			scope: {},
			transclude: true,
			replace: true,
			bindToController: {
				active: '=?',
				type: '@'
			},
			controller: 'Bs5TabsetController',
			controllerAs: 'tabset',
			templateUrl: function(elm, attrs) {
				return attrs.templateUrl || 'angular/bootstrap5/templates/tabs/tabset.html';
			},
			link: function(scope, elm, attrs) {
				scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
				scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
			}
		}
	});
	
	tabs.directive('bs5Tab', ['$parse', function($parse) {
		return {
			require: '^bs5Tabset',
			restrict: 'E',
			transclude: true,
			replace: true,
			scope: {
				heading: '@',
				onSelect: '&select',
				onDeselect: '&deselect'
			},
			templateUrl: function(elm, attrs) {
				return attrs.templateUrl || 'angular/bootstrap5/templates/tabs/tab.html'
			},
			controller: function() {},
			controllerAs: 'tab',
			link: function(scope, elm, attrs, ctrl, transclude) {
				scope.disabled = false;
				if(attrs.disable) {
					scope.$parent.$watch($parse(attrs.disable), function(value) {
						scope.disabled = !!value;
					});
				}
				
				scope.select = function(evt) {
					if(!scope.disabled) {
						ctrl.select(ctrl.findTabIndex(scope), evt);
					}
				}
				
				scope.$transcludeFn = transclude;
				ctrl.addTab(scope);
				
				scope.$on('$destroy', function() {
					ctrl.removeTab(scope);
				});
			}
			
		};
	}]);
	
	tabs.directive('bs5TabHeadingTransclude', function() {
		return {
			restrict: 'A',
			require: '^bs5Tab',
			link: function(scope, elm) {
				scope.$watch('headingElement', function updateHeadingElement(heading) {
					if(heading) {
						elm.html('');
						elm.append(heading);
					}
				});
			}
		};
	});
	
	tabs.directive('bs5TabContentTransclude', function() {
		return {
			restrict: 'A',
			require: '^bs5Tabset',
			link: function(scope, elm, attrs) {
				function isTabHeading(node) {
					return node.tagName && (
						node.hasAttribute('bs5-tab-heading') ||
						node.hasAttribute('data-bs5-tab-heading') ||
						node.hasAttribute('x-bs5-tab-heading') ||
						node.tagName.toLowerCase() === 'bs5-tab-heading' ||
						node.tagName.toLowerCase() === 'data-bs5-tab-heading' ||
						node.tagName.toLowerCase() === 'x-bs5-tab-heading' ||
						node.tagName.toLowerCase() === 'bs5:tab-heading'
					);
				}
				
				var tab = scope.$eval(attrs.bs5TabContentTransclude);
				
				tab.$transcludeFn(tab.$parent, function(contents) {
					angular.forEach(contents, function(node) {
						if(isTabHeading(node)) {
							tab.headingElement = node;
						}
						else {
							elm.append(node);
						}
					});
				});
			}
		}
	})
	
	
	angular.module('angular/bootstrap5/templates/tabs/tabset.html', []).run(['$templateCache', function($templateCache) {
		$templateCache.put(
			'angular/bootstrap5/templates/tabs/tabset.html',
			'<div>' +
				'<nav>' + 
					'<ul class="nav" ng-class="{\'flex-column\': vertical, \'me-3\': vertical, \'nav-pills\': vertical || tabset.type === \'pills\', \'mb-3\': !vertical, \'nav-tabs\': !vertical && (tabset.type === \'tabs\' || !tabset.type), \'nav-justified\': justified}" ng-transclude></ul>' +
				'</nav>' +
				'<div class="tab-content">' +
					'<div class="tab-pane fade" ng-repeat="tab in tabset.tabs" ng-class="{show: tabset.active === $index, active: tabset.active === $index}" bs5-tab-content-transclude="tab"></div>' +
				'</div>' +
			'</div>'
		);
	}]);
	
	angular.module('angular/bootstrap5/templates/tabs/tab.html', []).run(['$templateCache', function($templateCache) {
		$templateCache.put(
			'angular/bootstrap5/templates/tabs/tab.html',
			'<li class="nav-item">' +
				'<button class="nav-link" ng-class="{active: active, disabled: disabled}" ng-click="select($event)" bs5-heading-transclude>{{heading}}</button>' +
			'</li>'
		)
	}]);
	
	var modal = angular.module('bs5.modal', []);
	
	modal.service('$bs5Modal', ['$controller', '$compile', '$rootScope', '$q', '$document', '$http', function($controller, $compile, $rootScope, $q, $document, $http) {
		return function(options) {
			var defaults = {
				backdrop: false,
				size: null,
				centered: false,
				scrollable: false,
				container: 'body'
			};
			
			options = angular.extend({}, defaults, options);
			
			var contentDeferred = $q.defer();
			var modalDeferred = $q.defer();
			var modal = null;
			
			if(angular.isString(options.templateUrl)) {
				$http({
					method: 'GET',
					url: options.templateUrl
				}).then(function(r) { contentDeferred.resolve(r.data); });
			}
			else if(angular.isString(options.template)) {
				contentDeferred.resolve(options.template);
			}
			else {
				throw new Error("Must provide either option template or option templateUrl");
			}
			
			var windowScope = $rootScope.$new();
			var contentScope = windowScope.$new();
			
			windowScope.size = options.size;
			windowScope.centered = options.centered;
			windowScope.scrollable = options.scrollable;
			
			var elm = angular.element(
				'<div class="modal fade">' +
					'<div class="modal-dialog {{size ? \'modal-\' + size : \'\'}}" ng-class="{\'modal-dialog-centered\': centered, \'modal-dialog-scrollable\': scrollable}">' +
						'<div class="modal-content"></div>' + 
					'</div>' +
				'</div>'
			);
			
			$document.find(options.container).append(elm);
			$compile(elm)(windowScope);
			
			var content = elm.find('.modal-content');
			
			contentDeferred.promise.then(function(html) {
				content.html(html);
				
				if(angular.isString(options.controller) || angular.isFunction(options.controller) || angular.isArray(options.controller)) {
					var ctrl = $controller(options.controller, {$scope: contentScope}, true, options.controllerAs);
					ctrl = ctrl();
					
					if(angular.isFunction(ctrl.$onInit)) 
						ctrl.$onInit();
				}
				
				$compile(content)(contentScope);
				
				modal = new bootstrap.Modal(elm[0], {backdrop: options.backdrop});
				elm.on('hidden.bs.modal', function() {
					elm.remove();
				});
				
				modal.show();
			});
			
			return {
				result: modalDeferred.promise,
				close: function(data) {
					if(modal) {
						modal.hide();
						modalDeferred.resolve(data);
					}
				},
				dismiss: function() {
					if(modal)
						modal.hide();
				}
			}
		}
	}]);
	
})();