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
  .controller('DoctorCtrl', function ($scope,VacService,$routeParams,Session,$location,StateService) {
	$scope.master = {};
	var handleDocSuccessCall = function (rowdata){
		$scope.doctor = rowdata.data[0];
	};
	var handleDocUpdateSuccess = function (rowdata){
		if(rowdata.status==1){
			showPopup("Update Successfully.");
		}else{
			showPopup("Error!!");
		}
	};
	var handleFailCall = function (rowdata){
		showPopup("Please try after sometime!!");
	};
    $scope.update = function(doctor) {
      $scope.master = angular.copy(doctor);
      VacService.saveDocDetails({ 
			success: handleDocUpdateSuccess,
			fail : handleFailCall,
			action : 'update',
			data : $scope.master,
			method : 'POST'
	  });
    };

    $scope.reset = function() {
      $scope.doctor = angular.copy($scope.master);
    };

    $scope.isUnchanged = function(doctor) {
      return angular.equals(doctor, $scope.master);
    };
    $scope.reset();
    if(Session.userId && Session.userRole=="doctor"){
    	$scope.mobile = Session.userId;
    	VacService.getDocDetails({
    		callback: handleDocSuccessCall,
    		mobile: '?mobile='+Session.userId
    	});
    }else{
    	$location.path('/login');
    }   
  });
