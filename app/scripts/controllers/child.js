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
	var handleUpdateSuccessCall = function (rowdata){
		if(rowdata.status==1){
			showPopup("Record Added Successfully.");
		}else{
			showPopup("Error Occoured!!");
		}
		$('#c_frm')[0].reset();
		$scope.c_frm.$setPristine();
	}; 
	var handleFailCall = function (rowdata){
		//$scope.userDetails  = rowdata.data[0];
		showPopup("Please try after sometime!!");
	};
	$scope.master = {};

    $scope.update = function(child) {
      if(Session.userId){
    	  child.docId = Session.userId;
    	  $scope.master = angular.copy(child);
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
    $scope.max_date = moment().format('YYYY-MM-DD');
    $scope.min_date  = moment(moment().subtract(20, 'years')._d).format('YYYY-MM-DD');
});

