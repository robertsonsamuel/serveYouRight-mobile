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

.controller('menuCtrl', function($http, $rootScope, $state, $scope, menuSvc, orderSvc) {
  if(!$rootScope.activeMenuItems){
    $state.go('menus');
  }


  $scope.addToOrder = function (item) {
      $rootScope.orderTotal = $rootScope.orderTotal + item.itemPrice;
      item.ordered = true;
      console.log('item added to order',item);
     $scope.order =  orderSvc.setOrder(item);
     $scope.itemCount++;

  }

  $scope.removeFromOrder = function (item) {
    $rootScope.orderTotal = $rootScope.orderTotal - item.itemPrice;
    $scope.order = orderSvc.removeItemFromOrder(item)
    $scope.itemCount--;
  }

  let user = JSON.parse(localStorage.getItem('user'));
  $scope.itemCount = 0;
})

.controller('menuListCtrl', function($http, $rootScope, $state, $scope, menuSvc) {
  let user = JSON.parse(localStorage.getItem('user'));

  if ($rootScope.orderTotal === 0 || $rootScope.orderTotal === undefined){
    $rootScope.orderTotal = 0
}

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

.controller('reviewOrderCtrl', function($rootScope, $scope, orderSvc) {
  $scope.order = orderSvc.getOrder();
  let orderToSend = [];

  $scope.data = {
    showDelete: false
  };



  $scope.onItemDelete = function(item) {
    $scope.order.splice($scope.order.indexOf(item), 1);
    $rootScope.orderTotal = $rootScope.orderTotal - item.itemPrice;
  };
  $scope.finishOrder = function() {
    let sendMe = $scope.order.filter(function(item) {
      if (item.ordered) {
        return true;
      } else {
        return false;
      }
    })

    console.log(sendMe);
  }

})
