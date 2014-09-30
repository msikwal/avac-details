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
var app = angular.module('avacDetailsApp', ['ngRoute','ngAnimate','ngCookies','ngResource','ngRoute','ngSanitize','ngTouch','vacService','formatterService']);


app.constant('AUTH_EVENTS', {
                        	   loginSuccess: 'auth-login-success',
                        	   loginFailed: 'auth-login-failed',
                        	   logoutSuccess: 'auth-logout-success',
                        	   sessionTimeout: 'auth-session-timeout',
                        	   notAuthenticated: 'auth-not-authenticated',
                        	   notAuthorized: 'auth-not-authorized'
                           })
                           .constant('USER_ROLES', {
                        	   all: '*',
                        	   admin: 'admin',
                        	   doctor: 'doctor',
                        	   reguser: 'reguser'
                           })
                           .config(function ($routeProvider) {
                        	   $routeProvider
                        	   .when('/', {
                        		   templateUrl: 'views/user_launch.html',
                        		   controller: 'LoginCtrl'
                        	   })
                        	   .when('/whyvac', {
								    templateUrl: 'views/why_vaccinate.html',
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
                        		   controller: 'DashboardCtrl'
                        	   })
                        	   .when('/child-vac-details', {
                        		   templateUrl: 'views/vac_details.html',
                        		   controller: 'VacDetailsCtrl'
                        	   })
                        	   .otherwise({
                        		   redirectTo: '/'
                        	   });
                           });

app.run(function($rootScope, $location, $window, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    		//console.log(currentRoute,AuthenticationService,nextRoute);
    		$('#wrapper').removeClass('toggled');
    	    if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication && !AuthenticationService.isAuthenticated) {
    	            $location.path("/login");
    	    }else if(nextRoute.templateUrl==='views/doctor.html'){
    	    	$('.sidebar-nav li').eq(0).addClass('hide');
    	    	$('.sidebar-nav li').eq(1).addClass('hide');
    	    	$('.sidebar-nav li').eq(3).addClass('hide');
    	    	$('.sidebar-nav li').eq(2).removeClass('hide');
    	    	$('.sidebar-nav li').eq(6).removeClass('hide');
    	    	$('.sidebar-nav li').eq(7).removeClass('hide');
    	    }else if(nextRoute.templateUrl==='views/user.html'){
    	    	$('.sidebar-nav li').eq(0).addClass('hide');
    	    	$('.sidebar-nav li').eq(1).addClass('hide');
    	    	$('.sidebar-nav li').eq(2).addClass('hide');
    	    	$('.sidebar-nav li').eq(3).removeClass('hide');
    	    	$('.sidebar-nav li').eq(6).removeClass('hide');
    	    	$('.sidebar-nav li').eq(7).removeClass('hide');
    	    }
    });
});
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});
