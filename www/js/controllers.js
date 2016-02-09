'use strict';

angular.module('app.controllers', [])

.controller('registerCtrl', function($rootScope, $scope, $state, $http, registerSrv) {
  $scope.register = function (regInfo) {
    console.log('registeting!');
    registerSrv.registerEmployee(regInfo)
    .then(function (resp) {
      swal('Great!', 'Thank you for joining, please sign in', 'success')
      $state.go('login');
    },function (err) {
      console.log(err);
      swal('Error', 'Error creating account, please try again.', 'error')
    })
  }
})

.controller('loginCtrl', function($rootScope, $scope, $http, $state, loginSvc) {

  $scope.login = function (loginInfo) {
    loginSvc.loginEmployee(loginInfo)
    .then(function (resp) {
      localStorage.setItem('token', resp.data.token);
      localStorage.setItem('user', JSON.stringify(resp.data.user));
      loginInfo.email = '';
      loginInfo.password = '';

      $state.go('menus');
    }, function (err) {
      if(!err.data) return swal('Error Signing In','Please check your connection.', 'warning');
      swal('Error Signing In', err.data.message, 'error');

    })
  }
})

.controller('menuCtrl', function($http, $rootScope, $state, $scope, menuSvc) {
  if(!$rootScope.activeMenuItems){
    $state.go('menus');
  }
  $scope.addToOrder = function (itemId) {
    $scope.order.push(itemId);
  }
  $scope.removeFromOrder = function (itemId) {
    let index = $scope.order.indexOf(itemId);
    $scope.order.splice(index,1);
  }
  let user = JSON.parse(localStorage.getItem('user'));
  $scope.order = [];
  $scope.itemCount = 0;
})

.controller('menuListCtrl', function($http, $rootScope, $state, $scope, menuSvc) {
  let user = JSON.parse(localStorage.getItem('user'));
  menuSvc.allMenus(user.storeCode)
  .then(function (resp) {
    $scope.menus = resp.data;
  },function (err) {
    console.log(err);
  })

  $scope.goToMenu = function (id) {
    menuSvc.oneMenu(id)
    .then(function (resp) {
      $rootScope.activeMenuItems = resp.data.items;
    },function (err) {
      console.log(err);
    })
    $state.go('menu');
  }

  $scope.logout = function() {
    $state.go('login')
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

})

.controller('reviewOrderCtrl', function($scope) {

})
