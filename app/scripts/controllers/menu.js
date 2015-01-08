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
  .controller('MenuCtrl', function ($scope,$rootScope,$location) {
	  $rootScope.menuArr = [
            {
	     	   	'pageName':'Login',
	     	   	'pageLink':'login',
	     	   	'disFlag' : true
    		},
       		{
        	   	'pageName':'Vaccination Chart',
        	   	'pageLink':'vacchart',
        	   	'disFlag' : true
    	    },
    	    {
        	   	'pageName':'Importance of Timing',
        	   	'pageLink':'vactiming',
        	   	'disFlag' : true
    	    },
    	    {
        	   	'pageName':'Why Vaccinate?',
        	   	'pageLink':'whyvac',
        	   	'disFlag' : true
    	    },
    	    {
  	     	   	'pageName':'My Profile',
  	     	   	'pageLink':'doctor',
  	     	   	'disFlag' : false
      		},
      		{
	     	   	'pageName':'Register',
	     	   	'pageLink':'register',
	     	   	'disFlag' : false
    		},
         	{
          	   	'pageName':'Child Vaccination',
          	   	'pageLink':'child',
          	   	'disFlag' : false
      	    },
      	    {
          	   	'pageName':'Pregnancy',
          	   	'pageLink':'pre-details',
          	   	'disFlag' : false
      	    },
      	    {
          	   	'pageName':'Appointments',
          	   	'pageLink':'health-details',
          	   	'disFlag' : false
      	    },
      	    {
  	     	   	'pageName':'My Profile',
  	     	   	'pageLink':'user',
  	     	   	'disFlag' : false
      		},
         		{
          	   	'pageName':'Vaccination Info',
          	   	'pageLink':'child-vac-details',
          	  	'disFlag' : false
      	    },
      	    {
          	   	'pageName':'Logout',
          	   	'pageLink':'logout',
          	   	'disFlag' : false
      	    }
      ];
	  $scope.getClass = function(path) {
		    if ($location.path().substr(0, path.length) == path) {
		      return "active"
		    } else {
		      return ""
		    }
		};
});
