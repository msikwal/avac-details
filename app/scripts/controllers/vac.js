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
	var handleSuccessCall = function (rowdata){
		//$scope.userDetails  = rowdata.data[0];
		$scope.vac_details = rowdata.data;
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
			mobile: '?mode=vac&user_id='+Session.getCurrentUser().user_id
		});
	}else{
		$location.path('/login');
	}   

}).controller('VacChartCtrl', function ($scope,VacService){
	VacService.getChildVacChartDetails({
		callback: function (rowdata){
			$scope.vac_chart_details = rowdata.data;
		},
		mobile:'?mode=vacChart'
	});
}).controller('VacPreCtrl', function ($scope,VacService,AuthenticationService,Session,$location){
	$scope.preDetails = {};
	$scope.preDetails['interval'] = {
			"value": "15"
	};
	$scope.months = [
		 {name:'First', val:'1'},
		 {name:'Second', val:'2'},
		 {name:'Third', val:'3'},
		 {name:'Fourth', val:'4'},
		 {name:'Fifth', val:'5'},
		 {name:'Sixth', val:'6'},
		 {name:'Seventh', val:'7'},
		 {name:'Eight', val:'8'},
		 {name:'Nine', val:'9'}
	];
	$scope.displayExpDate = function (selected){
    	var expectedMonth = 9 - parseInt(selected);
    	if(expectedMonth >= 0){
	        var expectedDate  = moment(moment().add(9, 'days').add(expectedMonth, 'months')._d);
	        var currentDate = moment(moment().format('YYYY-MM-DD').split("-"));
	        var expInDays 	= moment(expectedDate.format('YYYY-MM-DD').split("-"));
	        var remainingDays = expInDays.diff(currentDate, 'days');
	        //console.log(expInDays,currentDate,remainingDays);
	        $(".remainingDays").html('');
	        $(".d_expectedMonth").html('');
	        if(remainingDays > 15){
		        $(".d_expectedMonth").html(expectedDate.format('DD-MMM-YYYY'));
		        $(".remainingDays").html(remainingDays);
	        }else{
	        	$(".d_expectedMonth").html("No need of any alert!!");
	        }   
			$(".d_expectedMonth").parent().parent().removeClass('hide');
    	}else{
    		$(".d_expectedMonth").parent().parent().addClass('hide');
    	}	
    };
    $scope.reset = function() {
        $scope.preDetails = angular.copy($scope.master);
    };
    $scope.isUnchanged = function(preDetails) {
        return angular.equals(preDetails, $scope.master);
    };
    $scope.reset();
    $scope.update = function(preDetails) {
    	if(Session.userId){
    		preDetails.docId = Session.userId;
    		$scope.master = angular.copy(preDetails);
    		console.log(preDetails);
    		/*VacService.savePregnancyDetails({ 
    			success: handleUpdateSuccessCall,
    			fail : handleFailCall,
    			action : 'save',
    			data : $scope.master,
    			method : 'POST'
    		});*/
    	}else{
    		//$location.path('/login');
    	}
    };
    /*var handleUpdateSuccessCall = function (rowdata){
		if(rowdata.status==1){
			showPopup("Record Added Successfully.");
		}else{
			showPopup("Error Occoured!!");
		}
		$('#p_frm')[0].reset();
	}; 
	var handleFailCall = function (rowdata){
		//$scope.userDetails  = rowdata.data[0];
	};*/
});
