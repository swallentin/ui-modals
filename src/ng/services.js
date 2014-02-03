angular.module('app')
	.factory('LoginService', function () {
		return {
			isValidEmail: function (email) {
			    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			    return re.test(email);
			}
		};
	})
	.factory('SimpleService', function ($http, $q, ContextService) {
		var get = function () {
			var deferred = $q.defer();

			ContextService.buildParams().then(function (params) {
				$http.get('http://localhost:5000/reports', {
					params: params
				}).then(function (response) {
					deferred.resolve(response.data);
				});
			});


			return deferred.promise;
		};

		return {
			get: get
		}
	})
	.factory('ContextService', function ($http, $q, $log, $rootScope) {
			var currentContext,
				setContext = function(context) {
					currentContext = context;
					$rootScope.$broadcast('ContextService:context:updated');
				},
				current = function () {
					var deferred = $q.defer();

					if(currentContext) {
						deferred.resolve(currentContext);
					} else {
						get().then(function (contexts) {
							setContext(contexts[0]);
							deferred.resolve(currentContext);
						});
					}

					return deferred.promise;
				},
				get = function () {
					var deferred = $q.defer();

					$http.get('http://localhost:5000/contexts').then(function (response) {
						deferred.resolve(response.data);
					}, function(error) {
						deferred.reject(error);
					});

					return deferred.promise;
				},
				getById = function (id) {
					var deferred = $q.defer(),
						url = "http://localhost:5000/contexts/:contextid".replace(":contextid", id);

					$http.get(url).then(function (response) {
						deferred.resolve(response.data);
					}, function(error) {
						deferred.reject(error);
					});

					return deferred.promise;
				},
				set = function(contextId) {
					var deferred = $q.defer();
					getById(contextId).then( function(context) {
						setContext(context);
						deferred.resolve(currentContext);
					}, function() {
						deferred.reject(false);
					});

					return deferred.promise;
				},
				buildParams = function () {
					var deferred = $q.defer();

					current().then(function (context) {
						deferred.resolve({
							contextTag: context.tag
						});
					});

					return deferred.promise;
				};

		return {
			current: current,
			get: get,
			getById: getById,
			set: set,
			buildParams: buildParams
		};
	});