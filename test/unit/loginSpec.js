describe('login function', function () {
	// critical
	it('ensure invalid email adresses are caught', function (done) {
		
	});

	it('ensure valid email adresses pass validation', function (done) {
		
	});

	it('ensure submitting form changes path', function (done) {
		
	});

	// nice-to-haves
	it('ensure client-side helper shown for empty fields', function (done) {
		
	});

	it('ensure hitting enter on password field submits form', function (done) {
		
	});

});

describe('Unit Testing Examples', function () {
	
	beforeEach(module('app'));

	var LoginCtrl,
		scope;

	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();
		LoginCtrl = $controller('LoginCtrl', {
			$scope: scope
		});
	}));

	it('should have a LoginCtrl controller', function () {
		expect(LoginCtrl).toBeDefined();
	});

	it('should attach a list of awesomeThings to scope', function () {
		expect(scope.awesomeThings.length).toBe(3);
	});

	describe('When using the LoginService', function () {

		var loginService;

		beforeEach(inject(function (LoginService) {
			loginService = LoginService
		}));

		it('should be defined', function () {
			expect(loginService).toBeDefined();
		});

		it('should have a isValidEmail function', function (done) {
			expect(loginService.isValidEmail).not.toBe(null);			
		});
		
		it('should be able to validate valid emails', function () {
				var validEmails = [
					'tests@test.com',
					'test@test.co.uk',
					'test243123489231293487dfas@jb-fe.com'
				];


				for (var i in validEmails) {
					var valid = loginService.isValidEmail(validEmails[i]);
					expect(valid).toBeTruthy();
				}
			
		});

		it('should be able to validate invalid emails', function (done) {
				var invalidEmails = [
					'test@testcom',
					'test@ test.co.uk',
					'ghgh@fe.com.co.',
					'test@t@test.com',
					''
				];

				for(var i in invalidEmails) {
					var invalid = loginService.isValidEmail(invalidEmails[i]);
					expect(invalid).toBeFalsy();
				}
			
		});
	});


});