# Bootstrap 5 for AngularJS v1.8.2

Directives and services that work with Bootstrap 5. 
It has been tested and works with Bootstrap v5.1.3.

## Setup

You have to include the Bootstrap 5 javascript file before you include ngBootstrap5.
Include the ngBootstrap5 module in your main application module:

```javascript
var module = angular.module('app', ['ngBootstrap5']);
```

You may want to include `ngAnimate` too because there are a few modules that can use it as opposed to the animation functionality
thats comes with AngularJS.

## Collapse

The `bs5-collapse` attribute is a boolean to determine if the collapse is collapsed or not. Set to `true` to hide the collapse.
Set to `false` to expand the collapse.

###### Example
```html
<div ng-controller="MainController">
	<button type="button" class="btn btn-primary" ng-click="collapsed = !collapsed">Toggle Section</button>
	<div bs5-collapse="collapsed">
		... collapsed content ...
	</div>
</div>
```

```javascript

module.controller('MainController', ['$scope', function($scope) {
	$scope.collapsed = true;
}]);
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

###### Example

```html
<div ng-controller="MainController">
	<bs5-progressbar value="progress" display-percent="true"></bs5-progressbar>
	<button type="button" class="btn btn-primary" ng-click="setProgress()">Randomize Progress</button>
</div>
```

```javascript
module.controller('MainController', ['$scope', function($scope) {
	$scope.setProgress = function() {
		$scope.progress = Math.floor((Math.random() * 100) + 1);
	};
	
	$scope.setProgress();
}]);
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
	heading                     - The tab heading.
	
	select($tabIndex, $event)   - The function to execute after the tab has been selected. $tabIndex and
	                              $event can be passed to the function. 
	
	deselect($tabIndex, $event) - The function to execute after the tab has been deselected. $tabIndex and
	                              $event can be passed to the function.
	           
	disabled                    - If true the tab will be disabled. It won't be selectable. Default is false.
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

###### Example
```html
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
```

```javascript
module.controller('MainController', ['$scope', '$bs5Modal', function($scope, $bs5Modal) {
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
````


## Tooltip

Tooltips have a template url that can load html content into the tooltip. It does not get compiled though so you can only
display text or html.

#### Directive: bs5Tooltip
```
Attributes
	animate                - Make the tooltip do the fade in animation. Default is true 
	
	bs5-tooltip            - The tooltip content if templateUrl is not defined.
	          
	html                   - If true then the tooltip can contain html. Default is false.
	
	placement              - The placement of the tooltip on the element. Valid values are 'top', 'left', 
	                         'bottom', and 'right'. Default is 'top'.
	
	templateUrl            - The url to the html content that will be put in the tooltip. If defined then
	                         html option will be true.
	              
	tooltip-template-url   - A url that points to a custom popover template. It defaults to one stored in template cache.
                   
	trigger                - The way the tooltip is triggered. Valid values are 'hover', 'focus', and 'click'.
	                         Default is 'hover'
```

###### Example
```html
<button type="button" class="btn btn-primary" bs5-tooltip="<strong>Test Tooltip</strong>" html="true">Tooltip</button>
```

## Popover

You can specify a template url and the html content gets compiled. So you can have a popover with interactable html. If you
need a result from a popover you can use the `load` option to access the scope of the popover and return the result with a promise.

#### Directive: bs5Popover

```
Attributes
	animate                 - If true then the popover will do fade in and out animation.
	                          Default is true.
	                
	bs5-popover             - Content to use for the popover if templateUrl is not defined.
	
	html                   - If true the html is allowed in the popover. Default is false.
	
	load($popover)         - Function that is executed each time the popover is created and shown.
	                         it provides $popover as a passable parameter and it has a scope property so you can
	                         access scope of the popover.
	
	placement              - Where to place the popover around the element. Valid values are
	                         'top', 'left', 'bottom', and 'right'. Default is 'right'.
	popover-template-url   - A url that points to a custom popover template. It defaults to one stored in template cache.
	            
	templateUrl            - The url of the html template to use for the popover cocontent
	                         Option html is true if this option is set
	            
	title                  - The title of the popover that is displayed in the header of the popover.
	                         Default is a blank string ('').
	                         	             
	trigger                - The type of event that is used to trigger the popover. Valid values are
	                         'click', 'hover', and 'focus'. Default is 'click'.
	            
	
```

###### Example

```html
<button type="button" class="btn btn-primary" bs5-popover="<h1>Test Popover</h1>" html="true" title="Popover">Popover</button>
```

###### Advanced Use

```html
<div ng-controller="MainController">
	<button type="button" class="btn btn-primary" bs5-popover load="popoverLoad($popover)" template-url="popover.html" html="true" title="Popover">Popover</button>
</div>
<script type="text/ng-template" id="popover.html">
	<p>{{popoverText}}</p>
	<div class="text-end">
		<button type="button" class="btn btn-success" ng-click="resolve()">Resolve</button>
		<button type="button" class="btn btn-danger" ng-click="close()">Close</button>
	</div> 
