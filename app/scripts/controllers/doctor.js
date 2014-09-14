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
	$('#wrapper').removeClass('toggled');
	
	var handleDocSuccessCall = function (rowdata){
		$scope.doctor = rowdata.data[0];
	};
	var handleDocUpdateSuccess = function (rowdata){
		//$scope.doctor = rowdata.data[0];
		$scope.updateSuccess = rowdata.status;
	};
	var handleFailCall = function (rowdata){
		//$scope.userDetails  = rowdata.data[0];
		//var dataVal = rowdata.data[0];
		//console.log(rowdata);
	};
	$scope.master = {};
	
    $scope.update = function(doctor) {
      $scope.master = angular.copy(doctor);
      //console.log($scope.master);
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
      $scope.updateSuccess ="0";
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
