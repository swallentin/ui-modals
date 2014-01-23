angular.module('app')
.controller('MainCtrl', function ($scope, $log, $http, $state) {
	$scope.$state = $state;
	$log.log('MainCtrl');

	$scope.isActive = function (state) {
		return $state.current.name.indexOf(state) > -1;
	}

});

	// $http.get('data.json').then(function (response) {
	// 	$log.log('response', response.data);
	// 	state.update({
	// 		items: response.data.items,
	// 		selected: response.data.items[0]
	// 	});
	// });

