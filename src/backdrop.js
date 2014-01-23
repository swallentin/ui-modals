angular.module('app')
.controller('BackdropCtrl', function ($scope, $state) {

	$scope.isActive = function (state) {
	    return $state.current.name.indexOf(state) > -1;
    };
})
.directive('backdrop', function ($log, $rootScope) {
	return {
		restrict: 'EA',
		replace: true,
		templateUrl: 'backdrop.html',
		controller: 'BackdropCtrl',
		link: function($scope, element, attrs) {
			$(element).on('click', function (ev) {
				$log.log('backdrop', ev);
				$rootScope.$broadcast('cancel state');
			});			
		}
	};
});