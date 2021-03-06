# window-leave directive

## Getting started

```
bower install https://github.com/Dcode-Evo/window-leave.git --save-dev
```

### 1. Include the module dependency to your app

```js
app = angular.module('testApp', [
	'windowLeave'
]);
```

### 2. Use it in html

```html
<body ng-app="testApp">
	...
	<div class="leave" window-leave dismiss-on="none">
		Some text here
		<button ng-click="dismiss()">Dismiss</button>
	</div>
	...
</body>

```

## Attributes (Parameters)
- **enable**: {boolean}
- **dismiss-on**: {string}, dissmis the message
	- "mouseenter": default if not specified, dismiss when mouse enters the page
	- "outsideBox": when mouse is back and is not in the message box
		- use `box` attribute to specify the box element (class, id), default is the directive's element
	- "click": dismiss on click anywhere, prevents the default actions of links, needs workaround
	- "none": disable auto dismiss
- **dismiss-delay**: define the time to wait before dismiss when "outsideBox"
- **leave-direction**: {string} define the side of the window when the box should trigger
	- 'top' | 'left' | 'right' | 'bottom'
	- if not set the box will always trigger on window leave, even alt+tab
- **delay**: {int} milliseconds, the tme after which the message will be shown
	- default (2000)
- **in-class**: the class to add when the user is back in the window/document (default: `in`)
- **out-class**: the class to add when the user leaves the window/document (default: `out`)
- **opened**: status of the module true/false accessible to the external scope
- **on-open**: provide a function to execute on box display

## Methods

use `dismiss()` methtod inside the directive to close the message