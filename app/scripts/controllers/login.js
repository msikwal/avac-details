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
.controller('LoginCtrl', function ($scope,VacService,Session,$location,$cookies,StateService,$rootScope) {
	
	$scope.invalidDetails =false;
	var handleSuccessCall = function (rowdata){
		//$scope.userDetails  = rowdata.data[0];
		var userRole;
		var token = new Date().getTime() * rowdata.status * 100;
		if(rowdata.status==1){
			userRole = 'doctor';
			$location.path('/doctor');
		}else if(rowdata.status ==2){
			userRole = 'reguser';
			$location.path('/user');
		}else if(rowdata.status==3){
			userRole = 'admindoc';
			$location.path('/doctor');
		}else{
			$scope.invalidDetails = true;
			showPopup("Invalid Credentials!");
			return false;
		}
		StateService.setUserId($scope.master.mobile_num);
		StateService.setToken(token);
		StateService.setUserRole(userRole);
		Session.create(token,$scope.master.mobile_num,userRole);
		renderMenu(rowdata);
	};
	var renderMenu = function (rowdata){
		var menuArrEle = [];
		if(rowdata.status==1){
			menuArrEle = ['doctor','child','pre-details','health-details','logout'];
		}else if(rowdata.status ==2){
			menuArrEle = ['user','child-vac-details','logout'];
		}else if(rowdata.status==3){
			menuArrEle = ['doctor','child','pre-details','health-details','register','logout'];
		}else{
			menuArrEle = ['login','vacchart'];
		}
		var mainArr = $rootScope.menuArr;
		for (var i = 0; i < mainArr.length; i++) {
		    if($.inArray(mainArr[i].pageLink,menuArrEle) !== -1){
		    	mainArr[i].disFlag = true;
		    }else{
		    	mainArr[i].disFlag = false;
		    }
		}
	};
	var showRightPopoverMenu = function(user){
		if(!user){
			return;
		}
		$('#right-menu-toggle').removeClass('hide');
		var containHtml = '';
		if(user=='doctor'){
			 containHtml = '<div id="popOverBox"><ul>';
	    	 containHtml+= '<li role="presentation"><a tabindex="-1" href="#/dashboard">Dashboard</a></li>';
	    	 containHtml+= '<li role="presentation"><a tabindex="-1" href="#/doctor">My Profile</a></li>';
	    	 containHtml+= '<li role="presentation"><a tabindex="-1" href="#/logout">Logout</a></li>';
	    	 containHtml+= '</ul></div>';
		}else if(user=='reguser'){
			 containHtml = '<div id="popOverBox"><ul>';
	    	 containHtml+= '<li role="presentation"><a tabindex="-1" href="#/dashboard">Dashboard</a></li>';
	    	 containHtml+= '<li role="presentation"><a tabindex="-1" href="#/user">My Profile</a></li>';
	    	 containHtml+= '<li role="presentation"><a tabindex="-1" href="#/logout">Logout</a></li>';
	    	 containHtml+= '</ul></div>';
		}
		$('#right-menu-toggle').popover({
		    placement : 'bottom',
		    html : true,
		    trigger: 'hover',
		    content : function (){
		    	return containHtml;
		    },
		});
	};
	var handleFailCall = function (rowdata){
		showPopup("Please try after sometime!!");
	};
	$scope.master = {};
    $scope.login = function(user) {
      $scope.master = angular.copy(user);
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
    if($cookies.user_mobile){
    	$('#remember').attr('checked',true);
    	$scope.user.mobile_num = $cookies.user_mobile;
    };
    $scope.checkRememberMe = function(){
        if($('#remember').is(":checked")){
        	var user_mobile_no = $("#mobileNum").val();
        	if(user_mobile_no){
        		 $cookies.user_mobile = user_mobile_no;
        	}
        }else{
        	$cookies.user_mobile = "-";
        }
    };
})
.controller('LoginOutCtrl', function ($scope,VacService,Session,$location,$rootScope) {
	Session.destroy();
	var menuArrEle = ['home','knowmore','vacchart','vactiming','whyvac','login'];
	var mainArr = $rootScope.menuArr;
	for (var i = 0; i < mainArr.length; i++) {
	    if($.inArray(mainArr[i].pageLink,menuArrEle) !== -1){
	    	console.log(mainArr[i].pageLink);
	    	mainArr[i].disFlag = true;
	    }else{
	    	mainArr[i].disFlag = false;
	    }
	}
	$location.path('/');
});

