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
angular
.module('avacDetailsApp', [
                           'ngAnimate',
                           'ngCookies',
                           'ngResource',
                           'ngRoute',
                           'ngSanitize',
                           'ngTouch',
                           'vacService'
                           ])
                           .constant('AUTH_EVENTS', {
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
                        		   controller: 'AboutCtrl'
                        	   })
                        	   .when('/doctor', {
                        		   templateUrl: 'views/doctor.html',
                        		   controller: 'DoctorCtrl'
                        	   })
                        	   .when('/register', {
                        		   templateUrl: 'views/register.html',
                        		   controller: 'RegisterCtrl'
                        	   })
                        	   .when('/child', {
                        		   templateUrl: 'views/child_vac.html',
                        		   controller: 'ChildCtrl'
                        	   })
                        	   .when('/vac', {
                        		   templateUrl: 'views/vac_details.html',
                        		   controller: 'VacCtrl'
                        	   })
                        	   .when('/user', {
                        		   templateUrl: 'views/user.html',
                        		   controller: 'UserCtrl'
                        	   })
                        	   .when('/login', {
                        		   templateUrl: 'views/login.html',
                        		   controller: 'LoginCtrl'
                        	   })
                        	   .otherwise({
                        		   redirectTo: '/'
                        	   });
                           });
