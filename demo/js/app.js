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
		.controller('testCtrl', [
			'$scope',
			function ($scope, windowLeaveService) {

				$scope.leaveOpened = false;
				$scope.enable = true;

				$scope.$watch('leaveOpened', function (value) {
					console.log(value);
					$scope.leaveOpened = value;
				});

				$scope.makeSomething = function(){
					console.log('Hello');
				}
			}]
		);

})(window, window.angular);
