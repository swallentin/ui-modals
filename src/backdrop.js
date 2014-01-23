angular.module('app')
.controller('BackdropCtrl', function ($scope, $state) {

	$scope.isActive = function (state) {
	    return $state.current.name.indexOf(state) > -1;
    };
})

.directive('backdrop', function ($log, $rootScope, $modal) {
	return {
		restrict: 'EA',
		replace: true,
		templateUrl: 'backdrop.html',
		controller: 'BackdropCtrl',
		link: function($scope, element, attrs) {

			$(element).on('click', function (ev) {
				$log.log('backdrop clicked');
				var modalInstance = $modal.open({
					templateUrl: 'modal-cancel.html',
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

			});			
		}
	};
});