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
.controller('VacDetailsCtrl', function ($scope,VacService,AuthenticationService,Session,$location) {
	console.log(Session.userId);
	var handleSuccessCall = function (rowdata){
		//$scope.userDetails  = rowdata.data[0];
		$scope.vac_details = rowdata.data;
		console.log("========",$scope.vac_details);
	};
	$scope.updateShedule = function(id,birthDate,index){
		console.log(id,$scope.vac_details[birthDate][index]);
	};
	$scope.showVacDetails =function (key){
		$(".table-responsive").hide('slow');
		if($(".d_"+key).css('display')==='none'){
			$(".d_"+key).show('slow');
		}	
	};
	if(Session.userId){
		$scope.mobile = Session.userId;
		VacService.getChildVacDetails({
			callback: handleSuccessCall,
			mobile: '?mode=vac&user_id=1'
		});
	}else{
		$location.path('/login');
	}   

}).controller('VacChartCtrl', function ($scope,VacService){
	VacService.getChildVacChartDetails({
		callback: function (rowdata){
			$scope.vac_chart_details = rowdata.data;
			console.log($scope.vac_chart_details);
		},
		mobile: '?mode=vacChart'
	});
});
