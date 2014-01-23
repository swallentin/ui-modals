var app = angular.module('app', [
	'ngAnimate', 
	'ui.bootstrap', 
	'ui.router'
]);

app.value('version', '0.1');

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
			onEnter: function($state, $log, $rootScope) {
			}
		})
		.state('app.monkey.donkey', {
			url: '/donkey/:donkeyid',
			onEnter: onModalEnter('modal.html', 'ModalCtrl')
		})
		.state('animations', {
			url: '/animations',
			templateUrl: 'animations.html',
			controller: 'AnimationsCtrl'
		});

});

app.run(function ($rootScope, $state, $log) {
	$rootScope.$on('cancel state', function (message) {
		$log.log('cancel the shit out of this');
		$state.go('^');
	});
});
