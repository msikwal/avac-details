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
.controller('LoginCtrl', function ($scope,VacService,Session,$location) {
	var handleSuccessCall = function (rowdata){
		//$scope.userDetails  = rowdata.data[0];
		var userRole;
		var token = new Date().getTime() * rowdata.status.group_id * 100;
		if(rowdata.status==1){
			userRole = 'doctor';
			$location.search('mobile',$scope.master.mobile_num).path('/doctor');
		}else if(rowdata.status ==2){
			userRole = 'reguser';
			$location.search('mobile',$scope.master.mobile_num).path('/user');
		}
		$scope.userRoles = userRole;
		Session.create(token,$scope.master.mobile_num,userRole);
	};
	/*var isAuthenticated = function () {
	    return !!Session.userId;
	};
	var isAuthorized = function (authorizedRoles) {
	    if (!angular.isArray(authorizedRoles)) {
	      authorizedRoles = [authorizedRoles];
	    }
	    return (authService.isAuthenticated() &&
	      authorizedRoles.indexOf(Session.userRole) !== -1);
	};*/
	var handleFailCall = function (rowdata){
		//$scope.userDetails  = rowdata.data[0];
		console.log(rowdata);
	};
	$scope.master = {};
    $scope.login = function(user) {
      $scope.master = angular.copy(user);
      console.log($scope.master);
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
});
