angular.module('app')
	.directive('bottombar', function ($log, $rootScope, $document) {
		return {
			restrict: 'EA',
			templateUrl: 'views/bottombar.html',
			controller: 'BottombarCtrl',
			link: function($scope, $element, attrs) {
				$log.log('directive stuff');
			}
		};
	});

angular.module('app')
	.directive('navAnimation', function ($rootScope, $log, $animate, AuthorizationService) {
		return {
			link: function ($scope, $element, $attrs) {

				$element.addClass('navimation');
				var handler = $rootScope.$on('ContextService:context:updated', function () {

					$animate.addClass($element, 'toggle', function () {
						var $elements = $element.find('[data-nav-access-level]'),
							$navElement,
							accessLevel;

						$elements.each(function (index, navElement) {
							$navElement = $(navElement);
							accessLevel = $navElement.data('nav-access-level');
							if(AuthorizationService.authorize(accessLevel)) {
								$navElement.removeClass('disabled');
							} else {
								$navElement.addClass('disabled');
							}
						});
						$animate.removeClass($element, 'toggle');
					})
				});


				$scope.$on('$destroy', function() {
					handler();
				})
			}
		};

	});


angular.module('app')
	.directive('accessLevel', function(AuthorizationService, $log, $rootScope, $animate) {
		return {
			restrict: 'A',
			link: function ($scope, $element, $attrs) {

				$element.addClass('accessLevel');
				var _feature,
					prevDisp = $element.css('display'),
					updateCSS = function () {
						if (AuthorizationService.authorize(_feature)) {
							$animate.addClass($element, 'enabled');
//							$element.css('display', prevDisp);
						} else {
//							$element.css('display', 'none')
							$animate.removeClass($element, 'enabled');
						}
					},
					userContextChangedHandler = $rootScope.$on('ContextService:context:updated', updateCSS);

				$attrs.$observe('accessLevel', function (accessLevel) {
					if(accessLevel) {
						_feature = accessLevel;
						updateCSS();
					}
				});


				$scope.$on('$destroy', function () {
					userContextChangedHandler();
				});
			}
		}
	});

angular.module('app')
	.directive('lorem', function () {
		return {
			restrict: 'EA',
			link: function ($scope, element, attrs) {
				var paragraphs = attrs.paragraphs || 1,
					paragraphTemplate = "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam mattis enim in sapien pharetra, a commodo massa tincidunt. Maecenas justo orci, rhoncus eu porttitor ut, consectetur in lectus. Duis ut ullamcorper quam, sit amet fermentum justo. Integer congue est in nulla ultrices, a iaculis orci sagittis. Nam mauris dui, iaculis vitae luctus sit amet, accumsan sed erat. Curabitur feugiat facilisis ipsum in volutpat. Morbi magna turpis, posuere vitae diam vitae, pharetra ornare nibh. Nulla vel auctor neque.</p>",
					output = "";

				for (var i = 0; i < paragraphs; i++) {
					output += paragraphTemplate;
				}

				element.html(output);
			}
		};
	});

angular.module('app')
	.directive('backdrop', function ($log, $rootScope, $modal, $document) {
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: 'views/backdrop.html',
			controller: 'BackdropCtrl',
			link: function($scope, $element, attrs) {
				var handler = function (ev) {

					if (ev.type === 'keyup' && ev.which !== 27) {
						return;
					}

					var modalInstance = $modal.open({
						templateUrl: 'views/modal-cancel.html',
						controller: 'ModalCtrl',
						backdrop: false,
						windowClass: 'modal-cancel'
					});

					modalInstance.result.then(function (result) {
						$rootScope.$broadcast('cancel state');
						$log.log('Adhoc modal successful', result);
					}, function () {
						$log.log('Adhoc modal dismissed');
					});

				};

				$scope.$watch('isActive', function (newValue, oldValue) {

					if(newValue) {
						$element.bind('click', handler);
						$document.bind('keyup', handler);
					} else {
						$element.unbind('click', handler);
						$document.unbind('keyup', handler);
					}
				});

			}
		};
	});