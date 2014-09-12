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
  .controller('DoctorCtrl', function ($scope,VacService) {
	$('#wrapper').removeClass('toggled');
	var handleSuccessCall = function (rowdata){
		//$scope.userDetails  = rowdata.data[0];
		var dataVal = rowdata.data[0];
		console.log(dataVal);
	};
	var handleFailCall = function (rowdata){
		//$scope.userDetails  = rowdata.data[0];
		var dataVal = rowdata.data[0];
		console.log(dataVal);
	};
	$scope.master = {};

    $scope.update = function(doctor) {
      $scope.master = angular.copy(doctor);
      console.log($scope.master);
      VacService.saveDocDetails({ 
			success: handleSuccessCall,
			fail : handleFailCall,
			action : 'update',
			data : $scope.master,
			method : 'POST'
	  });
      /*VacService.getUserDetails({
			callback: handleSuccessCall,
			mobile: '?mobile=2222222222'
		});*/
    };

    $scope.reset = function() {
      $scope.doctor = angular.copy($scope.master);
    };

    $scope.isUnchanged = function(user) {
      return angular.equals(user, $scope.master);
    };

    $scope.reset();
  });
