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
