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
  .controller('DoctorCtrl', function ($scope,VacService,$routeParams,AuthenticationService,Session,$location) {
	$scope.updateSuccess = false;
	var handleDocSuccessCall = function (rowdata){
		$scope.doctor = rowdata.data[0];
	};
	var handleDocUpdateSuccess = function (rowdata){
		if(rowdata.status==1){
			$scope.updateSuccess = true;
			$scope.srMsg = "Update Successfully.";
		}else{
			$scope.srMsg = "Error!!.";
		}
	};
	var handleFailCall = function (rowdata){
		//$scope.userDetails  = rowdata.data[0];
		//var dataVal = rowdata.data[0];
		//console.log(rowdata);
	};
	$scope.master = {};
	
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
    if(Session.userId){
	    $scope.mobile = Session.userId;
	    VacService.getDocDetails({
	    	callback: handleDocSuccessCall,
	    	mobile: '?mobile='+Session.userId
		});
    }else{
    	$location.path('/login');
    }   
  });
