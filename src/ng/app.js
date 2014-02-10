angular.module('app', [
	'ngAnimate',
	'ui.bootstrap',
	'ui.router',
	'ajoslin.promise-tracker'

])
.value('version', '0.1')
.value('config', {
	apiHost: 'http://localhost:5000',
	endPoints: {
		context: '/contexts/:contextid',
		contexts: '/contexts',
		reports: '/reports'
	}
})
.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
	var createModal = function (templateUrl, controllerName, broadcastResultTo) {
			return function ($modal, $state, $log, $rootScope) {

				var modalInstance = $modal.open({
						templateUrl: templateUrl,
						controller: controllerName,
						backdrop: true,
						windowClass: 'modal-secondary'
					}),

					completed = function () {
						$state.go('^');
					};

				modalInstance.result.then(function (result) {
					$log.log('Router modal successful');

					if(broadcastResultTo)
						$rootScope.$broadcast(broadcastResultTo, result);

					completed();
				}, function () {
					$log.log('Router modal dismissed');
					completed();
				});
			}
		};

	$httpProvider.interceptors.push('LoadingTrackerHTTPInterceptor');

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
			onExit: function ($rootScope,$timeout, $log) {
				$timeout(function () {
					$rootScope.$broadcast('bottombar:isVisible', false)
				}, 0);
			}
		})
			.state('app.reports.view', {
				url: '/:reportid',
				onEnter: createModal('views/view-report.html', 'ModalCtrl'),
				onExit: function ($log) {
//						@todo: check if a modal exists
					$log.log('exiting view report state');
				}
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
					onEnter: createModal('views/edit-filter.html', 'ModalCtrl', 'edit-filter-complete')
				});

})
.run(function ($rootScope, $state, $log) {

	$rootScope.$on('cancel state', function (message) {
		$state.go('^');
	});
});
