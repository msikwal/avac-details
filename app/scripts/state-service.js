'use strict';

angular.module('stateService', [])
    .factory('StateService', function ($window) {
      /*  config variables & cache for Local Storage object */
      var localCache = $window.mstarUtil.loadLocalStorage();
      /*  internal methods of service */
      var refreshFromLocalStorage = function () {
        localCache = $window.mstarUtil.loadLocalStorage();
        return localCache;
      };
      var saveLocalStorage = function () {
        $window.mstarUtil.saveLocalStorage(localCache);
      };
      /*  resets local storage to log out the user */
      var logOut = function () {
        refreshFromLocalStorage();

        delete localCache.login;
        delete localCache.quotes;
        if (localCache.rememberMe === false) {
          localCache.rememberEmail = null;
        }
        saveLocalStorage();
      };
      var getLogin = function (type) {
        refreshFromLocalStorage();

        return localCache.login[type];
      };
      
      var setLogin = function (type, val) {
        var ret = false;
        refreshFromLocalStorage();

        if (typeof val !== 'undefined') {
          localCache.login[type] = val;
          saveLocalStorage();
          ret = true;
        }
        return ret;
      };
      var getUserInfo = function (type) {
          refreshFromLocalStorage();

          return localCache[type];
        };
      var setUserInfo = function (type, val) {
          var ret = false;
          refreshFromLocalStorage();

          if (typeof val !== 'undefined') {
            localCache[type] = val;
            saveLocalStorage();
            ret = true;
          }
          return ret;
        };
      
     
      var getRememberEmail = function () {
        refreshFromLocalStorage();

        return localCache.rememberEmail;
      };
      var getRememberMe = function () {
        refreshFromLocalStorage();

        return localCache.rememberMe;
      };

      /*  The factory returns an object with public properties (for controllers
          to use) that hook to the internal methods of the service */
      return {
        getCustId: function () {
          return getLogin('userId');
        },
        getEmail: function () {
          return getLogin('email');
        },
        getRememberEmail: getRememberEmail,
        getRememberMe: getRememberMe,
        getToken: function () {
          return getLogin('token');
        },
        getUserRole: function () {
            return getLogin('userRole');
        },
        isLoggedIn: function () {
          return (null !== this.getToken());
        },
        logOut: logOut,
        setCountry: function (val) {
          setLogin('country', val);
        },
        setUserRole: function (val) {
            setLogin('userRole', val);
        },
        setUserId: function (val) {
          setLogin('userId', val);
        },
        setEmail: function (val) {
          setLogin('email', val);
        },
        setToken: function (val) {
          setLogin('token', val);
        },
        saveUserInfo: function (val) {
        	setUserInfo('userInfo', val);
        },
        getUserInfo: function () {
            return getUserInfo('userInfo');
        },
      };
    });