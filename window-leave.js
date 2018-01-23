'use strict';

(function (window, angular, undefined) {

	angular.module('windowLeave', [])
		.directive('windowLeave', ['$window', '$document', '$timeout', function ($window, $document, $timeout) {
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
					"leaveDirection": "@?", // 'top' | 'left' | 'right' | 'bottom' | undefined
					"box": "@",
					"opened": "=",
					"onOpen": "&"
				},
				controller: ['$scope', '$element', function ($scope, $element, $attrs) {
					$scope.disabledByUser = false;
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
						if($scope.disabledByUser){
							return;
						}
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
						var direction = [];

						if (event.type === "blur") {
							direction.push("blur");
							return;
						}

						var vWidth = $window.innerWidth,
							vHeight = $window.innerHeight;

						if (event.clientX > (vWidth - 10)) {
							direction.push("right");
						}
						else if (event.clientX < 10) {
							direction.push("left");
						}

						if (event.clientY > (vHeight - 10)) {
							direction.push("bottom");
						}
						else if (event.clientY < 10) {
							direction.push("top");
						}

						return direction;
					}

					var leaveTimer;
					var dismissTimer;

					function userLeaves(event) {
						$scope.direction = getLeaveSide(event);

						// if leave-direction is defined and if the provided value does not match the cursor leave direction
						// do not show the box
						if ($scope.leaveDirection && $scope.direction.indexOf($scope.leaveDirection) === -1) {
							return;
						}

						if (dismissTimer) {
							$timeout.cancel(dismissTimer);
						}

						if (!$scope.displayed) {
							leaveTimer = $timeout(open, $scope.config.delay);
						}
					}

					function userReturns(event) {
						if (leaveTimer && document.hasFocus()) {
							$timeout.cancel(leaveTimer);
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
							.addClass($scope.direction.join(' '));
						$scope.displayed = true;

						if (typeof $scope.onOpen !== "undefined") {
							$scope.onOpen();
						}

						$scope.opened = true;
						$scope.$apply();
					}

					function dismiss(method) {
						switch (method){
							case 'disable':
								$scope.enable = false;
								$scope.disabledByUser = true;
								offMouse();
								break;
						}
						$element.addClass($scope.config.inClass)
							.removeClass($scope.config.outClass)
							.removeClass("top bottom right left blur");
						$scope.displayed = false;
						$scope.opened = false;
					}

					// init the dismiss timer
					function dismissAfter() {
						if (dismissTimer) {
							$timeout.cancel(dismissTimer);
						}
						dismissTimer = $timeout(function () {
							dismiss();
						}, $scope.config.dismissDelay);
					}

					// remove dismiss timer
					function cancelDismiss() {
						if (dismissTimer) {
							$timeout.cancel(dismissTimer);
						}
					}
				}],
				link: function ($scope, $element, $attrs, $ctrl, transclude) {
					transclude($scope.$new(), function (clone) {
						$element.append(clone);

						$scope.config.box = $scope.box ? angular.element($element[0].querySelector($scope.box)) : null;
					});
				}
			}
		}]);

})(window, window.angular);
