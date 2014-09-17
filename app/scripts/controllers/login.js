'use strict';
/*jshint jquery:true*/
/**
 * @ngdoc function
 * @name avacDetailsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the avacDetailsApp
 */
angular.module('avacDetailsApp')
.controller('LoginCtrl', function ($scope,VacService,Session,$location,AuthenticationService) {
	$('#wrapper').removeClass('toggled');
	$scope.invalidDetails =false;
	$scope.errorMsg = null;
	var handleSuccessCall = function (rowdata){
		//$scope.userDetails  = rowdata.data[0];
		var userRole;
		var token = new Date().getTime() * rowdata.status * 100;
		if(rowdata.status==1){
			userRole = 'doctor';
			AuthenticationService.isAuthenticated =true;
			$location.path('/doctor');
		}else if(rowdata.status ==2){
			AuthenticationService.isAuthenticated =true;
			userRole = 'reguser';
			$location.path('/user');
		}else{
			$scope.invalidDetails = true;
			$scope.errorMsg = "Invalid Credentials.";
		}
		Session.create(token,$scope.master.mobile_num,userRole);
	};
	var handleFailCall = function (rowdata){
		console.log(rowdata);
	};
	$scope.master = {};
    $scope.login = function(user) {
      $scope.master = angular.copy(user);
      VacService.userLogin({ 
			success: handleSuccessCall,
			fail : handleFailCall,
			action : 'login',
			data : $scope.master,
			method : 'POST'
	  });
    };

    $scope.reset = function() {
      $scope.user = angular.copy($scope.master);
    };

    $scope.isUnchanged = function(user) {
      return angular.equals(user, $scope.master);
    };
    $scope.reset();
}).controller('RegisterCtrl', function ($scope,VacService,Session,$location,AuthenticationService) {
	$('#wrapper').removeClass('toggled');
	$scope.master = {};
	var handleSuccessCall = function (rowdata){
		
		if(rowdata.status==1){
			$location.path('/login');
		}else{
			console.log(rowdata);
		}
		//$scope.userDetails  = rowdata.data[0];
		/*var userRole;
		var token = new Date().getTime() * rowdata.status * 100;
		if(rowdata.status==1){
			userRole = 'doctor';
			AuthenticationService.isAuthenticated =true;
			$location.path('/doctor');
		}else if(rowdata.status ==2){
			AuthenticationService.isAuthenticated =true;
			userRole = 'reguser';
			$location.path('/user');
		}
		Session.create(token,$scope.master.mobile_num,userRole);*/
	};
	var handleFailCall = function (rowdata){
		console.log(rowdata);
	};
    $scope.register = function(reguser) {
      $scope.master = angular.copy(reguser);
      console.log($scope.master);
      VacService.userRegister({ 
			success: handleSuccessCall,
			fail : handleFailCall,
			action : 'register',
			data : $scope.master,
			method : 'POST'
	  });
    };

    $scope.reset = function() {
      $scope.reguser = angular.copy($scope.master);
    };

    $scope.isUnchanged = function(reguser) {
      return angular.equals(reguser, $scope.master);
    };
    $scope.reset();
})
.controller('LoginOutCtrl', function ($scope,VacService,Session,$location,AuthenticationService) {
	Session.destroy();
	AuthenticationService.isAuthenticated =false;
	AuthenticationService.isDoc =false;
	$('.sidebar-nav li').removeClass('hide');
	$('.sidebar-nav li').eq(4).addClass('hide');
	$('.sidebar-nav li').eq(5).addClass('hide');
	$location.path('/');
});

