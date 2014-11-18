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
  .controller('RegisterCtrl', function ($scope,VacService,Session,$location,AuthenticationService) {
	$('#wrapper').removeClass('toggled');
	$scope.master = {};
	var handleSuccessCall = function (rowdata){
		if(rowdata.status==1){
			$location.path('/login');
		}else{
			console.log(rowdata);
		}
	};
	var handleFailCall = function (rowdata){
		showPopup("Please try after sometime!!");
	};
    $scope.register = function(reguser) {
      $scope.master = angular.copy(reguser);
      //console.log($scope.master);
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
    
});
