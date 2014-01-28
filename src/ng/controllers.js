angular.module('app')
	.controller('MainCtrl', function ($scope, $log, $http, $state) {
		$scope.$state = $state;
	});

angular.module('app')
	.controller('BottombarCtrl', function ($scope, $log, $rootScope, $state) {
		$log.log('BottombarCtrl');

		$scope.isVisible = $scope.isActive = false;

		$rootScope.$on('bottombar:isVisible', function (ev, isVisible) {
			$scope.isVisible = isVisible;
		});

		$rootScope.$on('bottombar:isActive', function (ev, isActive) {
			$scope.isActive = isActive
		});

		$scope.$watch('isActive', function (newValue, oldValue) {
			$log.log('$watch isActive: ', newValue, oldValue);

			$rootScope.$broadcast('backdrop:toggle', newValue);
		});

		$rootScope.$on("bottombar:settings", function(ev, message) {
			$scope.title = message.buttonTitle;
			$scope.target = $state.href(message.buttonTargetState, message.buttonTargetStateArgs);
		});

		$rootScope.$broadcast('bottombar:ready');
	});

angular.module('app')
	.controller('BackdropCtrl', function ($scope, $state, $log, $rootScope) {
		$log.log('BackdropCtrl');

		$rootScope.$on('backdrop:toggle', function (ev, message) {
			$log.log('backdrop toggle', message);
			$scope.active = message;
		});

		$rootScope.$broadcast('backdrop:ready');

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

		$rootScope.$broadcast('bottombar:isActive', true);

	});

angular.module('app')
	.controller('ReportsCtrl', function ($scope, $log, $rootScope) {

		$rootScope.$on('bottombar:ready', function (ev, message) {
			$rootScope.$broadcast('bottombar:isVisible', true);
		});

	});

angular.module('app')
	.controller('ViewReportCtrl', function ($scope) {

	});