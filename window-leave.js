'use strict';

(function (window, angular, undefined) {

	angular.module('windowLeave', [])
		.directive('windowLeave', ['$window', '$document', function ($window, $document) {
			return {
				restrict: 'A',
				transclude: true,
				scope: {
					"delay": "=?",
					"outClass": "=",
					"inClass": "=",
					"enable": "=?",
					"dismissOn": "@",
					"dismissDelay": "=?",
					"box": "@",
					"opened": "=",
					"onOpen": "&"
				},
				controller: function ($scope, $element, $attrs) {
					$scope.direction = "";
					$scope.displayed = false;
					$scope.dismissOn = !$scope.dismissOn ? "mouseenter" : $scope.dismissOn;

					$scope.config = {
						delay: $scope.delay === 0 ? 0 : $scope.delay || 2000,
						dismissDelay: $scope.dismissDelay === 0 ? 0 : $scope.dismissDelay || 2000,
						outClass: $scope.outClass || "out",
						inClass: $scope.inClass || 'in'
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

					// add watcher on the enable value
					$scope.$watch('enable', function (value) {
						// if value is defined as false
						if (value === false) {
							offMouse();
						}
						// if value is undifined or is true
						else if (!value || value === true) {
							onMouse();
						}
					});

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
					var dismissTimer;

					function userLeaves(event) {
						getLeaveSide(event);

						if (dismissTimer) {
							clearTimeout(dismissTimer);
						}

						if (!$scope.displayed) {
							leaveTimer = setTimeout(open, $scope.config.delay);
						}
					}

					function userReturns(event) {
						if (leaveTimer && document.hasFocus()) {
							clearTimeout(leaveTimer);
						}
						if ($scope.displayed) {
							switch ($scope.dismissOn) {
								case "click":
									// dismisses on click everywhere
									// and prevent default actions of elements
									$document.on('click', function (e) {
										dismiss();
										$document.off('click');
									});

									break;
								case "outsideBox":
									dismissAfter($scope.dismissDelay);
									$scope.config.box.on('mouseleave', dismissAfter);
									$scope.config.box.on('mouseenter', cancelDismiss);
									break;

								case "mouseenter":
									dismiss();
									break;

								case "none":
									break;
							}
						}
					}

					// public method, accesible inside the directive element
					$scope.dismiss = dismiss;

					function open() {
						$element.addClass($scope.config.outClass)
							.removeClass($scope.config.inClass)
							.addClass($scope.direction);
						$scope.displayed = true;

						if(typeof $scope.onOpen !== "undefined"){
							$scope.onOpen();
						}

						$scope.opened = true;
						$scope.$apply();
					}

					function dismiss() {
						$element.addClass($scope.config.inClass)
							.removeClass($scope.config.outClass)
							.removeClass($scope.direction);
						$scope.displayed = false;
						$scope.opened = false;
					}

					// init the dismiss timer
					function dismissAfter() {
						if (dismissTimer) {
							clearTimeout(dismissTimer);
						}
						dismissTimer = setTimeout(function () {
							dismiss();
						}, $scope.config.dismissDelay);
					}

					// remove dismiss timer
					function cancelDismiss() {
						if (dismissTimer) {
							clearTimeout(dismissTimer);
						}
					}
				},
				link: function ($scope, $element, $attrs, $ctrl, transclude) {
					transclude($scope.$new(), function (clone) {
						$element.append(clone);

						$scope.config.box = $scope.box ? angular.element($element[0].querySelector($scope.box)) : null;
					});
				}
			}
		}]);

})(window, window.angular);
