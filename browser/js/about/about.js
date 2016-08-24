app.config(function ($stateProvider) {

    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });

});

app.controller('AboutController', function ($scope) {
  $(document).ready(function(){
    $('.collapsible').collapsible({
      accordion : false
    });
  });
});