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
.controller('VacDetailsCtrl', function ($scope,VacService,Session,$location) {
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
}).controller('DemoCtrl', function ($scope,VacService,Session,$location,$interpolate){
	$scope.reset = function() {
		//$scope.templateMsg = "Hi this is a reminder that you have an appointment on {{today}}. Thanks Dr. {{frist_name}} {{last_name}} from {{hospital_name}}.";
		$scope.templateMsg = "हॅलो सर / मॅडम, हे एक स्मरणपत्र आहे की 27 मे, 2018 रोजी तुम्हाला डॉक्टरांबरोबर भेट आहे.धन्यवाद, Dr.{{frist_name}} {{last_name}}"
		//$scope.templateMsg = "Hello Sir/Madam, this is a reminder you have a appointment with Dr.{{frist_name}} {{last_name}}  on {{today}}. Thanks Dr. {{last_name}} from {{hospital_name}}";
    	$scope.doctor = {
    		text_msg : $scope.templateMsg
    	};
    	$scope.updateMsgTemplate();
    };
    $scope.updateMsgTemplate = function(event){
    	var fName = $scope.doctor.first_name || '........';
    	var lName = $scope.doctor.last_name || '........';

		var tempObj = {
			frist_name : fName,
			last_name : lName || '',
			today : moment().format('DD MMM YYYY'),
			hospital_name : lName + '  Hospital'
		}
		var textMsg =	$scope.templateMsg;
		var message  = $interpolate(textMsg)(tempObj);
		$scope.doctor.text_msg = message;
    };
	var handleSuccessCall = function (rowdata){
		//console.log("rowdata==========",rowdata);
		if(rowdata.status==1){
			showPopup("Message Send Successfully.");
		}else if(rowdata.status==2){
			showPopup("<span class='danger'>Record Already Added!!.</span>");
		}else{
			showPopup("Error Occoured!!");
		}
		$scope.reset();
		$scope.c_frm.$setPristine();
	}; 
	var handleFailCall = function (rowdata){
		showPopup("Please try after sometime!!");
	};

	$scope.sendMsg = function(doctor) {
      if(Session.userId){
    	  doctor.userId = Session.userId;
    	  $scope.master = angular.copy(doctor);

    	  	console.log($scope.master);

    	  VacService.sendDemoMessage({ 
				success: handleSuccessCall,
				fail : handleFailCall,
				action : 'save_tmp_data',
				data : $scope.master,
				method : 'POST'
	  	});
      }else{
    	  $location.path('/login');
      }	  
    };
    

    $scope.isUnchanged = function(doctor) {
      return angular.equals(doctor, $scope.master);
    };
   
    $scope.reset();
});
