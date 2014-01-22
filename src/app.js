var app = angular.module('app', [
	'ui.bootstrap', 
	'ui.router'
]);

app.value('version', '0.1');

app.factory('state', function($rootScope, $log) {
	var state = {},
		broadcast = function () {
			$rootScope.$broadcast('State.Update', state);
		},
		update = function (newState)  {
			state = newState;
			broadcast();
		},
		onUpdate = function($scope, callback) {
			$scope.$on('State.Update', function () {
				callback(state);
			});
		};

	return {
		state: state,
		update: update,
		onUpdate: onUpdate
	};
});


function onModalEnter (templateUrl, controllerName) {
	return function ($modal, $state, $log) {

		var modalInstance = $modal.open({
			templateUrl: templateUrl,
			controller: controllerName,
			backdrop: true,
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

app.config(function ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('app', {
			url: '/',
			templateUrl: 'home.html',
			controller: 'MainCtrl'
		})
		.state('app.monkey', {
			url: 'monkey/:monkeyid',
			onEnter: onModalEnter('modal.html', 'ModalCtrl')
		})
		.state('app.monkey.donkey', {
			url: '/donkey/:donkeyid',
			onEnter: onModalEnter('modal.html', 'ModalCtrl')
		});

});

app.controller('MainCtrl', function ($scope, $log, $http, state) {
	$log.log('MainCtrl');

	$scope.state = state.state;

	state.onUpdate($scope, function (newState) {
		$log.log('stuffz');
		$scope.state = newState;
	});
	
	$http.get('data.json').then(function (response) {
		$log.log('response', response.data);
		state.update({
			items: response.data.items,
			selected: response.data.items[0]
		});
	});
});

app.controller('ModalCtrl', function ($scope, $modalInstance, $modal, $stateParams, $log, state) {

	$log.log('ModalCtrl', state);

	$scope.state = state.state;

	state.onUpdate($scope, function (newState) {
		$scope.state = newState;
	});


	$scope.setSelected = function (item) {
		$scope.state.selected = item;
	};

	$scope.ok = function () {
		$modalInstance.close($scope.state);
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

		modalInstance.result.then(function (selected) {
			$log.log('Adhoc modal successful', selected);
			state.update({
				items:state.items,
				selected: selected
			});
		}, function () {
			$log.log('Adhoc modal dismissed');
		});	
	};	

});