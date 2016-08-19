
app.directive('header', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/components/header/header.html',
        link: function (scope, elem, attr) {
          let ind = scope.$index;
          let elemObj = scope.$parent.elements[ind];
          scope.initialWidth = elemObj.width;
          scope.initialHeight = elemObj.height;
          scope.initialTop = elemObj.top;
          scope.initialLeft = elemObj.left;
          scope.initialFontsize = (elemObj.height/1.2) + 'px';
          scope.initialLineHeight = elemObj.height + 'px';
          scope.content = elemObj.content;
          scope.currentColor = elemObj.color;
          scope.currentShade = elemObj.shade;

          elem.bind('blur keyup change', function(){
            elemObj.content = elem[0].innerText;
          });

          elem.draggable({
            stop: function (event, obj) {
              elemObj.top = scope.initialTop + obj.position.top;
              elemObj.left = scope.initialLeft + obj.position.left;
             }
          });

          let headerDiv = angular.element(elem.find('#my-header')[0]);

          headerDiv.resizable({
            ghost: true,
            stop: function (event, obj) {

              angular.element(elem.find('#my-header')[0]).css({
                'font-size': (Math.round(obj.size.height/1.2)) + 'px',
                'line-height': obj.size.height + 'px'
              })
              elemObj.fontsize = (Math.round(obj.size.height/1.2))
              elemObj.width = obj.size.width;
              elemObj.height = obj.size.height;
            }
          });

          //this prevents the contenteditable bug
          let children = headerDiv.children();
          for (var key in children) {
            if (children[key].contentEditable) children[key].contentEditable = false;
          }
          headerDiv[0].contentEditable = true;

          scope.focus = function () {
            headerDiv.focus();
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


