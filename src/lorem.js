angular.module('app').directive('lorem', function () {
	return {
		restrict: 'EA',
		link: function ($scope, element, attrs) {
			var paragraphs = attrs.paragraphs || 1,
				paragraphTemplate = "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam mattis enim in sapien pharetra, a commodo massa tincidunt. Maecenas justo orci, rhoncus eu porttitor ut, consectetur in lectus. Duis ut ullamcorper quam, sit amet fermentum justo. Integer congue est in nulla ultrices, a iaculis orci sagittis. Nam mauris dui, iaculis vitae luctus sit amet, accumsan sed erat. Curabitur feugiat facilisis ipsum in volutpat. Morbi magna turpis, posuere vitae diam vitae, pharetra ornare nibh. Nulla vel auctor neque.</p>",
				output = "";

			for (var i = 0; i < paragraphs; i++) {
				output += paragraphTemplate;
			};

			element.html(output);
		}
	};
});