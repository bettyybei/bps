
app.directive('header', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/components/header/header.html',
        link: function (scope, elem, attr) {
          let ind = scope.$index;
           scope.initialWidth = scope.$parent.elements[ind].width;
           scope.initialHeight = scope.$parent.elements[ind].height;
           scope.initialTop = scope.$parent.elements[ind].top;
           scope.initialLeft = scope.$parent.elements[ind].left;
           scope.initialFont = scope.$parent.elements[ind].fontsize;
         
         
          elem.draggable({
            stop: function (event, obj) {
              
              scope.$parent.elements[ind].top = scope.initialTop + obj.position.top;
              scope.$parent.elements[ind].left = scope.initialLeft + obj.position.left;
        
          
             }
          });
          angular.element(elem.find('h1')[0]).resizable({
            stop: function (event, obj) {
             
              var header = elem.find('h1');
              var size = elem.css("height");

              (header).css("font-size",size.toString()) //to make it bigger on the screen
              scope.$parent.elements[ind].fontsize = size
              scope.$parent.elements[ind].width = obj.size.width;
              scope.$parent.elements[ind].height = obj.size.height;
             
            }
            });

        }
    };
});


