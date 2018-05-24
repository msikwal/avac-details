'use strict';
/*jshint jquery:true */

angular.module('vacService', [])
.config(function ($httpProvider) {
	$httpProvider.responseInterceptors.push('mrnHttpInterceptor');
	var spinnerFunction = function (data) {
		$('.msloader').show();
		return data;
	};
	$httpProvider.defaults.transformRequest.push(spinnerFunction);
})
.factory('mrnHttpInterceptor', function ($q) {
	return function (promise) {
		return promise.then(function (response) {
			$('.msloader').hide();
			return response;

		}, function (response) {
			//When Error....   we need to hide the loader
			$('.msloader').hide();
			return $q.reject(response);
		});
	};
})
/*  makes http requests, checks data of successful requests, passes errors.
      takes name of path to use, callback that returned data should be sent to.
      optionally takes keyname to pass a specific object to the callback,
      parameter to be added to path, token to be included on request header */
.factory('VacService', function ($http) {
	/*  paths of API endpoints to call */
	var httpTimeout = 30000, // 30 seconds
	paths = {
			user: '/vac/json/user.php',
			login: '/vac/json/authUser.php',
			doctor: '/vac/json/doctor.php',
			child: '/vac/json/child.php',
			pregenancy: '/vac/json/pregenancy.php',
			health: '/vac/json/health.php',
			demo: '/vac/json/demo.php'
	},
	isNetworkError = function (statusCode) {
		return (typeof statusCode !== 'number' || statusCode < 200 || statusCode === 402 || statusCode > 404);
	},

	httpGet = function (opt) {
		/*  variables coming from state service */
		var name = opt.name,
		pathTemplate = paths[name],
		//urlPath = replaceInPath(pathTemplate, opt.uriTokens),
		httpOpt = {
				method: 'GET',
				headers: opt.headers || {},
				timeout: httpTimeout,
				url: null
		},
		keyName = opt.keyName,
		parm = opt.parm,
		callback = opt.callback,
		/*  error is instantiated as an empty string so it can be appended, but if nothing is added to it, it will evaluate as falsy */
		error = '',

		/*  for debigging requests
          fail = function (callback, data, status, headers, config) { */
		successCallback = function (data) {
			var checkedData;
			/* if keyname parameter was passed, pass data[keyname] to callback */
			if (typeof keyName === 'string') {
				if(keyName==='Analysis'){
					checkedData = checkStringData(data);
				}else{
					checkedData = checkData(data[keyName]);
				}
				/* otherwise send entire data object to callback */
			} else {
				checkedData = checkData(data);
			}
			callback(checkedData, error);
		},
		/*  Fail takes the callback so an empty array and the error can still be
          sent to it. The empty array is sent to prevent any 'property of
          undefined' errors in the callback all know data about why the call
          failed is logged to the console if the failure has the status 401
          unauthorized, capture the whole request and send it to
          nativeHook.requestToken, so it can be queued and called again once a
          fresh token is set */
		failCallback = function (data, status) {
			if (typeof opt.failCallback === 'function') {
				opt.failCallback([], error);
			}else {
				error += '<p mrn-localize>There was an error communicating with the server.</p>';
				callback([], error);
			}
		},
		checkStringData =function(data){
			if(typeof data === 'string' && data.length > 0){
				return data;
			}else{
				return '<p mrn-localize>No content was found by the server.</p>';
			}
		},
		/*  checks to make sure object/array being passed to the callback actually contains data.
          if it does not, an empty array is passed to the callback to prevent 'property of undefined' errors, 
          also log unusable data responce to the console.*/
		checkData = function (data) {
			var setErr = function () {
				error += '<p mrn-localize>No content was found by the server.</p>';
				/*  for debuging requests
              console.error('GET request successful, but did not contain expected data; details:');
              console.error('data:', data); */
			};
			/*  if data is not JSON (an array or an object), make it an empty array so calls to top level properties won't 
            come up undefined and cause errors the prevent the rest of the script from being interperted */
			if (typeof data === 'string') {
				return data;
			}
			if (data === null || typeof data === 'undefined' || typeof data !== 'object') {
				data = [];
				setErr();
				/*  if the data is an array, but the array is empty, send the data as is, but attach the error */
			} else if (typeof data.length === 'number' && data.length === 0) {
				setErr();
				/*  if the data is an object, and the object does not have any properties, send data is is but attach the error */
			} else if (Object.keys(data).length === 0) {
				setErr();
			}

			return data;
		};

		httpOpt.url = pathTemplate;

		/*  if options object has url parameters, append them to the url */
		if (typeof parm === 'string' && parm !== '') {
			httpOpt.url += parm;
		}

		/*  if options object has a token, override the default token (will happen when callbacks are queued by native hooks )
      if (typeof opt.token === 'string') {
        token = opt.token;
      }

       if there is a token and it is a valid string, attach the token to the request headers
      if (typeof token === 'string') {
        httpOpt.headers['X-Authentication-Token'] = token;
      }*/

		/* make http request and attach success and error callbacks */
		$http(httpOpt).success(successCallback).error(failCallback);

	},
	/*  httpPostOrPut takes options and makes an http post request */
	httpPostOrPut = function (opt) {
		/*  set options for request, set success and fail callbacks */
		var successCallback = opt.successCallback,
		method = opt.method || 'POST',
		contentType = opt.contentType || 'application/x-www-form-urlencoded',
		name = opt.name,
		action = opt.action,
		pathTemplate = paths[name],
		ObjecttoParams  = function (obj) {
			var p = [];
			for (var key in obj) {
				p.push(key + '=' + obj[key]);
			}
			return p.join('&');
		},
		userData = ObjecttoParams(opt.data),
		httpOpt = {
			method : method,
			url: pathTemplate+'?mode='+action,
			data: userData,
			headers: {'Content-Type': contentType}
		},
		defaultFailCallback = function (data, status) {
			successCallback(status);
			return data;
		},

		tokenFailCallback = function (data, status, headers) {
			// for debugging requests
			console.error('status:', status);
			console.error('data:', data);

			/*  handle unexpected responses: timeouts, 4xx other than 401/403, 5xx */
			if (isNetworkError(status)) {
			}

			/*  if the options contain a failure callback, override the default */
			if (typeof opt.failCallback === 'function') {
				opt.failCallback(data, status, headers);
				/*  check if failure is due to token  */
			} else {
				/*  use mstar default failure callback  */
				defaultFailCallback(data, status);
			}
		};

		/*  if options object has a token, override the default token (will happen when callbacks are queued by native hooks )*/
		/*if (typeof opt.token === 'string') {
        token = opt.token;
      }*/

		/* if there is a token and it is a valid string, attach the token to the request headers*/
		/*if (typeof token === 'string') {
        httpOpt.headers['X-Authentication-Token'] = token;
      }*/
		/* make the request */
		var promise = $http(httpOpt);
		if (successCallback) { promise.success(successCallback); }
		if (tokenFailCallback) { promise.error(tokenFailCallback); }
	};

	/*  The facotry returns an object with public properties (for controllers to use) that hook to the internal methods of the service */
	return {
		getUserDetails: function (opt) {
			httpGet({name: 'user', parm: opt.mobile, callback: opt.callback});
		},
		getDocDetails: function (opt) {
			httpGet({name: 'doctor', parm: opt.mobile, callback: opt.callback});
		},
		saveUserDetails: function (opt) {
			httpPostOrPut({name: 'user', successCallback: opt.success, failCallback: opt.fail,action : opt.action,data : opt.data});
		},
		saveChildVacDetails: function (opt) {
			httpPostOrPut({name: 'child', successCallback: opt.success, failCallback: opt.fail,action : opt.action,data : opt.data});
		},
		savePregnancyDetails: function (opt) {
			httpPostOrPut({name: 'pregenancy', successCallback: opt.success, failCallback: opt.fail,action : opt.action,data : opt.data});
		},
		saveHealthDetails: function (opt) {
			httpPostOrPut({name: 'health', successCallback: opt.success, failCallback: opt.fail,action : opt.action,data : opt.data});
		},
		saveDocDetails: function (opt) {
			httpPostOrPut({name: 'doctor', successCallback: opt.success, failCallback: opt.fail,action : opt.action,data : opt.data});
		},
		userLogin: function (opt) {
			httpPostOrPut({name: 'login', successCallback: opt.success, failCallback: opt.fail,action : opt.action,data : opt.data });
		},
		userRegister: function (opt) {
			httpPostOrPut({name: 'login', successCallback: opt.success, failCallback: opt.fail,action : opt.action,data : opt.data });
		},
		getChildVacDetails: function (opt) {
			httpGet({name: 'child', parm: opt.mobile, callback: opt.callback});
		},
		getChildVacChartDetails: function (opt) {
			httpGet({name: 'child', parm: opt.mobile, callback: opt.callback});
		},
		sendDemoMessage: function (opt) {
			httpPostOrPut({name: 'demo', successCallback: opt.success, failCallback: opt.fail,action : opt.action,data : opt.data});
		},
		
	};
}).service('Session', function () {
	this.create = function (sessionId, userId, userRole) {
		this.id = sessionId;
		this.userId = userId;
		this.userRole = userRole;
	};
	this.setCurrentUser = function (obj){
		this.currentUser = obj;
	};
	this.getCurrentUser = function (){
		return this.currentUser;
	};
	this.destroy = function () {
		this.id = null;
		this.userId = null;
		this.userRole = null;
	};
	return this;
}).factory('AuthenticationService', function() {
	var auth = {
			isAuthenticated: false,
			isAdmin: false,
			isUser : false,
			isDoc : false
	};
	return auth;
});

