'use strict';
/*jshint jquery:true*/
/**
 * @ngdoc function
 * @name avacDetailsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the avacDetailsApp
 */
angular.module('avacDetailsApp')
  .controller('DashboardCtrl', function ($scope,Session,$location) {
	  if(Session.userRole){
		  	$scope.userRole = Session.userRole;
	  }else{
		  $location.path('/login');
	  }
	
});
