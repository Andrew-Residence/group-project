var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial', 'multipleDatePicker']);

/// Routes ///
myApp.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  console.log('myApp -- config')
  $routeProvider
    .when('/home', {
      templateUrl: '/views/templates/login.html',
      controller: 'LoginController as lc',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as lc'
    })
    .when('/admin', {
      templateUrl: '/views/templates/admin.html',
      controller: 'AdminController as ac',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/supervisor', {
      templateUrl: '/views/templates/supervisor.html',
      controller: 'SupervisorController as sc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/staff', {
      templateUrl: '/views/templates/staff.html',
      controller: 'StaffController as sc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .otherwise({
      redirectTo: 'home'
    });
});
