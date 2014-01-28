angular.module('app', [
	'ngAnimate',
	'ui.bootstrap',
	'ui.router'
]);

angular.module('app')
	.value('version', '0.1');


angular.module('app')
	.config(function ($stateProvider, $urlRouterProvider) {
		var createModal = function (templateUrl, controllerName) {
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
				onEnter: function ($rootScope, $timeout) {
					$timeout(function () {
						$rootScope.$broadcast('bottombar:isVisible', true)
					}, 0);
				},
				onExit: function ($rootScope,$timeout) {
					$timeout(function () {
						$rootScope.$broadcast('bottombar:isVisible', false)
					}, 0);
				}
			})
				.state('app.reports.view', {
					url: '/:reportid',
					onEnter: createModal('views/view-report.html', 'ModalCtrl')
				})
				.state('app.reports.edit', {
					url: '/:reportid/edit',
					views: {
						"secondary@app": {
							templateUrl: 'views/report-bottombar.html',
							controller: 'ReportBottombarCtrl'
						}
					},
					onEnter: function ($log, $rootScope, $timeout) {
						// toggle bottombar
						$timeout(function () {
							$rootScope.$broadcast('bottombar:isActive', true)
						}, 0);
					},
					onExit: function ($log, $rootScope, $timeout) {
						// toggle bottombar
						$log.log('Leaving create report');
						$timeout(function () {
							$rootScope.$broadcast('bottombar:isActive', false)
						}, 0);
					}
				})
					.state('app.reports.edit.edit-filter', {
						url: '/filter/:filterid/edit',
						onEnter: createModal('views/edit-filter.html', 'ModalCtrl')
					});

	});

angular.module('app')
	.run(function ($rootScope, $state, $log) {
		$rootScope.$on('cancel state', function (message) {
			$state.go('^');
		});
	});
