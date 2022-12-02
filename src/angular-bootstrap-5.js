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
		'bs5.modal',
		'bs5.tooltip',
		'bs5.popover',
		'bs5.pagination'
	]);
	
	var templates = angular.module('bs5.templates', [
		'angular/bootstrap5/templates/accordion/accordion.html', 
		'angular/bootstrap5/templates/accordion/accordion-group.html',
		'angular/bootstrap5/templates/alert/alert.html',
		'angular/bootstrap5/templates/progressbar/progressbar.html',
		'angular/bootstrap5/templates/tabs/tabset.html',
		'angular/bootstrap5/templates/tabs/tab.html',
		'angular/bootstrap5/templates/pagination/pagination.html'
	]);
	
	
	
	var collapse = angular.module('bs5.collapse', []);
	
	collapse.directive('bs5Collapse', ['$parse', function($parse) {
		return {
			restrict: 'A',
			link: function(scope, elm, attrs) {
				var onExpanding = $parse(attrs.expanding);
				var onExpanded = $parse(attrs.expanded);
				var onCollapsing = $parse(attrs.collapsing);
				var onCollapsed = $parse(attrs.collapsed);
				
				elm.addClass('collapse');
				
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
				type: '@?',
				dismissible: '=?'
			},
			link: function(scope, elm, attrs) {
				scope.type = scope.type || 'primary';
				scope.close = function() {
					elm.remove();
				}
			}
		};
	});
	
	angular.module('angular/bootstrap5/templates/alert/alert.html', []).run(['$templateCache', function($templateCache) {
		$templateCache.put(
			'angular/bootstrap5/templates/alert/alert.html',
			'<div class="alert alert-{{type}} d-flex align-items-center" ng-class="{\'alert-dismissible\': dismissible}" role="alert">' +
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
				displayPercent: '=?'
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
				
				var old = scope.value;
				scope.$watch(scope.value, function(value) {
					if(old !== value) {
						if(value < 0)
							scope.value = 0;
						else if(value > 100)
							scope.value = 100;
						
						if($animateCss) {
							$animateCss(angular.element(elm[0].querySelector('.progress-bar')), {
								from: {width: old + '%'},
								to: {width: value + '%'},
								duration: 0.25
							});
						}
						else {
							$animate.animate(angular.element(elm[0].querySelector('.progress-bar')), {width: old + '%'}, {width: value + '%'});
						}
					}
					
					old = scope.value;
				});
			}
		}
	}]);
	
	angular.module('angular/bootstrap5/templates/progressbar/progressbar.html', []).run(['$templateCache', function($templateCache) {
		$templateCache.put(
			'angular/bootstrap5/templates/progressbar/progressbar.html',
			'<div class="progress">' +
				'<div class="progress-bar {{type ? \'bg-\' + type : \'\'}}" ng-class="{\'progress-bar-striped\': striped, \'progress-bar-animated\': animate}" style="width: {{value}}%" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="100">' +
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
				'<button class="nav-link" ng-disabled="disabled" ng-class="{active: active, disabled: disabled}" ng-click="select($event)" bs5-heading-transclude>{{heading}}</button>' +
			'</li>'
		)
	}]);
	
	var modal = angular.module('bs5.modal', []);
	
	modal.service('$bs5Modal', ['$templateCache', '$controller', '$compile', '$rootScope', '$q', '$document', '$http', function($templateCache, $controller, $compile, $rootScope, $q, $document, $http) {
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
				}).then(function(r) { contentDeferred.resolve(r.data); }, function() { contentDeferred.resolve($templateCache.get(options.templateUrl)); });
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
			
			angular.element($document[0].querySelector(options.container)).append(elm);
			$compile(elm)(windowScope);
			
			var content = angular.element(elm[0].querySelector('.modal-content'));
			
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
			};
		}
	}]);
	
	var tooltip = angular.module('bs5.tooltip', []);
	
	tooltip.directive('bs5Tooltip', ['$templateCache', '$document', '$compile', '$http', '$q', function($templateCache, $document, $compile, $http, $q) {
		function genId() {
			var id = "bs5tooltip" + Math.floor((Math.random() * 100) + 1);
			
			if($document[0].querySelector('#' + id))
				id = genId();
				
			return id;
		};
		
		return {
			restrict: 'A',
			link: function(scope, elm, attrs) {
				var deferred = $q.defer();
				var id = genId();
				
				var offset = attrs.offset ? scope.$eval(attrs.offset) : [0, 0];
				var delay = attrs.delay ? scope.$eval(attrs.delay) : 0;
				var animate = attrs.animate ? !!scope.$eval(attrs.animate) : true;
				var html = attrs.html ? !!scope.$eval(attrs.html) : false;
				
				if(attrs.templateUrl) {
					$http({
						url: attrs.templateUrl,
						method: 'GET'
					}).then(function(r) {
						var content = '<div id="' + id + '">' + r.data + '</div>';
						deferred.resolve(content);
					}, function() {
						var content = '<div id="' + id + '">' + $templateCache.get(attrs.templateUrl) + '</div>';
						deferred.resolve(content);
					});
				}
				else {
					var content = html ? '<div id="' + id + '">' + attrs.bs5Tooltip + '</div>' : attrs.bs5Tooltip;
					deferred.resolve(content);
				}
				
				deferred.promise.then(function(content) {
					var tooltipScope = scope.$new();
					var tooltip = new bootstrap.Tooltip(elm[0], {
						container: attrs.container || 'body',
						animation: animate,
						html: !!attrs.templateUrl || html,
						sanitize: !!!attrs.templateUrl || !html,
						title: content,
						placement: attrs.placement || 'top',
						delay: angular.isNumber(delay) || angular.isObject(delay) ? delay : 0,
						offset: angular.isArray(offset) ? offset : [0, 0],
						trigger: 'manual'
					});
					
					if(attrs.trigger === 'click') {
						elm.on('click', function() {
							tooltip.toggle();
						});
					}
					else if(attrs.trigger === 'focus') {
						elm.on('focus', function() {
							tooltip.show();
						});
						
						elm.on('blur', function() {
							tooltip.hide();
						});
					}
					else {
						elm.on('mouseenter', function() {
							tooltip.show();
						});
					
						elm.on('mouseleave', function() {
							tooltip.hide();
						});
					}
				});
			}
		};
	}]);
	
	var popover = angular.module('bs5.popover', []);
	
	popover.directive('bs5Popover', ['$templateCache', '$document', '$compile', '$http', '$q', function($templateCache, $document, $compile, $http, $q) {
		function genId() {
			var id = 'bs5popover' + Math.floor((Math.random() * 100) + 1);
			
			if($document[0].querySelector('#' + id))
				id = genId();
				
			return id;
		}
		
		return {
			restrict: 'A',
			scope: {
				onLoad: '=?loadCb'
			},
			link: function(scope, elm, attrs) {
				var deferred = $q.defer();
				var id = genId();
				
				var animate = attrs.animate ? !!scope.$eval(attrs.animate) : true;
				var container = attrs.container && $document[0].querySelector(attrs.container) ? attrs.container : 'body';
				var delay = attrs.delay ? scope.$eval(attrs.delay) : 0;
				var html = attrs.html ? !!scope.$eval(attrs.html) : false;
				var placement = attrs.placement === 'left' || attrs.placement === 'top' || attrs.placement === 'bottom' ? attrs.placement : 'right';
				var title = attrs.title || '';
				var trigger = attrs.trigger === 'focus' || attrs.trigger === 'hover' ? attrs.trigger : 'click';
				var offset = attrs.offset ? scope.$eval(attrs.offset) : [0, 0];
				
				if(attrs.templateUrl) {
					$http({
						url: attrs.templateUrl,
						method: 'GET'
					}).then(function(r) {
						var content = '<div id="' + id + '">' + r.data + '</div>';
						deferred.resolve(content);
					}, function() {
						var content = '<div id="' + id + '">' + $templateCache.get(attrs.templateUrl) + '</div>';
						deferred.resolve(content);						
					});
				}
				else {
					var content = html ? '<div id="' + id + '">' + attrs.bs5Popover + '</div>' : attrs.bs5Popover;
					deferred.resolve(content);
				}
				
				deferred.promise.then(function(content) {
					var popoverScope = scope.$new();
					var popover = new bootstrap.Popover(elm[0], {
						animation: animate,
						container: container,
						content: content,
						delay: angular.isNumber(delay) || angular.isObject(delay) ? delay : 0,
						html: !!attrs.templateUrl || html,
						placement: placement,
						title: title,
						trigger: 'manual',
						sanitize: !!!attrs.templateUrl || !html,
						offset: angular.isArray(offset) ? offset : [0, 0]
					});
					
					popoverScope.params = {popover: popover};
					
					elm.on('shown.bs.popover', function() {
						var element = $document[0].querySelector('#' + id);
						
						if(element) {
							$compile(angular.element(element))(popoverScope);
							
							if(angular.isFunction(scope.onLoad)) {
								scope.$apply(function() {
									scope.onLoad(popoverScope);
								});
							}
						}
					});
					
					
					if(trigger === 'hover') {
						elm.on('mouseenter', function() {
							popover.show();
						});
						
						elm.on('mouseleave', function() {
							popover.hide();
						});
					}
					else if(trigger === 'focus') {
						elm.on('focus', function() {
							popover.show();
						});
						
						elm.on('blur', function() {
							popover.hide();
						});
					}
					else {
						elm.on('click', function() {
							popover.toggle();
						});
					}
				});
			}
		};
	}]);
	
	var pagination = angular.module('bs5.pagination', []);
	
	pagination.constant('bs5PaginationConfig', {
		pageSize: 10,
		displayPagesRange: 5,
		firstPageText: 'First',
		previousPageText: 'Previous',
		nextPageText: 'Next',
		lastPageText: 'Last',
		withFirstLast: true,
		withPreviousNext: true,
		size: null,
		align: null
	});
	
	pagination.directive('bs5Pagination', ['bs5PaginationConfig', function(bs5PaginationConfig) {
		function range(p, q) {
			var ret = [];
			if(p <= q) {
				for(var i = p; i <= q; i++)
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
				function getStartEndRange(r) {
					var start = scope.currentPage - r > 1 ? scope.currentPage - r : 1;
					var end = start + r < scope.numberPages ? start + r : scope.numberPages
					return {
						start: start,
						end: end
					};
				}
				
				
				var pageRange = scope.$eval(attrs.displayPagesRange);
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
						scope.numberPages = Math.ceil(value / scope.pageSize);
						
						if(scope.currentPage > scope.numberPages) {
							scope.currentPage = scope.numberPages;
						}
						
						var r = getStartEndRange(pageRange);
						scope.pages = range(r.start, r.end);
						
						if(scope.pageChange)
							scope.pageChange({$page: scope.currentPage, $pageSize: scope.pageSize});
					}
				});
				
				scope.$watch('pageSize', function(value, old) {
					if(value !== old) {
						scope.numberPages = Math.ceil(scope.numberItems / value);
						
						if(scope.currentPage > scope.numberPages) {
							scope.currentPage = scope.numberPages;
						}
						
						var r = getStartEndRange(pageRange);
						scope.pages = range(r.start, r.end);
						
						if(scope.pageChange)
							scope.pageChange({$page: scope.currentPage, $pageSize: value});
					}
				});
				
				scope.$watch('currentPage', function(value, old) {
					if(value !== old) {
						var r = getStartEndRange(pageRange);
						scope.pages = range(r.start, r.end);
						
						if(scope.pageChange)
							scope.pageChange({$page: value, $pageSize: scope.pageSize});
					}
				});
				
				scope.changePage = function(page, evt) {
					evt.preventDefault();
					
					scope.currentPage = page;
				};
				
				var rng = getStartEndRange(pageRange);
				
				
				scope.pages = range(rng.start, rng.end);
			}
		};
	}]);
	
	angular.module('angular/bootstrap5/templates/pagination/pagination.html', []).run(['$templateCache', function($templateCache) {
		$templateCache.put(
			'angular/bootstrap5/templates/pagination/pagination.html',
			'<nav>' +
				'<ul class="pagination {{size === \'lg\' || size === \'sm\' ? \'pagination-\' + size : \'\'}}" ng-class="{\'justify-content-center\': align === \'center\', \'justify-content-end\': align === \'right\'}">' +
					'<li class="page-item" ng-if="withFirstLast" ng-disabled="currentPage <= 1" ng-class="{disabled: currentPage <= 1}">' +
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
					'<li class="page-item" ng-if="withFirstLast" ng-disabled="currentPage >= numberPages" ng-class="{disabled: currentPage >= numberPages}">' +
						'<a class="page-link" href="#" ng-click="changePage(numberPages, $event)">{{lastPageText}}</a>"' +
					'</li>' +
				'</ul>' +
			'</nav>'
		)
	}]);
})();