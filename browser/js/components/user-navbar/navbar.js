app.directive('userNavbar', ['NavbarFactory',function (NavbarFactory) {
    return {
        restrict: 'E',
          scope: {
            index: '=',
            elements: '='
          },
        templateUrl: 'js/components/user-navbar/navbar.html',
        link: function(scope, elem, attr) {
          let elemObj = scope.elements[scope.index];
          console.log(scope)
          scope.currentColor = elemObj.color;
          scope.currentShade = elemObj.shade;

          let isSelected = false;
          scope.toggleSelected = function() {
            isSelected = !isSelected;
          }

          scope.$on('colorChange', function(event, color){
            if (isSelected) {
              elemObj.color = color;
              scope.currentColor = color;
            }
          });

          scope.$on('shadeChange', function(event, shade){
            if (isSelected) {
              elemObj.shade = shade;
              scope.currentShade = shade;
            }
          });

          scope.getClasses = function () {
            return `${scope.currentColor} ${scope.currentShade} ${isSelected ? 'selected' : ''}`;
          }

          scope.setPage = function() {
           NavbarFactory.getAllPages(elemObj.pageId)
            .then(function(allPages){
              console.log(allPages)
              scope.pages = allPages;
              $('.dropdown-button').dropdown('open');
              angular.element(elem.find('.dropdown-button')[0]).dropdown({
                inDuration: 300,
                outDuration: 225,
                constrain_width: false, // Does not change width of dropdown to that of the activator
                // hover: true, Activate on hover
                gutter: 0, // Spacing from edge
                belowOrigin: true, // Displays dropdown below the button
                alignment: 'left', // Displays dropdown with edge aligned to the left of button
                stoppropagation: true
              })
            });
          }

          scope.delete = function(){
            if(confirm('Are you sure you want to delete the navbar?')) {
              elemObj.type = 'deleted';
              scope.$parent.$parent.duplicateNavbar = false;
            }
          }
        }
    };
}]);

app.factory('NavbarFactory', function($http){

  var NavbarFactory = {};

  NavbarFactory.getAllPages = function(id){

    return $http.get('/api/project/page/'+id +'/getAllPages')
    .then(function(res){
      return res.data;
    })
  }
  return NavbarFactory;

})