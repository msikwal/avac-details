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
	$scope.user_type = [
			{ name: "doctor", val: "1"},
			{ name: "agent", val: "4"}
	];
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
      console.log($scope.master);
      var postRequest = JSON.parse(JSON.stringify($scope.master));
      postRequest['user_type'] = $scope.master['user_type']['val'];
      VacService.userRegister({ 
			success: handleSuccessCall,
			fail : handleFailCall,
			action : 'register',
			data : postRequest,
			method : 'POST'
	  });
    };

    $scope.reset = function() {
      $scope.reguser = angular.copy($scope.master);
      $scope.reguser = {
        	user_type: $scope.user_type[0]
      };
    };

    $scope.isUnchanged = function(reguser) {
      return angular.equals(reguser, $scope.master);
    };
    
    $scope.reset();
    
});
