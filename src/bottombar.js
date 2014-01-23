angular.module('app')
.directive('bottombar', function ($log) {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {
			$(element).on('click', function (ev) {
				$log.log('bottombar', ev);
			});
		}
	};
});