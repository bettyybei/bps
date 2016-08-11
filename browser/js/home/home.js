app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: 'js/home/home.html'
    });
});

app.controller('HomeController', function ($scope) {
    $(".button-collapse").sideNav();

    $scope.elements = [];

    $scope.addButton = function () {
      $scope.elements.push({type: 'button'});
      $('.button-collapse').sideNav('hide');
    }

    $scope.addLogo = function () {
      $scope.elements.push({type: 'logo'});
      $('.button-collapse').sideNav('hide');
    }

    $scope.addDiv = function () {
      $scope.elements.push({type: 'div'});
      $('.button-collapse').sideNav('hide');
    }

    $scope.addImage = function () {
      $scope.elements.push({type: 'image'});
      $('.button-collapse').sideNav('hide');
    }

    $scope.finished = function () {
      console.log($('#home'));
      var p = document.getElementById("home");
      var pClone = p.cloneNode(true);
    }
});