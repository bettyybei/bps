
app.directive('newButton', ['ButtonFactory',function (ButtonFactory) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/components/button/button.html',
        link: function(scope, elem, attr) {
          let ind = scope.$parent.$index;
          let elemObj = scope.$parent.$parent.elements[ind];
          scope.initialWidth = elemObj.width;
          scope.initialHeight = elemObj.height;
          scope.initialTop = elemObj.top;
          scope.initialLeft = elemObj.left;
          scope.currentColor = elemObj.color;
          scope.currentShade = elemObj.shade;

          

          scope.$on('changeGrid', function(event, dimension){
            elem.draggable("option", "grid", [dimension,dimension])
          })

          elem.draggable({
            grid: [scope.$parent.dimension, scope.$parent.dimension],
            stop: function (event, obj) {
              console.log('stopped dragging button', ind);
              elemObj.top = scope.initialTop + obj.position.top;
              elemObj.left = scope.initialLeft + obj.position.left;
              if(elemObj.top<-45&&elemObj.left>1070){
                if(confirm('Are you sure you want to delete this '+ elemObj.type+'?')) elemObj.type = 'deleted';
              }
              scope.$apply();
            }
          });

          angular.element(elem.find('div')[0]).resizable({
            stop: function(event, obj) {
              console.log('stopped resizing button', scope.$parent.$index);
              elemObj.width = obj.size.width;
              elemObj.height = obj.size.height;
            }
          });

          let isSelected = false;
          scope.toggleSelected = function () {
              isSelected = !isSelected;
          }

          scope.dropDown = function(){

            return ButtonFactory.getAllPages(scope.$parent.$parent.elements[0].pageId)
            .then(function(allPages){
            console.log('allPages',allPages)   
              scope.pages = allPages;
              $('.dropdown-button').dropdown('open');
              // $('.dropdown-button').dropdown({
              //   constrain_width: false, // Does not change width of dropdown to that of the activator
              //   gutter: 0, // Spacing from edge
              //   belowOrigin: false, // Displays dropdown below the button
              //   alignment: 'left' // Displays dropdown with edge aligned to the left of button
              // });

            })
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
            return `dropdown-button btn absolute ${scope.currentColor} ${scope.currentShade} ${isSelected ? 'selected' : ''}`;
          }



          // scope.setHref = function(){
          //   ButtonFactory.getAllPages(scope.$parent.$parent.elements[0].pageId)
          //   .then(function(allPages){
          //     scope.pages = allPages;
          //     $('.dropdown-button').dropdown({
          //       inDuration: 300,
          //       outDuration: 225,
          //       constrain_width: false, // Does not change width of dropdown to that of the activator
          //       hover: true, // Activate on hover
          //       gutter: 0, // Spacing from edge
          //       belowOrigin: false, // Displays dropdown below the button
          //       alignment: 'left' // Displays dropdown with edge aligned to the left of button
          //     });
          //     $('.dropdown-button').dropdown('open');
          //   })
          // }
        }
    };
}]);

app.factory('ButtonFactory', function($http){

  var ButtonFactory = {};

  ButtonFactory.getAllPages = function(id){
    return $http.get('/api/project/'+id+'/page')
    .then(function(res){
      return res.data;
    })
  }
  return ButtonFactory;
  
})