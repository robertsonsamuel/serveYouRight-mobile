'use strict';
var apiUrl = 'http://localhost:3000';

angular.module('app.services', [])

.service('loginSvc', function($http){
  this.loginEmployee = function (loginData) {
    return $http.post(`${apiUrl}/members/login`,loginData)
  }
})

.service('registerSrv', function($http){
  this.registerEmployee = function (regData) {
    return $http.post(`${apiUrl}/members/register`,regData)
  }
})


.service('menuSvc', function($http){
  this.allMenus = function (storeCode) {
    return $http.get(`${apiUrl}/menus/storeMenus/${storeCode}`);
  }
  this.oneMenu = function (menuId) {
    return $http.get(`${apiUrl}/menus/menu/${menuId}`);
  }
})
