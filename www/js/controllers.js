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

.controller('loginCtrl', function($rootScope, $scope, $http, $state, $ionicNavBarDelegate, loginSvc) {
 $ionicNavBarDelegate.showBackButton(false);
 if(typeof localStorage.token === 'undefined'){
   $state.go('login');
 }else if(localStorage.token == null){
     $state.go('login');
 }else{
     $state.go('menus')
 }

  $scope.login = function (loginInfo) {
    $scope.loading = true;
    loginSvc.loginEmployee(loginInfo)
    .then(function (resp) {
      $scope.loading = false;
      localStorage.setItem('token', resp.data.token);
      localStorage.setItem('user', JSON.stringify(resp.data.user));
      $rootScope.user = resp.data.user;
      loginInfo.email = '';
      loginInfo.password = '';

      $state.go('menus');
    }, function (err) {
      if(!err.data) return swal('Error Signing In','Please check your connection.', 'warning');
      $scope.loading = false;
      swal('Error Signing In', err.data.message, 'error');

    })
  }
})

.controller('menuCtrl', function($http, $rootScope, $state, $scope, $ionicNavBarDelegate, menuSvc, orderSvc) {
  $ionicNavBarDelegate.showBackButton(true);
  // if(!$rootScope.activeMenuItems){
  //   $state.go('menus');
  // }


  $scope.addToOrder = function (item) {
      $rootScope.orderTotal = $rootScope.orderTotal + item.itemPrice;
      item.ordered = true;
     $rootScope.order =  orderSvc.setOrder(item);
     $scope.itemCount++;

  }

  $scope.removeFromOrder = function (item) {
    $rootScope.orderTotal = $rootScope.orderTotal - item.itemPrice;
    $rootScope.order = orderSvc.removeItemFromOrder(item)
    $scope.itemCount--;
  }

  let user = JSON.parse(localStorage.getItem('user'));
  $scope.itemCount = 0;
})

.controller('menuListCtrl', function($http, $rootScope, $state, $scope,$ionicNavBarDelegate, menuSvc) {
    $ionicNavBarDelegate.showBackButton(false);
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

.controller('reviewOrderCtrl', function($rootScope, $scope, $ionicNavBarDelegate, $state, orderSvc) {
  $ionicNavBarDelegate.showBackButton(true);
  $rootScope.order = orderSvc.getOrder();
  let orderToSend = [];

  $scope.data = {
    showDelete: false
  };



  $scope.onItemDelete = function(item) {
    $rootScope.order.splice($rootScope.order.indexOf(item), 1);
    $rootScope.orderTotal = $rootScope.orderTotal - item.itemPrice;
  };
  $scope.finishOrder = function() {
    let orderIds = [];
    let user = JSON.parse(localStorage.getItem('user'))._id;
    let storeCode = JSON.parse(localStorage.getItem('user')).storeCode;
    let orderInfo = {};
    orderInfo.employee = user;
    let filtered = $rootScope.order.filter(function(item) {
      if (item.ordered) {
        return true;
      } else {
        return false;
      }
    })

    filtered.map(function (item) {
      orderIds.push(item._id)
    })

    orderInfo.items = orderIds;
    orderInfo.storeCode = storeCode;

    orderSvc.createOrder(orderInfo).then(function (resp) {
      swal('Great!', 'Your order has been sent to the kitchen!', 'success');
      orderSvc.clearOrder();
      $rootScope.order = orderSvc.getOrder();
      $rootScope.orderTotal = 0;
      $state.go('menus')
    },function (err) {
      swal('Error', 'Please try again, there wasn an error creating the order.', 'warning');
    })
  }

})
