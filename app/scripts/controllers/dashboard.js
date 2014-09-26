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
  .controller('DashboardCtrl', function ($scope,Session) {
	$('#wrapper').removeClass('toggled');
	$scope.userRole = Session.userRole;
});
