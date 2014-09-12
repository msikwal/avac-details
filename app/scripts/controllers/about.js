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
  .controller('AboutCtrl', function ($scope) {
	$('#wrapper').removeClass('toggled');
	/*$http({method: 'GET', url: '/vac/json/user.php'}).
    success(function(data, status, headers, config) {
    		console.log(data);
    }).
    error(function(data, status, headers, config) {
    		
    });*/
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
