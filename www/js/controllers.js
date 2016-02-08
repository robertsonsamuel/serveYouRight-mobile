'use strict';

angular.module('app.controllers', [])

.controller('registerCtrl', function($rootScope, $scope) {
  $scope.register = function (regInfo) {
    console.log(regInfo);
  }
})

.controller('loginCtrl', function($rootScope, $scope, $http, loginSvc) {

  $scope.login = function (loginInfo) {
    loginSvc.loginEmployee(loginInfo)
    .then(function (resp) {
      console.log(resp);
    }, function (err) {
      console.log(err);
    })
  }
})

.controller('menuCtrl', function($scope) {

})

.controller('reviewOrderCtrl', function($scope) {

})