</script>
```

```javascript
module.controller('MainController', ['$scope', '$q', function($scope, $q) {
	$scope.popoverLoad = function(popover) {
		deferred = $q.defer();
		
		popover.scope.popoverText = "Advanced use popover";
		
		popover.scope.resolve = function() {
			deferred.resolve('Popover Resolved');
			popover.hide();
		};
		
		popover.scope.close = function() {
			popover.hide();
		};
		
		deferred.promise.then(function(data) {
			alert(data); // should alert 'Popover Resolved'
		});
	};
}]);
```


## Pageination

#### Directive: bs5Pagination

```
Attributes
	align                         - Horizontal alignment of the pagination element. Valid values are 'left', 'center', 'right', and null.
	                                Default is null.
	                      
	current-page                  - Meant to bind to a currentPage scope variable.
	                      
	display-pages-range           - The number of pages to display at one time. Default is 5.
	
	first-page-text               - The first page link text. Default is 'First',
	
	last-page-text                - The last page link text. Default is 'Last'.
	
	next-page-text                - The next page link text. Default is 'Next'.
	
	number-items                  - The total number of items.
	
	page-change($page, $pageSize) - Function that is executed when the page changes. $page and $pageSize are provided to pass to the function.
	
	page-size                     - Number of items on each page. Default is 10.
	
	previous-page-text            - The previous page link text. Default is 'Previous'.
	
	size                          - Bootstrap size of the pagination element. Valid values are 'sm' and 'lg'. Default is null.
	
	with-first-last               - Indicates whether or not to have the first page link and the last page link. Default is true.
	 
	with-previous-next            - Indicates whether or not to have the previous page link and the next page link. Default is true. 
	
```

###### Example

```html
<div ng-controller="MainController">
	<bs5-pagination current-page="pager.page" page-size="pager.pageSize" number-items="pager.numItems" page-change="pageChange($page, $pageSize)"></bs5-pagination>
</div>
```

```javascript
module.controller('MainController', ['$scope', function($scope) {
	$scope.pager = {
		page: 1,
		pageSize: 25,
		numItems: 1000,
		items: []
	};
	
	$scope.pageChange = function(page, pageSize) {
		// get page from server
		console.log('Current Page: ' + page);
		console.log('Page Size: ' + pageSize);
	};
}]);
```

## Datepicker

#### Directive: bs5Datepicker

```
Requires
	ngModel

Attributes
	format - The format to put the date in after selected. Defaults to 'mm/dd/yyyy'.
```

###### Example
```html
<div ng-controller="MainController">
	<input ng-model="model" bs5-datepicker format="mm/dd/yyyy" />
</div>
```

```javascript
module.controller('MainController', ['$scope', function($scope) {
	$scope.model = null;
}]);
```

## Rating

Provides a star rating widget.
The `bootstrap-icons` css file is required for this feature to work correctly.

#### Directive: bs5Rating

```
Requires
	ngModel

Attributes
	enable-reset - Allows the model to be set to 0 when the user clicks on the same rating. Default is true.
	
	max          - The max rating value. Default is 5.
	
	readonly     - Binding that when true the user cannot edit the rating. Default is false.
	
	stateOnIcon  - The icon class that is filled in. Default is 'bi-star-fill'.
	
	stateOffIcon - The icon class that is not filled in. Default is 'bi-star'.
```

###### Example

```html
<div ng-controller="MainController" >
	<span bs5-rating ng-model="model" max="10"></span>
</div>
```

```javascript
module.controller('MainController', ['$scope', function($scope) {
	$scope.model = 7;
}]);
```

## Autocomplete

The autocomplete makes a list of suggestions under a text input after you enter so many characters.
You can use an array of strings for the data source to search through or you can make a remote call
and get the data from a server. If you use the remote address option your server will have to 
respond with a json encoded array of strings. It sends `term` as a parameter that contains the data in 
the input box

#### Directive: bs5Autocomplete

```
Requires
	ngModel

Attributes
	datasource           - An array of strings for the autocomplete to use. 

	min-characters       - The minimum number of characters to type in before the autocomplete will be displayed.
	                       Default is 3.
	
	on-select()          - A function that is executed after you selected something from the autocomplete list.
	
	remote-addr          - The url of the server call to get the data from. The server needs to respond with
	                       json encoded array of strings. 'term' is sent as a parameter.
	                    
	remote-addr-params    - Object of additional parameters to use for the remote call.
	
	remote-addr-method    - The http method of the remote call. Default is 'POST'
```

###### Example

```html
<div ng-controller="MainController">
	<input type="text" ng-model="model" bs5-autocomplete min-characters="2" datasource="datasource" />
</div>
```

```javascript
module.controller('MainController', ['$scope', function($scope) {
	$scope.model = null;
	
	$scope.datasource = ['Foo', 'Bar', 'Baz', 'Foobaz', 'Barfoo', 'Foobar', 'Bazfoo'];
}]);
```