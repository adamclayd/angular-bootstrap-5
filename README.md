# ngBootstrap5


Directives and services that work with bootstrap 5. 
It is tested and works with Bootstrap v5.1.3.

### Collapse

The `bs5-collapse` attribute is a boolean to determine if the collapse is collapsed or not. Set to `true` to hide the collapse.
Set to `false` to expand the collapse.

##### HTML File
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

##### Javascript File
```javascript
...
module.controller('MainController', ['$scope', function($scope) {
	$scope.collapsed = true;
}]);
...

```

### Accordion

```
Accordion Attributes
	close-others - set to true to only allow one accordion group open at a time. It defaults to true.

Accordion Group Attributes
	heading - set the title for the accordion group
	is-open - whether the accordion group is opened or not
```
##### Example

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
