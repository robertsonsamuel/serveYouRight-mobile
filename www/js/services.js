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

.service('orderSvc', function($http){
  let order = [];
  this.createOrder = function (storeCode) {
    return $http.post(`${apiUrl}/menus/storeMenus/${storeCode}`);
  }
  this.setOrder = function (item) {
    order.push(item)
    return order;
  }
  this.removeItemFromOrder = function (item) {
    let index = order.indexOf(item);
    order.splice(index, 1)
    return order;
  }
  this.getOrder = function () {
    return order;
  }

})
