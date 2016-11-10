'use strict';

/**
 * @ngdoc overview
 * @name befrApp
 * @description
 * # befrApp
 *
 * Main module of the application.
 */
var app;
(function (window, angular, undefined) {
	'use strict';

	app = angular.module('testApp', [
		'windowLeave'
	])
		.run(function($rootScope){
			$rootScope.enable = true;
		});

})(window, window.angular);
