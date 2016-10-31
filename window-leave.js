'use strict';

(function (window, angular, undefined) {

	angular.module('windowLeave', [])
		.directive('windowLeave', ['$window', '$document', function ($window, $document) {
			return {
				restrict: 'A',
				transclude: true,
				scope: {
					"delay": "=",
					"outClass": "=",
					"inClass": "=",
					"dismissOnEnter": "="
				},
				controller: function ($scope, $element, $attrs) {
					$scope.direction = "";
					$scope.displayed = false;

					$scope.config = {
						delay: $scope.delay || 2000,
						outClass: $scope.outClass || "out",
						inClass: $scope.inClass || 'in'
					};

					// public method, accesible inside the directive element
					$scope.dismiss = function () {
						$element.addClass($scope.config.inClass)
							.removeClass($scope.config.outClass)
							.removeClass($scope.direction);
						$scope.displayed = false;
					};

					// disable mouse events, used when the windows is unfocused
					function offMouse() {
						$document.off('mouseenter', userReturns);
						$document.off('mouseleave', userLeaves);
					}

					// enable mouse events when the windows is focused
					function onMouse() {
						// Event listeners on $document
						$document.on('mouseenter', userReturns);
						$document.on('mouseleave', userLeaves);
					}
					// add listeners
					onMouse();

					// When the scope is destroyed, we have to make sure to teardown
					// the event binding so we don't get a leak.
					$scope.$on("$destroy", handleDestroy);

					// I teardown the directive.
					// fires when the scope of the directive is destroyed
					function handleDestroy() {
						offMouse();
					}

					function getLeaveSide(event) {
						if (event.type === "blur") {
							$scope.direction = "blur";
							return;
						}

						var vWidth = $window.innerWidth,
							vHeight = $window.innerHeight,
							direction = '';

						if (event.clientX > (vWidth / 2) + (vWidth / 4)) {
							direction += "right ";
						}
						else if (event.clientX < (vWidth / 2) - (vWidth / 4)) {
							direction += "left ";
						}

						if (event.clientY > (vHeight / 2) + (vHeight / 4)) {
							direction += "bottom ";
						}
						else if (event.clientY < (vHeight / 2) - (vHeight / 4)) {
							direction += "top ";
						}

						$scope.direction = direction;
					}

					var leaveTimer;

					function userLeaves(event) {
						getLeaveSide(event);

						if (!$scope.displayed) {
							leaveTimer = setTimeout(function () {
								$element.addClass($scope.config.outClass)
									.removeClass($scope.config.inClass)
									.addClass($scope.direction);
								$scope.displayed = true;
							}, $scope.config.delay);
						}
					}

					function userReturns(event) {
						if (leaveTimer && document.hasFocus()) {
							clearTimeout(leaveTimer);
						}
						if ($scope.displayed && $scope.dismissOnEnter) {
							$scope.dismiss();
						}
					}
				},
				link: function ($scope, $element, $attrs, $ctrl, transclude) {
					transclude($scope.$new(), function (clone) {
						$element.append(clone);
					});
				}
			}
		}]);

})(window, window.angular);
