angular.module('app')
.controller('ModalCtrl', function ($scope, $modalInstance, $modal, $stateParams, $log) {

	$scope.ok = function () {
		$modalInstance.close('ok');
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

});