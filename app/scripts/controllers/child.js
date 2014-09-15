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
  .controller('ChildCtrl', function ($scope,VacService,AuthenticationService,Session,$location) {
	$scope.updateSuccess ="0";
	var handleSuccessCall = function (rowdata){
		$scope.child = rowdata.data[0];
		console.log($scope.child);
	};
	var handleUpdateSuccessCall = function (rowdata){
		$scope.updateSuccess = rowdata.status;
	}; 
	var handleFailCall = function (rowdata){
		//$scope.userDetails  = rowdata.data[0];
	};
	$scope.master = {};

    $scope.update = function(child) {
      if(Session.userId){
    	  child.docId = Session.userId;
    	  $scope.master = angular.copy(child);
    	  console.log($scope.master);
    	  VacService.saveChildVacDetails({ 
				success: handleUpdateSuccessCall,
				fail : handleFailCall,
				action : 'save',
				data : $scope.master,
				method : 'POST'
	  	});
      }else{
    	  $location.path('/login');
      }	  
    };

    $scope.reset = function() {
      $scope.child = angular.copy($scope.master);
    };

    $scope.isUnchanged = function(child) {
      return angular.equals(child, $scope.master);
    };
   
    $scope.reset();
});

