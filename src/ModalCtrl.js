angular.module('app')
.controller('ModalCtrl', function ($scope, $modalInstance, $modal, $stateParams, $log) {




	$scope.ok = function () {
		$modalInstance.close('test');
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.open = function () {
		var modalInstance = $modal.open({
			templateUrl: 'modal.html',
			controller: 'ModalCtrl',
			backdrop: true
		});

		modalInstance.result.then(function (result) {
			$log.log('Adhoc modal successful', result);
		}, function () {
			$log.log('Adhoc modal dismissed');
		});	
	};	

});