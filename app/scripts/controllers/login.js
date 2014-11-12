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
.controller('LoginCtrl', function ($scope,VacService,Session,$location,AuthenticationService,$cookies) {
	//$('#wrapper').removeClass('toggled');
	
	$scope.invalidDetails =false;
	var handleSuccessCall = function (rowdata){
		//$scope.userDetails  = rowdata.data[0];
		var userRole;
		var token = new Date().getTime() * rowdata.status * 100;
		if(rowdata.status==1){
			userRole = 'doctor';
			AuthenticationService.isAuthenticated =true;
			
			$location.path('/doctor');
		}else if(rowdata.status ==2){
			AuthenticationService.isAuthenticated =true;
			userRole = 'reguser';
			$location.path('/user');
		}else{
			$scope.invalidDetails = true;
			showPopup("Invalid Credentials!");
		}
		showRightPopoverMenu(userRole);
		
		Session.create(token,$scope.master.mobile_num,userRole);
	};
	var showRightPopoverMenu = function(user){
		if(!user){
			return;
		}
		var containHtml = '';
		if(user=='doctor'){
			 containHtml = '<div id="popOverBox"><ul>';
	    	 containHtml+= '<li role="presentation"><a tabindex="-1" href="#/dashboard">Dashboad</a></li>';
	    	 containHtml+= '<li role="presentation"><a tabindex="-1" href="#/doctor">My Profile</a></li>';
	    	 containHtml+= '<li role="presentation"><a tabindex="-1" href="#/logout">Logout</a></li>';
	    	 containHtml+= '</ul></div>';
		}else if(user=='reguser'){
			 containHtml = '<div id="popOverBox"><ul>';
	    	 containHtml+= '<li role="presentation"><a tabindex="-1" href="#/dashboard">Dashboad</a></li>';
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
        	$cookies.user_mobile = "";
        }
    };
}).controller('RegisterCtrl', function ($scope,VacService,Session,$location,AuthenticationService) {
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
    
})
.controller('LoginOutCtrl', function ($scope,VacService,Session,$location,AuthenticationService) {
	Session.destroy();
	AuthenticationService.isAuthenticated =false;
	AuthenticationService.isDoc =false;
	$('#right-menu-toggle').popover('destroy');
	$('.sidebar-nav li').removeClass('hide');
	$('.sidebar-nav li').eq(2).addClass('hide');
	$('.sidebar-nav li').eq(3).addClass('hide');
	$('.sidebar-nav li').eq(6).addClass('hide');
	$('.sidebar-nav li').eq(7).addClass('hide');
	$location.path('/');
});

