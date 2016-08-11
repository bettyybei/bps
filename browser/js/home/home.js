app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: 'js/home/home.html'
    });
});

app.controller('HomeController', function ($scope) {
    $(".button-collapse").sideNav();
    $('.collapsible').collapsible();

    $scope.elements = [];

    $scope.addNavbar = function () {
      $scope.elements.push({type: 'navbar'});
      $('.button-collapse').sideNav('hide');
    }

    $scope.addLogo = function () {
      $scope.elements.push({type: 'logo'});
      $('.button-collapse').sideNav('hide');
    }

    $scope.addButton = function () {
      $scope.elements.push({type: 'button'});
      $('.button-collapse').sideNav('hide');
    }

    $scope.addDiv = function () {
      $scope.elements.push({type: 'div'});
      $('.button-collapse').sideNav('hide');
    }

    $scope.addImage = function () {
      $scope.elements.push({type: 'image', url: $scope.image.url});
      $('.button-collapse').sideNav('hide');
    }

    $scope.addText = function () {
      $scope.elements.push({type: 'textbox'});
      $('.button-collapse').sideNav('hide');
    }

    $scope.finished = function () {
      var p = document.getElementById("canvas");
      var pClone = p.cloneNode(true);
      console.log(pClone);
      console.log(p.innerHTML);

    }
});
