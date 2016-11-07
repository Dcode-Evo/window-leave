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
	<div class="leave" window-leave dismiss-on-enter="false">
		Some text here
		<button ng-click="dismiss()">Dismiss</button>
	</div>
	...
</body>

```

## Attributes (Parameters)
- **dismiss-on-enter**: {bool}, dissmis the message on mouseenter or window focus
	- default: false, if not specified
- **delay**: {int} milliseconds, the tme after which the message will be shown
	- default (2000)
- **in-class**: the class to add when the user is back in the window/document (default: `in`)
- **out-class**: the class to add when the user leaves the window/document (default: `out`)

## Methods

use `dismiss()` methtod inside the directive to close the message
