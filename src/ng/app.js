angular.module('app', [
	'ngAnimate',
	'ui.bootstrap',
	'ui.router'
]);

angular.module('app')
	.value('version', '0.1');


angular.module('app')
	.config(function ($stateProvider, $urlRouterProvider) {
		var debugController = function ($scope, $log, $state) {
				$log.log("logging");
			},
			onModalEnter = function (templateUrl, controllerName) {
				return function ($modal, $state, $log) {

					var modalInstance = $modal.open({
							templateUrl: templateUrl,
							controller: controllerName,
							backdrop: true
						}),

						completed = function () {
							$state.go('^');
						};

					modalInstance.result.then(function () {
						$log.log('Router modal successful');
						completed();
					}, function () {
						$log.log('Router modal dismissed');
						completed();
					});
				}
			};

		$urlRouterProvider.otherwise('/');

		$stateProvider

		.state('app', {
			url: '/',
			templateUrl: 'views/layout.html',
			controller: 'MainCtrl'
		})
			.state('app.reports', {
				url: 'reports',
				views: {
					"primary@app": {
						templateUrl: "views/reports.html",
						controller: "ReportsCtrl"
					}
				},
				onEnter: function ($rootScope) {
					$rootScope.$broadcast('bottombar:isVisible', true);
				},
				onExit: function ($rootScope) {
					$rootScope.$broadcast('bottombar:isVisible', false);
				}
			})
				.state('app.reports.view', {
					url: '/:reportid',
					onEnter: onModalEnter('views/view-report.html', 'ModalCtrl')
				})
				.state('app.reports.edit', {
					url: '/:reportid/edit',
					views: {
						"secondary@app": {
							templateUrl: 'views/report-bottombar.html',
							controller: 'ReportBottombarCtrl'
						}
					},
					onEnter: function ($log, $rootScope) {
						// toggle bottombar
						$log.log('Entering create report');
						$rootScope.$broadcast('bottombar:isActive', true);
					},
					onExit: function ($log, $rootScope) {
						// toggle bottombar
						$log.log('Leaving create report');
						$rootScope.$broadcast('bottombar:isActive', false);
					}
				})
					.state('app.reports.edit.edit-filter', {
						url: '/filter/:filterid/edit',
						onEnter: onModalEnter('views/edit-filter.html', 'ModalCtrl')
					});

	});

angular.module('app')
	.run(function ($rootScope, $state, $log) {
		$rootScope.$on('cancel state', function (message) {
			$state.go('^');
		});
	});
