# angular-bootstrap-5
###### Version 1.1.0

### Bootstrap 5 for Angular JS
<p style="color: gray">Bootstrap Version:&nbsp;5.3.3</p>
<p style="color: gray">Angular Version:&nbsp&nbsp&nbsp;1.8.3</p>

[Demo](https://adamclayd.github.io/angular-bootstrap-5/demo/index.html)

[Download](https://adamclayd.github.io/angular-bootstrap-5/build/angular-bootstrap-5.js)

[Download Minified](https://adamclayd.github.io/angular-bootstrap-5/build/angular-bootstrap-5.min.js)

### Setup
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.css" />
```

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.3/angular.min.js"></script>
<script src="https://adamclayd.github.io/angular-bootstrap-5/build/angular-bootstrap-5.min.js"></script>
```

```javascript
var module = angular.module('app', ['ngBootstrap5']);
```

## <span class="red">Collapse</span>

The `bs5-collapse` attribute is a boolean to determine if the collapse is collapsed or not. Set to `true` to hide the collapse.
Set to `false` to expand the collapse.

#### Directive: bs5Collapse

Restricted To: <span class="green">AC</span>

###### Attributes
```
{boolean}    bs5-collapse        - a two way binding scope property that indicates whether to collapse the element.
    
{boolean}    horizontal          - a one way binding that indicates the element to use a horizontal animation.
    
{expression} onExpand()          - expression to execute before the element starts to expand
    
{expression} onExpanded()        - expression to execute after the element has been expanded.
    
{expression} onCollapse()        - expression to execute before the element starts to collapse
    
{expression} onCollapsed()       - expression to execute after the element has been collapsed.
```

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

## <span class="red">Accordion</span>


#### Directive: bs5Accordion

Restricted To: <span class="green">E</span>

###### Attributes
```
{boolean} close-others - two way binding that if set to true will only allow one accordion group open at a time. It defaults to true.
```

### Directive: bs5AccordionGroup

Restricted To: <span class="green">E</span>

###### Attributes
```
{string}  heading - set the title for the accordion group
	
{boolean} is-open - whether the accordion group is opened or not
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


## <span class="red">Alerts</span>

### Directive: bs5Alert

Restricted To: <span class="green">E</span>

###### Attributes
```
{string}  type         - Bootstrap alert type. Valid values are 'primary', 'secondary', 'success', 'danger', 'warning', 
                         'info', 'light', and 'dark'. The default is 'light'.
	
{boolean} dismissible  - If true it adds a close button that removes the alert. Default is false
	
{number}  timeout      - The amount of time in milliseconds before the alert closes. If it is not set then th alert stays 
                         permanently.                         
```

###### Example
```html
<bs5-alert type="danger" dismissible="true">Error Alert</bs5-alert>
```


## <span class="red">Progressbar</span>

### Directive: bs5Progressbar

Restricted To: <span class="green">E</span>

###### Attributes
```
{number}  value           - The percentage of the progress
	
{boolean} display-percent - If true it will display the percentage in the middle of the progressbar. Default is false.
	                  
{string}  type            - The type of background color for progressbar. Valid values are 'success', 'info', 'warning', 
                            'danger', and null. Default is null.
	                  
{boolean} striped         - If true the progressbar will be striped. Default is false.
	
{boolean} animate         - If true then the stripes will be animated. Default is false.
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

## <span class="red">Tabs</span>

### Directive: bs5Tabset

Restricted To: <span class="green">E</span>

###### Attributes
```
{string}  type     - The tab type. Can be 'pills', 'tabs', or 'underline'. Default is 'tabs'
	           
{boolean} justify  - If true the row that te tabs are in will be filled tabs that have the same width. Default is false.
	                     
{boolean} fill     - If true the row that the tabs are on will be filled by the tabs. Each tab's width may vary. Default is false.
```

###### Example
```html
<bs5-tabset>
  <!-- bs5Tab directives -->
</bs5-tabset>
```

##### Directive: bs5Tab
###### Attributes
```
{string}     heading                     - The tab heading.
	
{expression} select($tabIndex, $event)   - The function to execute after the tab has been selected. $tabIndex and $event 
                                           can be passed to the function. 
	
{expression} deselect($tabIndex, $event) - The function to execute after the tab has been deselected. $tabIndex and $event 
                                           can be passed to the function.
	           
{boolean}    disabled                    - If true the tab will be disabled. It won't be selectable. Default is false.
```

###### Example
```html
<bs5-tabset>
	<bs5-tab heading="Heading Attribute">
		... tab content ...
	</bs5-tab>
	<bs5-tab>
        <bs5-tab-heading><bs5-icon icon="star-fill"></bs5-icon> Tab Heading Element</bs5-tab-heading>
		... tab content ...
	</bs5-tab>
</bs5-tabset>
```

## <span class="red">Modal</span>

### Service: $bs5Modal

The `$bs5Modal` service opens a modal window and returns an object that contains result promise, a close function that
resolves the result promise and closes the modal, and a dismiss function that simply closes the modal.

###### Method Signature
```
$bs5Modal(options)
```

###### Parameters 
```
{boolean}                   options.staticBackdrop - If true then clicking the backdrop won't close the modal. Default 
                                                     is false.
	
{string}                    options.size           - Bootstrap modal size. Valid values are 'sm', 'lg', 'xl', or null. 
                                                     Default is null.
	
{boolean}                   options.centered       - If true the modal is vertically centered. Default is false.
	
{boolean}                   options.scrollable     - If true the modal body is scrollable. Default is false.
	
{boolean}                   options.container      - A selector to the element that is to contain the modal. Default is 'body'.
	
{string | Function | Array} options.controller     - (Optional) A string for a controller that is defined with module.controller 
                                                     or a controller constructor
	               
{string}                    options.controllerAs   - (Optional) Set the alias for the controller. Requires controller option 
                                                     to be defined.
	
{string}                    options.templateUrl    - The url to the modal content template. This is required if options.template 
                                                     is not defined
	
{string}                    options.template       - Modal content template. This is required if options.templateUrl is not
                                                     defined
```

###### Returns
```
{
    {Promise}  result,         - A promise that can be resolved by interacting with the modal,
    {Function} close(data),    - Closes the modal and resolves the result with the data parameter,
    {Function} dismiss(reason) - Closes the modal and rejects the promise with a reason.
}
```

##### Modal Controller
When the controller for the modal is created it will assign `$scope.close(data)` and `$scope.dismiss(reason)` to its scope
which are the same functions as that are returned.

###### Example
```html
<div ng-controller="MainController">
	<button type="button" class="btn btn-primary" ng-click="openModal()">Open Modal</button>
</div>
<script type="text/ng-template" id="modal-content.html">
	<div class="modal-header">
		<h5 class="modal-title">{{title}}</h5>
        <button type="button" class="btn-close" ng-click="dismiss('close-button-click')"></button>
	</div>
	<div class="modal-body text-center">
		{{body}}
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-primary" ng-click="close('This is a test')">Ok</div>
	</div>
</script>
```

```javascript
module.controller('MainController', ['$scope', '$bs5Modal', function($scope, $bs5Modal) {
	$scope.openModal = function() {
		$bs5Modal({
            templateUrl: 'modal-content.html',
            controller: 'ModalController'
        }).then(function(data) {
			alert(data); // should alert 'This is a test'
		});
	};
}]);

module.controller('ModalController', ['$scope', function($scope) {
    cope.title = 'Test Modal';
    scope.body = '...Modal Content...';
}]);
````


## <span class="red">Tooltip</span>
### Directive: bs5Tooltip
By default this directive will display a tooltip around the element that has the directive's attribute when the user hovers 
over the it

Restricted To: <span class="green">A</span>

###### Attributes
```
{boolean} animate                - Make the tooltip do the fade in animation. Default is true 
	
{string}  bs5-tooltip            - The tooltip content if templateUrl is not defined.
	          
{boolean} html                   - If true then the tooltip can contain html. Default is false.
	
{string} placement               - The placement of the tooltip on the element. Valid values are 'top', 'left', 
	                               'bottom', and 'right'. Default is 'top'.
                   
{string} trigger                 - The way the tooltip is triggered. Valid values are 'hover', 'focus', and 'click'. 
                                   Default is 'hover'
```

###### Example
```html
<button type="button" class="btn btn-primary" bs5-tooltip="<strong>Test Tooltip</strong>" html="true">Tooltip</button>
```

## <span class="red">Popover</span>

## Directive: bs5Popover

Restricted To: <span class="green">A</span>

```
{boolean}    animate                 - If true then the popover will do fade in and out animation.
	                                   Default is true.
	                
{string}     bs5-popover             - Content to use for the popover if templateUrl is not defined.
	
{boolean}    html                    - If true the html is allowed in the popover. Default is false.
	
{expression} handler($data)          - Executed when data is passed back from the popoveer
	
{string}     placement              - Where to place the popover around the element. Valid values are
	                                  'top', 'left', 'bottom', and 'right'. Default is 'right'.
	            
{string}     templateUrl            - The url of the html template to use for the popover cocontent
	                                  Option html is set to true if this option is set
	            
{string}     title                  - The title of the popover that is displayed in the header of the popover.
	                                  Default is a blank string ('').
	                         	             
{string}     trigger                - The type of event that is used to trigger the popover. Valid values are
	                                  'click', 'hover', and 'focus'. Default is 'click'.           
	
```

###### Example

```html
<button type="button" class="btn btn-primary" bs5-popover="<h1>Test Popover</h1>" html="true" title="Popover">Popover</button>
```

###### Advanced Use
This is for if you want to put something like a form in popover and if you want to get the data from the form or
just pass a value back to back to your controller. The `handler` attribute passes data `$data` to the expression.
The popover is compiled with a scope that has functions `$scope.close(value: <any>)` and `$scope.dismiss(reason)`
that you can access in the html content of the popover. `$scope.close` closes te popover and calls the handler
with the data. `dismiss` just closes the popover. You can get a return value from the popover by calling `close`
in the html of the popover.

###### Example
```html
<div ng-controller="MainController">
    <button type="button" class="btn btn-warning" bs5-popover="............... Text ..............."  html="true" popover-controller="PopoverController" title="Name Form">Normal</button>
    <button type="button" class="btn btn-warning" bs5-popover template-url="popover.html" popover-controller="PopoverController" title="Name Form" handler="handler($data)">Advanced</button>
    <div class="row mb-3 m-md-2">
         <label class="col-12 col-md-3 col-lg-2 col-form-label text-md-end">First Name</label>
         <div class="col-12 col-md-9 col-md-10">
             <input type="text" class="form-control" ng-model="data.fname" disabled>
         </div>
    </div>
     <div class="row mb-3 m-md-2">
         <label class="col-12 col-md-3 col-lg-2 col-form-label text-md-end">Last Name</label>
         <div class="col-12 col-md-9 col-md-10">
             <input type="text" class="form-control" ng-model="data.lname" disabled>
         </div>
     </div>
</div>
<script src="text/ng-template" id="popover.html">
   <form name="form" ng-submit="submit()">
       <div class="row mb-3">
           <label class="col-12 col-form-label">First Name</label>
           <div class="col-12">
               <input type="text" class="from-control" name="fname" ng-model="frm.fname" />
           </div>
       </div>
       <div class="row mb-4">
           <label class="col-12 col-form-label">Last Name</label>
           <div class="col-12">
               <input type="text" class="from-control" name="lname" ng-model="frm.lname" />
           </div>
       </div>
       <div class="text-end">
           <button type="submit" class="btn btn-primary">Submit</button>
       </div>
   </form>
</script>
```

```js
module.controller('PopoverController' ['$scope', function($scope) {
    $scope.frm = {
        fname: null,
        lname: null
    };
  
    function process() {
        return angular.copy($scope.frm);
    }
  
     $scope.submit = function() {
         result = process();
  
         if(result)
             $scope.close(result);
         else
             $scope.dismiss();
     }
  }]);
  
  module.controller('MainController', ['$scope', function($scope) {
     $scope.data = {
         fname: null,
         lname: null
     }
  
     $scope.handler = function(data) {
         $scope.data = data;
     }
  }]);
```


#### Pageination

##### Directive: bs5Pagination

Restricted To: <span class="green">E</span>

###### Attributes
```
{string}     align                         - Horizontal alignment of the pagination element. Valid values are 'left', 'center', 
                                             'right', and null. Default is null.
	                      
{number}     current-page                  - (Required) Meant to bind to a currentPage scope variable. (Two Way Binding)
	                      
{number}     page-range                    - The number of pages to display at one time. Default is 5.
	
{string}     first-page-text               - The first page link text. Default is '<<',
	
{string}     last-page-text                - The last page link text. Default is '>>'.

{string}     previous-page-text            - The previous page link text. Default is '<'
	
{string}     next-page-text                - The next page link text. Default is '>'.
	
{number}     number-items                  - (Required) The total number of items. 
	
{expression} page-change($page, $pageSize) - Function that is executed when the page changes. $page and $pageSize are provided 
                                             to pass to the function.
	
{number}     page-size                     - Number of items on each page. Default is 10
		
{string}     size                          - Bootstrap size of the pagination element. Valid values are 'sm' and 'lg'. 
                                             Default is null.
	
{boolean}    with-first-last               - Indicates whether or not to have the first page link and the last page link. 
                                             Default is true.
	 
{boolean}    with-previous-next            - Indicates whether or not to have the previous page link and the next page link. 
                                             Default is true. 
	
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

## Icons
### Directive: bs5-icon
You can use this directive with out having to include bootstrap-icons.css. It will download the svg markup of the icon
from Bootstrap's site.

See https://icons.getbootstrap.com/ for the list of icons

Restricted To: <span class="green">E</span>

###### Attributes
```
{string} icon      - The name of the icon you want to use.

{number} size      - (Optional) This will resize the icon to {size} x {size}.

{string} color     - (Optional) Set the css color of the icon.
```

###### Example
```html
<bs5-icon icon="star-fill" color="goldenrod"></bs5-icon>
```

## Rating

Provides a star rating widget.
The `bootstrap-icons` css file is required for this feature to work correctly.

### Directive: bs5Rating

Restricted To: <span class="green">E</span>

###### Attributes
```
{boolean} enable-reset - Allows the model to be set to 0 when the user clicks on the same rating. Default is true.
	
{number}  max          - The max rating value. Default is 5.
	
{boolean} readonly     - Binding that when true the user cannot edit the rating. Default is false.

{boolean} disabled     - Indicates whether to disable the control
	
{string}  stateOn      - The Bootstrap icon to use for marked ratings. Default is 'star-fill'.
	
{string}  stateOff     - The Bootstrap icon to use for unmarked ratings. Default is 'star'.

{string}  color        - The color of the icons used in the rating. It can be any css color value. Default is 'goldenrod'

{number}  size         - (Optional) The size in pixels of the icons used in the rating.

{boolean} trail        - If true then the rating will be trailed by the mouse. Default is true.

{string}  name         - The name to give the form control.

{number}  ng-model     - (Required)
```

The `required` and `ng-required` validators can be used with this directive.

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

### Directive: bs5Autocomplete

This directive makes a list of suggestions under a text input after you enter so many characters.
You can use an array of strings for the data source to search through or you can make a remote call
and get the data from a server. If you use the remote address option your server will have to
respond with a json encoded array of strings. It sends `term` as a parameter that contains the data in
the input box.

You can only apply this directive to input elements that are text typed input boxes .

Restricted To: <span class="green">AC</span>

###### Attributes
```
{string[]}   datasource           - An array of strings for the autocomplete to use. 

{number}     min-characters       - The minimum number of characters to type in before the autocomplete will be displayed.
	                                Default is 2.
	
{expression} on-select()          - A function that is executed after you selected something from the autocomplete list.
	
{string}     remote-addr          - The url of the server call to get the data from. The server needs to respond with
	                                json encoded array of strings. 'term' is sent as a GET parameter that contains the
	                                the string from the text box.
	                    
{Object}     remote-addr-params   - Object of additional parameters to use for the remote call. If the method is GET then
                                    the params are sent in the url search string  
	
{string}     remote-addr-method   - The http method of the remote call. Possible values are 'GET', 'POST', 'UPDATE', 'DELETE', 
                                    'PATCH', or 'OPTIONS'. Default is 'GET'
                                    
{string}     matches              - This does not apply if you are using a remote address. Setting this will match the value 
                                    of the text box to the start, middle, or end of the strings in datasource. For example
                                    if the user has 'ab' typed in then if this value was set to start then anything that
                                    would match 'ab*' in datasource. If this value was set to middle then it would match
                                    by '*ab*' in datasource. If this value was set to end then it would match by '*ab' 
                                    in datasource.If this value was set to middle then it would match
                                    by '*ab*' in datasource. Possible values are 'start', 'middle', or 'end'. 
                                    The default is 'start'.
                                    
{string}     ng-model             - (Required)
```

###### Remote Address Example
```html
<div ng-controller="MainController">
	<input type="text" class="form-control" ng-model="model" bs5-autocomplete remote-addr="https://apis.adamclayd.workers.dev/ngbs5/examples/autocomplete" />
</div>
```

Remote code for https://apis.adamclayd.workers.dev/ngbs5/examples/autocomplete
```js
function autocompeteEx(request) {
    let term = new URL(request.url).searchParams().get('term') || '';

  let names = ["Simeon Ortiz", "Liliane Bashirian", "David Ryan", "Carson O'Kon", "Sarina Kirlin", "Trudie Orn", "Deshawn Jast",
    "Christiana Rempel", "Daphne Raynor", "Cecelia Rice", "Merl Brekke", "Josie Hagenes", "Christine Jacobs", "Raegan West",
    "Christopher McGlynn", "Beryl Zulauf", "Kelley Hessel", "Gilda Hartmann", "Billie Marvin", "Kathlyn Greenfelder", "Rory Kertzmann", "Demetris Hane",
    "Gilbert Moen", "Whitney Predovic", "Bernhard Waters", "Earl Hane", "Mercedes Luettgen", "Jaleel Schimmel", "Kaitlyn Lemke", "Rebecca Yost",
    "Carlo Graham", "Cameron Kub", "Henri Toy", "Katarina Quigley", "Demetris Vandervort", "Roslyn Kohler", "Elizabeth Emmerich", "Katlynn Lowe",
    "Celine Dooley", "Cleveland Howe", "Frankie Zieme", "Kale Bahringer", "Shane Stoltenberg", "Jenifer Bradtke", "Beatrice Kuhlman",
    "Felicita Jakubowski", "Cade Crona", "Dena Kozey", "Urban Wilderman", "Marcelina Bayer"];
  
  return new Response(JSON.stringify(names.filter(x => x.toLowerCase().indexOf(term.toLowerCase()) > -1).sort()), {
    headers: {
      "Content-Type": "application/json"
    }
  });
}
```

###### Datasource Example
```html
<div ng-controller="MainController">
  <input type="text" class="form-control bs5-autocomplete" ng-model="model" datasource="data" matches="start" />
</div>
```

```js
module.controller('MainController', ['$scope', function($scope) {
  $scope.data = ["Simeon Ortiz", "Liliane Bashirian", "David Ryan", "Carson O'Kon", "Sarina Kirlin", "Trudie Orn", "Deshawn Jast",
    "Christiana Rempel", "Daphne Raynor", "Cecelia Rice", "Merl Brekke", "Josie Hagenes", "Christine Jacobs", "Raegan West",
    "Christopher McGlynn", "Beryl Zulauf", "Kelley Hessel", "Gilda Hartmann", "Billie Marvin", "Kathlyn Greenfelder", "Rory Kertzmann", "Demetris Hane",
    "Gilbert Moen", "Whitney Predovic", "Bernhard Waters", "Earl Hane", "Mercedes Luettgen", "Jaleel Schimmel", "Kaitlyn Lemke", "Rebecca Yost",
    "Carlo Graham", "Cameron Kub", "Henri Toy", "Katarina Quigley", "Demetris Vandervort", "Roslyn Kohler", "Elizabeth Emmerich", "Katlynn Lowe",
    "Celine Dooley", "Cleveland Howe", "Frankie Zieme", "Kale Bahringer", "Shane Stoltenberg", "Jenifer Bradtke", "Beatrice Kuhlman",
    "Felicita Jakubowski", "Cade Crona", "Dena Kozey", "Urban Wilderman", "Marcelina Bayer"]
}]);
```

## Further Documentation
There will be full documentation with runnable examples will be added to the next push of this repo and be accessible on
the github.io site for this repo

For now you can look at the source code in the [src](https://github.com/adamclayd/angular-bootstrap-5/tree/v1.1.0/src) 
directory. The documentation is in the ngdoc blocks of the *.js files.


#### Change Log
* Added icons module

* Removed Bootstrap 5 Datepicker. Use the `input[date]` directive instead.

* Added animations fade animation for all components.

* Added vertical and horizontal collapse animations for a collapsable element.

* Added zoom in and out animation for a modal with a static backdrop.

* Added fade out in animation for the tabs.

* Added Bootstrap 5 Icons svg module. bootstrap-icons.css is no longer needed.

* Totally changed the advanced usage of a popover.

* Added a matches option to the autocomplete directive that can match the term with the 
  start, middle, or the end of the items in datasource

* Added size and color options to the rating directive

* Added pivot options to the pagination directive that puts the active page in the middle
  of the page list.