app.directive('userImage', function () {
    return {
        restrict: 'E',
        scope: {
            image: '='
        },
        templateUrl: 'js/common/directives/user-image/user-image.html',
        link: function(scope,element){
            $(element).draggable();
            angular.element(document).ready(function() {
                 $(element).find('img').resizable();
            });
        }
    };
});