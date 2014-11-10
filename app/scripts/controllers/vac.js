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
	$scope.intervals = [
	                 { name: "15 days", val: "15"},
	                 { name: "30 days", val: "30"},
	                 { name: "45 days", val: "45"}
	];
	//console.log($scope.preDetails);
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
	        var startOfpreg  = moment(moment().subtract(9, 'days').subtract(selected, 'months')._d);
	        //console.log(startOfpreg);
	        var currentDate = moment(moment().format('YYYY-MM-DD').split("-"));
	        var expInDays 	= moment(expectedDate.format('YYYY-MM-DD').split("-"));
	        var remainingDays = expInDays.diff(currentDate, 'days');
	        
	        //var totalDays = expInDays.diff(startOfpreg.format('YYYY-MM-DD').split("-"), 'days');
	        $(".remainingDays").html('');
	        $(".d_expectedMonth").html('');
	        if(remainingDays > 15){
		        $(".d_expectedMonth").html(expectedDate.format('DD-MMM-YYYY'));
		        $scope.preDetails.expectedStartDate = startOfpreg.format('YYYY-MM-DD');
		        $scope.preDetails.expectedDate = expectedDate.format('YYYY-MM-DD');
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
    
    var handleUpdateSuccessCall = function (rowdata){
		if(rowdata.status==1){
			showPopup("<span class='success'>Record Added Successfully.</span>");
			$('#p_frm')[0].reset();
		}else if(rowdata.status==2){
			showPopup("<span class='danger'>Record Already Added!!.</span>");
		}else{
			showPopup("<span class='danger'>Error Occoured!!</span>");
		}
		$scope.p_frm.$setPristine();
	}; 
	
	var handleFailCall = function (rowdata){
		showPopup("Please try after sometime!!");
	};
	
    $scope.update = function(preDetails) {
    	//console.log(preDetails);
    	if(Session.userId){
    		preDetails.docId 	= Session.userId;
    		for(var key in preDetails){
    			if(typeof(preDetails[key])=="object"){
    				preDetails[key] = preDetails[key].val;
    			}
    		}
    		$scope.master 		= angular.copy(preDetails);
    		//console.log(preDetails);
    		VacService.savePregnancyDetails({ 
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
    $scope.preDetails = {
    		interval: $scope.intervals[0]
    };
    
});
