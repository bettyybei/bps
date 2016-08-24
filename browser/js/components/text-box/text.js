app.directive('textBox', function () {
    return {
        restrict: 'E',
        scope: {
          index: '=',
          elements: '=',
          dimension: '='
        },
        templateUrl: 'js/components/text-box/text.html',
        link: function (scope, elem, attr) {
          let elemObj = scope.elements[scope.index];
          scope.initialWidth = elemObj.width;
          scope.initialHeight = elemObj.height;
          scope.initialTop = elemObj.top + 64;
          scope.initialLeft = elemObj.left;
          scope.content = elemObj.content;
          scope.currentColor = elemObj.color;
          scope.currentShade = elemObj.shade;

          elem.bind('blur keyup change', function(){
            elemObj.content = elem[0].innerText;
          })

          let textDiv = angular.element(elem.find('div')[0]);

          scope.$on('changeGrid', function(event, dimension){
            textDiv.draggable("option", "grid", [dimension,dimension]);
          })

          let trashCan = $("#trash-can");
          textDiv.draggable({
            grid: [scope.dimension, scope.dimension],
            cancel: 'text',
            start: function(event, obj) {
              trashCan.bind("mouseenter", function(){
                if(confirm('Are you sure you want to delete this '+ elemObj.type+'?')){
                  elemObj.type = 'deleted';
                  scope.$apply();
                }
              });
            },
            stop: function(event, obj) {
              elemObj.top = obj.position.top - 64;
              elemObj.left = obj.position.left;
              trashCan.unbind("mouseenter");
            }
          });

          textDiv.resizable({
            stop: function (event, obj) {
              elemObj.width = obj.size.width;
              elemObj.height = obj.size.height;
            }
          });

          //this prevents the contenteditable bug
          let children = textDiv.children();
          for (var key in children) {
            if (children[key].contentEditable) children[key].contentEditable = false;
          }
          textDiv[0].contentEditable = true;

          scope.focus = function () {
            textDiv.focus();
          }

          let isSelected = false;
          scope.toggleSelected = function(){
            isSelected = !isSelected;
          }

          scope.$on('colorChange', function(event,color){
            if(isSelected) {
              elemObj.color = color;
              scope.currentColor = color;
            }
          })

          scope.$on('shadeChange', function(event,shade){
            if(isSelected) {
              elemObj.shade = shade;
              scope.currentShade = shade;
            }
          })

          scope.getClasses = function () {
            return `absolute ${scope.currentColor}-text text-${scope.currentShade} ${isSelected ? 'selected' : ''}`;
          }
        }
    };
});
