
app.directive('newButton', ['ButtonFactory',function (ButtonFactory) {
    return {
        restrict: 'E',
        scope: {
          index: '=',
          elements: '=',
          dimension: '='
        },
        templateUrl: 'js/components/button/button.html',
        link: function(scope, elem, attr) {
          let elemObj = scope.elements[scope.index];
          scope.initialWidth = elemObj.width;
          scope.initialHeight = elemObj.height;
          scope.initialTop = elemObj.top;
          scope.initialLeft = elemObj.left;
          scope.currentColor = elemObj.color;
          scope.currentShade = elemObj.shade;

          ButtonFactory.getAllPages(scope.$parent.$parent.elements[0].pageId)
            .then(function(allPages){
              scope.pages = allPages;
              angular.element(elem.find('.dropdown-button')[0]).dropdown({
                inDuration: 300,
                outDuration: 225,
                constrain_width: false, // Does not change width of dropdown to that of the activator
                /*hover: true,*/ // Activate on hover
                gutter: 0, // Spacing from edge
                belowOrigin: true, // Displays dropdown below the button
                alignment: 'left', // Displays dropdown with edge aligned to the left of button
                stoppropagation: true
              })
            });


          scope.$on('changeGrid', function(event, dimension){
            elem.draggable("option", "grid", [dimension,dimension])
          })

          let trashCan = $("#trash-can");
          elem.draggable({
            grid: [scope.dimension, scope.dimension],
            start: function(event, obj) {
              trashCan.bind("mouseenter", function(){
                if(confirm('Are you sure you want to delete this '+ elemObj.type+'?')){
                  elemObj.type = 'deleted';
                  scope.$apply();
                }
              })
            },
            stop: function(event, obj) {
              elemObj.top = scope.initialTop + obj.position.top;
              elemObj.left = scope.initialLeft + obj.position.left;
              trashCan.unbind("mouseenter");
            }
          });

          angular.element(elem.find('div')[0]).resizable({
            stop: function(event, obj) {
              elemObj.width = obj.size.width;
              elemObj.height = obj.size.height;
            }
          });



          let isSelected = false;
          scope.toggleSelected = function () {
            isSelected = !isSelected;/*
            if (isSelected) $('.dropdown-button').dropdown('open');
            else $('.dropdown-button').dropdown('close');*/
          }

          let pageSelect = false;

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