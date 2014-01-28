angular.module('app')
	.directive('bottombar', function ($log, $rootScope) {
		return {
			restrict: 'EA',
			templateUrl: 'views/bottombar.html',
			replace: true,
			controller: 'BottombarCtrl',
			link: function($scope, $element, attrs) {
			}
		};
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

				$scope.$watch('active', function (newValue, oldValue) {
					if(newValue === oldValue) return;

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