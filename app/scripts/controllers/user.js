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
	$('#right-menu-toggle').popover('hide');
	var handleSuccessCall = function (rowdata){
		$scope.user = rowdata.data[0];
		Session.setCurrentUser($scope.user);
	};
	var handleUpdateSuccessCall = function (rowdata){
		if(rowdata.status==1){
			showPopup("Update Successfully.");
		}else{
			showPopup("Error!!");
		}
	}; 
	var handleFailCall = function (rowdata){
		showPopup("Please try after sometime!!");
	};
	$scope.master = {};

    $scope.update = function(user) {
      $scope.master = angular.copy(user);
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
