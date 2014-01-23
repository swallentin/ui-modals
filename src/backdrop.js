angular.module('app')
.directive('backdrop', function ($log) {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {
			$(element).on('click', function (ev) {
				// ev.stopPropagation();
			});
		}
	};
});