

app.config(function ($stateProvider) {
    $stateProvider.state('editor', {
        url: '/editor/:id',
        controller: 'EditorController',
        templateUrl: 'js/editor/editor.html',
        resolve: {
          theProject: function (ProjectFactory, $stateParams, $state) {
            return ProjectFactory.getAllElements($stateParams.id)
            .then(function(res){
              if (!res.length) return $state.go('home'); //redirect if the projectId does not belong to user
              res[0].elements.forEach(function (element) {
                delete element['id'];
              });
              return res[0];
            })
          }
        }
    });
});


app.controller('EditorController', function ($scope, $rootScope, EditorFactory, ProjectFactory, theProject) {
  var modal = document.getElementById('myModal');

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  function display() {  //displaying modal 
    modal.style.display = "block";
  }

  ProjectFactory.getProjects()
  .then(function(projects){
    for(var i =0; i<projects.length; i++){
      if(projects[i].id === theProject.id && projects[i].name === "Untitled Project") display() 
    }   
  })

 $scope.sendRegister = function() {
    ProjectFactory.updateName(theProject.id, $scope.inputTitle)
    .then(function(){
      modal.style.display = "none"
    })
  }
   
    //modal


    $(".button-collapse").sideNav();
    $('.collapsible').collapsible();
    $scope.elements = theProject.elements;
    $scope.projectName = theProject.name;

    var duplicateNavbar = false;
    theProject.elements.forEach(function (element) {
      if (element.type === 'navbar')  duplicateNavbar = true;
    })

    $scope.colors = ['black', 'brown', 'red', 'deep-orange', 'yellow', 'light-green', 'light-blue', 'indigo', 'purple', 'white', 'grey', 'pink', 'orange', 'lime', 'green', 'teal', 'blue', 'deep-purple'];

    $scope.shades = ['darken-4', 'darken-3', 'darken-2', 'original', 'lighten-1', 'lighten-2', 'lighten-3', 'lighten-4', 'lighten-5']


    $scope.addComponent = function (type) {
      if (type==='button') {
        $scope.elements.push({type: type, projectId: theProject.id, color: 'blue', shade: 'original', top: 100, left: 400, width: 200, height: 100});
      }
      else if (type==='logo') {
        $scope.elements.push({type: type, projectId: theProject.id, top: 100, left: 400, width: 100, height: 100});
      }
      else if (type==='navbar' && duplicateNavbar===false) {
        $scope.elements.push({type: type, projectId: theProject.id, color: 'blue', shade: 'original'});
        duplicateNavbar = true;
      }
      else if(type==='navbar' && duplicateNavbar) alert('Navbar already exists!')
      else $scope.elements.push({type: type, projectId: theProject.id, top:100, left: 400, width: 200, height: 150});

      $('.button-collapse').sideNav('hide');
    }

    $scope.addImage = function () {
      $scope.elements.push({type: 'image', url: $scope.image.url, projectId: theProject.id, top: 0, left: 0});
      $('.button-collapse').sideNav('hide');
    }

     $scope.addHeader = function () {
      $scope.elements.push({type: 'header', projectId: theProject.id, top: 0, left: 0});
      $('.button-collapse').sideNav('hide');
    }

    $scope.changeProjectName = function () {
      return ProjectFactory.updateName(theProject.id, $scope.projectName);
    }

    $scope.finished = function () {
      EditorFactory.deleteElements(theProject.id)
      .then(function(){
        $scope.elements.map(element => EditorFactory.createElement(element))
      })
      .then(function(){
      })
    }

    $scope.selectedColor = 'blue';
    $scope.setColor = function (color) {
      $scope.selectedColor = color;
      $rootScope.$broadcast('colorChange', $scope.selectedColor)
    }

    $scope.setShade = function (shade) {
      $scope.selectedShade = shade;
      $rootScope.$broadcast('shadeChange', $scope.selectedShade)
    }

});
