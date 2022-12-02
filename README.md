# ngBootstrap5


Directives and services that work with bootstrap 5. 
It has been tested and works with Bootstrap v5.1.3.

## Collapse

The `bs5-collapse` attribute is a boolean to determine if the collapse is collapsed or not. Set to `true` to hide the collapse.
Set to `false` to expand the collapse.

###### HTML File
```html
...
<div ng-controller="MainController">
	<button type="button" class="btn btn-primary" ng-click="collapsed = !collapsed">Toggle Section</button>
	<div bs5-collapse="collapsed">
		... collapsed content ...
	</div>
</div>
...

```

###### Javascript File
```javascript
...
module.controller('MainController', ['$scope', function($scope) {
	$scope.collapsed = true;
}]);
...

```

## Accordion

```
Accordion Attributes
	close-others - set to true to only allow one accordion group open at a time. It defaults to true.

Accordion Group Attributes
	heading - set the title for the accordion group
	is-open - whether the accordion group is opened or not
```
###### Example

```html
<bs5-accordion close-others="true">
	<bs5-accordion-group is-open="false" heading="Heading Set With Heading Attribute">
		... accordion group content ...
	</bs5-accordion-group>
	<bs5-accordion-group is-open="false">
		<bs5-accordion-header>Heading Set With The Accordion Header Element</bs5-accordion-header>
		... accordion group content ...
	</bs5-accordion-group>
</bs5-accordion>
```


## Alerts

```
Alert Attributes
	type        - Bootstrap alert type. Valid values are 'primary', 'secondary', 'success', 
	              'danger', 'warning', 'info', 'light', and 'dark'. Default is 'primary'
	
	dismissible - If true it adds a close button that removes the alert. Default is false
```

###### Example
```html
<bs5-alert type="danger" dismissible="true">Error Alert</bs5-alert>
```


## Progressbar

```
Progressbar Attributes
	value           - The percent value to bind with
	
	display-percent - If true it will display the percentage in the middle of the 
	                  progressbar. Default is false.
	                  
	type            - The type of background color for progressbar. Valid values are 'success', 'info',
	                  'warning', 'danger', and null. Default is null.
	                  
	striped         - If true the progressbar will be striped. Default is false.
	
	animate         - If true then the stripes will be animated. Default is false.
```

###### HTML File
```html
...

<div ng-controller="MainController">
	<bs5-progressbar value="progress" display-percent="true"></bs5-progressbar>
	<button type="button" class="btn btn-primary" ng-click="setProgress()">Rondomize Progress</button>
</div>

...
```

###### Javascript File
```javascript
...

module.controller('MainController', ['$scope', function($scope) {
	$scope.setProgress = function() {
		$scope.progress = Math.floor((Math.random() * 100) + 1);
	};
	
	$scope.setProgress();
}]);

...
```

## Tabs

```
Tabset Attributes
	active   - Initiate the the active tab. It is an index.
	
	type     - The tab type. Can be 'pills' or 'tabs'.
	
	vertical - If true then the tabs and the panes will be lined up in a vertical fashion.
	           The tab type will automatically be set to 'pills' reguardless of what the
	           type attribute is set to. Default is  false.
	           
	justify  - If true then all the tabs will be the same size. Default is false.


Tab Attributes
	heading  - The tab heading.
	
	select   - The function to execute after the tab has been selected. $tabIndex and
	           $event can be passed to the function. 
	
	deselect - The function to execute after the tab has been deselected. $tabIndex and
	           $event can be passed to the function.
	           
	disabled - If true the tab will be disabled. It won't be selectable. Default is false.
```

###### Example
```html
<bs5-tabset>
	<bs5-tab heading="Heading Attribute">
		... tab content ...
	</bs5-tab>
	<bs5-tab>
		<bs5-tab-heading>Tab Heading Element</bs5-tab-heading>
		... tab content ...
	</bs5-tab>
</bs5-tabset>
```

## Modal

#### $bs5Modal Service

The `$bs5Modal` service opens a modal window and returns an object that contains result promise, a close function that
resolves the result promise and closes the modal, and a dismiss function that simply closes the modal.

```
Options
	backdrop     - If true it adds a backdrop. Default is false.
	
	size         - Bootstrap modal size. Valid values are 'sm', 'lg', 'xl', or null. Default is null.
	
	centered     - If true the modal is vertically centered. Default is false.
	
	scrollable   - If true the modal body is scrollable. Default is false.
	
	container    - A selector to the element that is to contain the modal. Default is 'body'.
	
	controller   - A string for a controller that is defined with module.controller or a function 
	               that is a constructor for the controller. (optional)
	               
	controllerAs - A label for the controller. Requires controller option to be defined. (optional)
	
	templateUrl  - The url to the modal contend template.
	
	template     - Modal content template.
	
	If the 'templateUrl' is not defined then the 'template' option is required or an exception will be thrown.
	
Returns
	{
		result: promise        - A promise that can be resolved by interacting with the modal,
		close:	function(data) - Closes the modal and resolves the result with the data parameter,
		dismiss: function()    - Closes the modal.
	}
```

###### HTML File
```html
...

<div ng-controller="MainController">
	<button type="button" class="btn btn-primary" ng-click="openModal()">Open Modal</button>
</div>
<script type="text/ng-template" id="modal-content.html">
	<div class="modal-header">
		<h5 class="modal-title">{{title}}</h5>
	</div>
	<div class="modal-body">
		{{body}}
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-success" ng-clicck="resolve()">Resolve</div>
		<button type="button" class="btn btn-danger" ng-clicck="close()">Close</div>
	</div>
</script>

...
```

###### Javascript File
```javascript
...

module.controller('MainController', ['$scope', $bs5Modal, function($scope, $bs5Modal) {
	$scope.openModal = function() {
		var modal = $bs5Modal({
			templateUrl: 'modal-content.html',
			controller: ['$scope', function(scope) {
				scope.title = 'Test Modal';
				scope.body = '<h1>Modal Content</h1>';
				
				var resolver = 'This is a test resolver'; 
				
				scope.resolve = function() {
					modal.close(resolver);
				};
				
				scope.close = function() {
					modal.dismiss();
				};
			}]
		});
		
		modal.result.then(function(data) {
			alert(data); // should alert 'This is a test resolver'
		});
	};
}]);

...
````

# Todo
- [ ] Make pagination move the pages when you get to the last page in the list.
- [ ] Make a way to return a result for html popovers. May need to put in a promise.