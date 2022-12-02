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


#### Directive: bs5Accordion
```
Attributes
	close-others - set to true to only allow one accordion group open at a time. It defaults to true.
```

#### Directive: bs5AccordionGroup
```
Attributes
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

#### Directive: bs5Alert
```
Attributes
	type        - Bootstrap alert type. Valid values are 'primary', 'secondary', 'success', 
	              'danger', 'warning', 'info', 'light', and 'dark'. Default is 'primary'
	
	dismissible - If true it adds a close button that removes the alert. Default is false
```

###### Example
```html
<bs5-alert type="danger" dismissible="true">Error Alert</bs5-alert>
```


## Progressbar

#### Directive: bs5Progressbar

```
Attributes
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

#### Directive: bs5Tabset

```
Attributes
	active   - Initiate the the active tab. It is an index.
	
	type     - The tab type. Can be 'pills' or 'tabs'.
	
	vertical - If true then the tabs and the panes will be lined up in a vertical fashion.
	           The tab type will automatically be set to 'pills' reguardless of what the
	           type attribute is set to. Default is  false.
	           
	justify  - If true then all the tabs will be the same size. Default is false.
```

#### Directive: bs5Tab
```
Attributes
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

#### Service: $bs5Modal

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


## Tooltip

#### Directive: bs5Tooltip
```
Attributes
	animate     - Make the tooltip do the fade in animation. Default is true 
	
	bs5-tooltip - The tooltip content if templateUrl is not defined.

	delay       - A number or an object with show and hide properties that specifies
	              the delay when showing or hiding the tooltip. Default is 0.
	          
	html        - If true then the tooltip can contain html. Default is false.
	
	load-cb     - A function callback that is called when the tooltip is created. The function
	              defination is as follows function(scope).
	
	offset      - Array [x, y] to offset the tooltip. Default is [0, 0].
	
	placement  - The placement of the tooltip on the element. Valid values are 'top', 'left', 
	             'bottom', and 'right'. Default is 'top'.
	
	templateUrl - The url to the html content that will be put in the tooltip. If defined then
                   html option will be true.
                   
    trigger      - The way the tooltip is triggered. Valid values are 'hover', 'focus', and 'click'.
                   Default is 'hover'
```

###### Example
```html
<button type="button" class="btn btn-primary" bs5-tooltip="<strong>Test Tooltip</strong>" html="true">Tooltip</button>
```

## Popover

#### Directive: bs5Popover

```
Attributes
	animate       - If true then the popover will do fade in and out animation.
	                Default is true.
	                
	bs5-popover   - Content to use for the popover if templateUrl is not defined.
	          
	container    - A string selector to the element that the popover will append to.
	                Default is 'body'.
	            
	delay        - A number or an object with show and hide properties that indicates
	               the time that the popover should wait before it is shown or hidden.
	               Default is 0.
	
	html        - If true the html is allowed in the popover. Default is false.
	
	load-cb     - Function callback that is called each time the popover is created and shown.
	              The function defination is as follows function(scope).
	
	offset      - Place the popover [x, y] from the center. Default is [0, 0].
	
	placement  - Where to place the popover around the element. Valid values are
	              'top', 'left', 'bottom', and 'right'. Default is 'right'.
	            
	templateUrl - The url of the html template to use for the popover cocontent
	              Option html is true if this option is set
	            
	title      - The title of the popover that is displayed in the header of the popover.
	             Default is a blank string ('').
	            
	
```

###### Example

```html
<button type="button" class="btn btn-primary" bs5-popover="<h1>Test Popover</h1>" html="true" title="Popover">Popover</button>
```


# Todo Tasklist
- [ ] Make pagination move the pages when you get to the last page in the list.
- [ ] Make a way to return a result for html popovers. May need to put in a promise.
- [ ] Add a datepicker.