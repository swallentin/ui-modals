angular.module('app')
	.factory('LoginService', function () {
		return {
			isValidEmail: function (email) {
			    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			    return re.test(email);
			}
		};
	})
	.factory('AuthorizationService', function ($q, ContextService, $log) {
		return {
			authorize: function (feature) {
				var context = ContextService.current();
				return context.features &&
					context.features.indexOf(feature) !== -1;
			}
		};
	})
	.factory('ACLService', function (config, $log) {
			/*
			 Method to build a distinct bit mask for each role
			 It starts off with "1" and shifts the bit to the left for each element in the
			 roles array parameter
			 */
			var buildRoles = function (roles) {
				var bitMask = "01",
					userRoles = {},
					role;

				for (role in roles) {
					var intCode = parseInt(bitMask, 2);
					userRoles[roles[role]] = {
						bitMask: intCode,
						title: roles[role]
					};
					bitMask = (intCode << 1 ).toString(2)
				}

				return userRoles;
			},
			buildAccessLevels = function (accessLevelDeclarations, userRoles) {
				var accessLevels = {},
					level;

				for(level in accessLevelDeclarations){

					if(typeof accessLevelDeclarations[level] == 'string'){
						if(accessLevelDeclarations[level] == '*'){

							var resultBitMask = '';

							for( var role in userRoles){
								resultBitMask += "1"
							}
							//accessLevels[level] = parseInt(resultBitMask, 2);
							accessLevels[level] = {
								bitMask: parseInt(resultBitMask, 2),
								title: level
							};
						}
						else console.log("Access Control Error: Could not parse '" + accessLevelDeclarations[level] + "' as access definition for level '" + level + "'")

					}
					else {

						var resultBitMask = 0;
						for(var role in accessLevelDeclarations[level]){
							if(userRoles.hasOwnProperty(accessLevelDeclarations[level][role]))
								resultBitMask = resultBitMask | userRoles[accessLevelDeclarations[level][role]].bitMask
							else console.log("Access Control Error: Could not find role '" + accessLevelDeclarations[level][role] + "' in registered roles while building access for '" + level + "'")
						}
						accessLevels[level] = {
							bitMask: resultBitMask,
							title: level
						};
					}
				}

				return accessLevels;
			},
			roles = buildRoles(config.security.roles),
			accessLevels = buildAccessLevels(config.security.accessLevels, roles);

		return {
			roles: roles,
			accessLevels: accessLevels
		};
	})
	.factory('SimpleService', function ($http, $q, ContextService, config) {
		var get = function () {
			var deferred = $q.defer(),
				url = config.apiHost + config.endPoints.reports,
				params = {
					params: ContextService.buildParams()
				},
				success = function (response) {
					deferred.resolve(response.data);
				},
				error = function (error) {
					deferred.reject(error);
				};

			$http.get(url, params).then(success, error);

			return deferred.promise;
		};

		return {
			get: get
		}
	})
	.factory('ContextService', function ($http, $q, $log, $rootScope, config) {
			var currentContext = {},
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
					var deferred = $q.defer(),
						url = config.apiHost + config.endPoints.contexts,
						success = function (response) {
							deferred.resolve(response.data);
						},
						error = function(error) {
							deferred.reject(error);
						};

					$http.get(url).then(success, error);

					return deferred.promise;
				},
				getById = function (id) {
					var deferred = $q.defer(),
						url = (config.apiHost + config.endPoints.context).replace(":contextid", id),
						success = function (response) {
							deferred.resolve(response.data);
						},
						error = function(error) {
							deferred.reject(error);
						};

					$http.get(url).then(success, error);

					return deferred.promise;
				},
				set = function(contextId) {
					var deferred = $q.defer(),
						success = function(context) {
							setContext(context);
							deferred.resolve(currentContext);
						},
						error = function(error) {
							deferred.reject(error);
						};

					getById(contextId).then(success, error);

					return deferred.promise;
				},
				buildParams = function () {
					return {
						contextTag: currentContext.tag
					};
				};

		return {
			current: function() {
				return currentContext;
			},
			get: get,
			getById: getById,
			set: set,
			buildParams: buildParams
		};
	});