'use strict';
var apiUrl = 'http://localhost:3000';

angular.module('app.services', [])

.service('loginSvc', function($http){
  this.loginEmployee = function (loginData) {
    return $http.post(`${apiUrl}/members/login`,loginData)
  }
})

.service('registerSrv', function(){
  this.registerEmployee = function (loginData) {
    return $http.post(`${apiUrl}/members/register`,loginData)
  }
})
