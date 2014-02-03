angular.module('app')
	.controller('MainCtrl', function ($scope, $log, $http, $state, ContextService, SimpleService, $rootScope) {

		var databind = function() {
				databindCurrentContext();
				databindContexts();
				databindReports();
			},
			databindCurrentContext = function () {
				ContextService.current().then(function (context) {
					$scope.currentContext = context;
				});
			},
			databindContexts = function () {
					ContextService.get().then(function(contexts) {
						$scope.contexts = contexts;
					});
			},
			databindReports = function () {
				SimpleService.get().then(function (reports) {
					$log.log('Ctrl', reports);
					$scope.reports = reports;
				});
			},
			contextUpdatedHandler = $rootScope.$on('ContextService:context:updated', databind);

		$scope.switchContext = function(contextId) {
			ContextService.set(contextId).then(function() {
				ContextService.current().then(function (currentContext) {
					$scope.currentContext = currentContext;
				});
			}, function(error) {
				$log.log('fail', error);
			});
		};

		databind();

		$scope.$on('$destroy', function () {
			contextUpdatedHandler();
		});

	});

angular.module('app')
	.controller('BottombarCtrl', function ($scope, $log, $rootScope, $state) {
		$log.log('BottombarCtrl');

		var isVisibleHandler = $rootScope.$on('bottombar:isVisible', function (ev, isVisible) {
			$scope.isVisible = isVisible;
		});

		var isActiveHandler = $rootScope.$on('bottombar:isActive', function (ev, isActive) {
			$log.log('handling bottombar isActive');
			$scope.isActive = isActive
		});

		var isActiveWatcher = $scope.$watch('isActive', function (newValue, oldValue) {
			$log.log('$watch isActive: ', newValue, oldValue);
			$rootScope.$broadcast('backdrop:isActive', newValue);
		});

		var bottomBarSettingsHandler = $rootScope.$on("bottombar:settings", function(ev, message) {
			$scope.title = message.buttonTitle;
			$scope.target = $state.href(message.buttonTargetState, message.buttonTargetStateArgs);
		});

		$scope.isVisible = false;
		$scope.isActive = false;

		$rootScope.$broadcast('bottombar:ready');

		var backdropReadyHandler = $rootScope.$on('backdrop:ready', function () {
			$rootScope.$broadcast('backdrop:isActive', $scope.isActive);
		});


		$scope.$on('$destroy', function () {
			isVisibleHandler();
			isActiveHandler();
			isActiveWatcher();
			bottomBarSettingsHandler();
			backdropReadyHandler();
		});
	});

angular.module('app')
	.controller('BackdropCtrl', function ($scope, $state, $log, $rootScope) {
		$log.log('BackdropCtrl');

		var handler = $rootScope.$on('backdrop:isActive', function (ev, isActive) {
			$scope.isActive= isActive;
		});

		$rootScope.$broadcast('backdrop:ready');

		$scope.$on('$destroy', function () {
			handler();
		});
	});

angular.module('app')
	.controller('ModalCtrl', function ($scope, $modalInstance, $modal, $stateParams, $log) {

		$scope.ok = function () {
			$modalInstance.close('ok');
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

	});

angular.module('app')
	.controller('ReportBottombarCtrl', function ($scope, $log, $rootScope, $timeout) {
		$log.log('ReportBottombarCtrl');

		$rootScope.$broadcast('bottombar:settings', {
			buttonTitle: 'Title',
			buttonTargetState: 'app.reports.edit',
			buttonTargetStateArgs: {
				reportid: "ompalompa"
			}
		});

		var editFilterCompleteHandler = $rootScope.$on('edit-filter-complete', function(ev, result) {
			$log.log('there is a new result', result, new Date());
		});

		$rootScope.$broadcast('bottombar:isActive', true);

		$scope.$on('$destroy', function () {
			$log.log('die die die');
			editFilterCompleteHandler();
		});
	});

angular.module('app')
	.controller('ReportsCtrl', function ($scope, $log, $rootScope) {

		var bottombarReadyHandler = $rootScope.$on('bottombar:ready', function (ev, message) {
			$rootScope.$broadcast('bottombar:isVisible', true);
		});

		$scope.$on('$destroy', function () {
			bottombarReadyHandler();
		});

	});

angular.module('app')
	.controller('ViewReportCtrl', function ($scope) {

	});