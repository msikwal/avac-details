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
.controller('UserCtrl', function ($scope,VacService,AuthenticationService,Session,$location) {
	$('#wrapper').removeClass('toggled');
	$scope.updateSuccess ="0";
	var handleSuccessCall = function (rowdata){
		//$scope.userDetails  = rowdata.data[0];
		$scope.user = rowdata.data[0];
		Session.setCurrentUser($scope.user);
		console.log($scope.user);
	};
	var handleUpdateSuccessCall = function (rowdata){
		$scope.updateSuccess = rowdata.status;
	}; 
	var handleFailCall = function (rowdata){
		//$scope.userDetails  = rowdata.data[0];
	};
	$scope.master = {};

    $scope.update = function(user) {
      $scope.master = angular.copy(user);
      console.log($scope.master);
      VacService.saveUserDetails({ 
			success: handleUpdateSuccessCall,
			fail : handleFailCall,
			action : 'update',
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
    if(Session.userId){
	    $scope.mobile = Session.userId;
	    VacService.getUserDetails({
			callback: handleSuccessCall,
			mobile: '?mobile='+$scope.mobile
		});
    }else{
    	$location.path('/login');
    }   
    $scope.reset();
});
