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
.controller('VacHealthCtrl', function ($scope,VacService,AuthenticationService,Session,$location){
	$scope.healthDetails = {};
	$scope.invalidDetails = false;
	$scope.durations = [
			{ name: "7 days", val: "7"},
			{ name: "15 days", val: "15"},
			{ name: "30 days", val: "30"},
			{ name: "45 days", val: "45"}
	];
	$scope.months = [
		 {name:'2 week', val:'15'},
		 {name:'1 month', val:'30'},
		 {name:'3 months', val:'90'},
		 {name:'6 months', val:'180'},
		 {name:'9 months', val:'270'},
		 {name:'1 year', val:'365'}
	];
	
	$scope.validateSubscription = function (selected,interval){
		var reminder = parseInt(selected/interval);
		if(reminder <= 1){
			 $scope.invalidDetails = true;
		}else{
			 $scope.invalidDetails = false;
		}	
				
    };
    $scope.reset = function() {
        $scope.healthDetails = angular.copy($scope.master);
    };
    $scope.isUnchanged = function(healthDetails) {
        return angular.equals(healthDetails, $scope.master);
    };
    $scope.reset();
    var handleUpdateSuccessCall = function (rowdata){
    	if(rowdata.status==1){
			showPopup("<span class='success'>Record Added Successfully.</span>");
			$('#patient_frm')[0].reset();
		}else if(rowdata.status==2){
			showPopup("<span class='danger'>Record Already Added!!.</span>");
		}else{
			showPopup("<span class='danger'>Error Occoured!!</span>");
		}
	}; 
	var handleFailCall = function (rowdata){
		showPopup("Please try after sometime!!");
		//$scope.userDetails  = rowdata.data[0];
	};
    $scope.update = function(healthDetails) {
    	if(Session.userId){
    		healthDetails.docId = Session.userId;
    		for(var key in healthDetails){
    			if(typeof(healthDetails[key])=="object"){
    				healthDetails[key] = healthDetails[key].val;
    			}
    		}
    		$scope.master = angular.copy(healthDetails);
    		console.log(healthDetails);
    		VacService.saveHealthDetails({ 
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
    $scope.healthDetails = {
    		duration: $scope.durations[0]
    };
});
