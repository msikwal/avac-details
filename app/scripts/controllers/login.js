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
.controller('LoginCtrl', function ($scope,VacService) {
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
