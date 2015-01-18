'use strict';
/*jshint jquery:true*/
/**
 * @ngdoc overview
 * @name avacDetailsApp
 * @description
 * # avacDetailsApp
 *
 * Main module of the application.
 */
var app = angular.module('avacDetailsApp', [
	'ngRoute',
	'ngAnimate',
	'ngCookies',
	'ngResource',
	'ngRoute',
	'ngSanitize',
	'ngTouch',
	'vacService',
	'formatterService',
	'stateService'
	]
);
app.config(function ($routeProvider) {
$routeProvider
	   .when('/', {
		   templateUrl: 'views/home.html',
		   access: { requiredAuthentication: false }
	   })
	   .when('/knowmore', {
		   templateUrl: 'views/knowmore.html',
		   access: { requiredAuthentication: false }
	   })
	   .when('/reasons', {
		    templateUrl: 'views/reasons.html',
		    access: { requiredAuthentication: false }
	   })
	   .when('/whyvac', {
		    templateUrl: 'views/why_vaccinate.html',
		    access: { requiredAuthentication: false }
	   })
	   .when('/vactiming', {
		    templateUrl: 'views/imp_of_timing.html',
		    access: { requiredAuthentication: false }
	   })
	   .when('/vacchart', {
		    templateUrl: 'views/vac_chart.html',
		    controller: 'VacChartCtrl',
		    access: { requiredAuthentication: false }
	   })
	   .when('/doctor', {
		    templateUrl: 'views/doctor.html',
		    controller: 'DoctorCtrl',
		    access: { requiredAuthentication: true }
	   })
	   .when('/register', {
		   templateUrl: 'views/register.html',
		   controller: 'RegisterCtrl'
	   })
	   .when('/child', {
		   templateUrl: 'views/child_vac.html',
		   controller: 'ChildCtrl',
		   access: { requiredAuthentication: true }
	   })
	   .when('/vac', {
		   templateUrl: 'views/vac_details.html',
		   controller: 'VacCtrl',
		   access: { requiredAuthentication: true }
	   })
	   .when('/user', {
		   templateUrl: 'views/user.html',
		   controller: 'UserCtrl',
		   access: { requiredAuthentication: true }
	   })
	   .when('/login', {
		   templateUrl: 'views/login.html',
		   controller: 'LoginCtrl'
	   })
	   .when('/logout', {
		   templateUrl: 'views/login.html',
		   controller: 'LoginOutCtrl'
	   })
	   .when('/dashboard', {
		   templateUrl: 'views/dashboard.html',
		   controller: 'DashboardCtrl',
		   access: { requiredAuthentication: true }
	   })
	   .when('/child-vac-details', {
		   templateUrl: 'views/vac_details.html',
		   controller: 'VacDetailsCtrl'
	   })
	   .when('/pre-details', {
		   templateUrl: 'views/pregnancy.html',
		   controller: 'VacPreCtrl',
		   access: { requiredAuthentication: true }
	   })
	   .when('/health-details', {
		   templateUrl: 'views/healthcheckup.html',
		   controller: 'VacHealthCtrl',
		   access: { requiredAuthentication: true }
	   })
	   .otherwise({
		   redirectTo: '/'
		   });
	   });

app.run(function($rootScope, $location, $window) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    		if($('#sidebar-wrapper').css('display')==='block'){
    			$("#sidebar-wrapper").animate({"left":"0px"}, "fast").hide('slow');
    		}	
    	    if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication && !window.mstarUtil.isSignedIn) {
    	            $location.path("/login");
    	    }
    });
});
$(".mymenu").click(function(e) {
    e.preventDefault();
    leftMenuHandler();
});
function leftMenuHandler(){
	if($('#sidebar-wrapper').css('display')==='block'){
		$("#sidebar-wrapper").animate({"left":"0px"}, "fast").hide('slow');
	}else{
		$("#sidebar-wrapper").animate({"left":"250px"}, "fast").show();
	}
}
function showPopup(msg){
	$(".modal-body").html(msg);
	$(".al-modal-sm").modal('show');
}
function isObject(obj) {
    return obj === Object(obj);
};
$( document ).ready(function() {
	setHeightOfsideBar();
});
function setHeightOfsideBar(){
	var tableHeight	= window.innerHeight - 100;
	$("#sidebar-wrapper").css({"min-height": tableHeight });
}
(function () {
window.mstarUtil = {
	    /* session state and premium state access info */
	    isSignedIn: function () {
	      var storage = this.loadLocalStorage();
	      var token = storage.login.token;
	      var signedIn = (typeof token === 'string' && token.length > 0);
	      return signedIn;
	    },

	    /*  loadLocalStorage returns information needed to persist across the app
	     if any of the top-level properties are not found in local storage, the function will
	     instantiate them to a default value */
	    loadLocalStorage: function () {
	      var appStorage = localStorage.getItem('alertme-app');

	      /*  if local storage obj exists, and is valid JSON, parse string into an object
	       try/catch is used since JSON.parse will throw an error if string is not valid JSON */
	      if (appStorage) {
	        try {
	          appStorage = JSON.parse(appStorage);

	          /*  else make a new object */
	        } catch (e) {
	          appStorage = {};
	        }
	      } else {
	        appStorage = {};
	      }

	      if (typeof appStorage.login !== 'object') {
	        appStorage.login = {
	          country: null,
	          userId: null,
	          email: null,
	          locale: 'en-US',
	          isPremium: false,
	          userRole: null,
	          token: null
	        };
	      }
	      if (typeof appStorage.rememberMe !== 'boolean') {
	        appStorage.rememberMe = true;
	      }
	      if (typeof appStorage.rememberEmail !== 'string') {
	        appStorage.rememberEmail = null;
	      }

	      return appStorage;
	    },
	    /*  saveLocalStorage takes an object, turns it into a JSON string, then saves it in local storage */
	    saveLocalStorage: function (storageObj) {
	      var objString = JSON.stringify(storageObj),
	          ret = false;

	      if (isObject(storageObj)) {
	        localStorage.setItem('alertme-app', objString);
	        ret = true;
	      }

	      return ret;
	    }
	  };

})();

