app.directive('userImage', function () {
    return {
        restrict: 'E',
        scope: {
            image: '=',
            index: '=',
            elements: '=',
            dimension: '='
        },
        templateUrl: 'js/components/user-image/user-image.html',
        link: function(scope, elem, attr){
            let elemObj = scope.elements[scope.index];
            scope.initialWidth = elemObj.width;
            scope.initialHeight = elemObj.height;
            scope.initialTop = elemObj.top;
            scope.initialLeft = elemObj.left;

            scope.$on('changeGrid', function(event, dimension) {
                elem.draggable("option", "grid", [dimension,dimension])
            });

            let trashCan = $("#trash-can");
            elem.draggable({
                grid: [scope.dimension, scope.dimension],
                start: function(event, obj) {
                    trashCan.bind("mouseenter", function(){
                        if(confirm('Are you sure you want to delete this '+ elemObj.type+'?')){
                          elemObj.type = 'deleted';
                          scope.$apply();
                        }
                    });
                },
                stop: function(event, obj) {
                    elemObj.top = scope.initialTop + obj.position.top - 64;
                    elemObj.left = scope.initialLeft + obj.position.left;
                    trashCan.unbind("mouseenter");
                }
            });

            elem.find('img').on('load', function(event){
                elem.find('img').resizable({
                    stop: function(event, obj) {
                        elemObj.width = obj.size.width;
                        elemObj.height = obj.size.height;
                    }
                });
            });
        }
    };
});
