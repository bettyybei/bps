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

app.controller('EditorController', function ($scope, $rootScope, EditorFactory, ProjectFactory, theProject, $state) {
  $(".button-collapse").sideNav();
  $('.collapsible').collapsible();
  $scope.elements = theProject.elements;
  $scope.projectName = theProject.name;
  $scope.currentBgColor = theProject.bgcolor;
  $scope.currentBgShade = theProject.bgshade;

  $scope.colors = ['black', 'brown', 'red', 'deep-orange', 'yellow', 'light-green', 'light-blue', 'indigo', 'purple', 'white', 'grey', 'pink', 'orange', 'lime', 'green', 'teal', 'blue', 'deep-purple'];

  $scope.shades = ['darken-4', 'darken-3', 'darken-2', 'original', 'lighten-1', 'lighten-2', 'lighten-3', 'lighten-4', 'lighten-5'];


  //MODAL CODE
  var modal = document.getElementById('myModal');
  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  function displayModal() {  //displaying modal
    modal.style.display = "block";
  }

  ProjectFactory.getProjects()
  .then(function(projects){
    for(var i =0; i<projects.length; i++){
      if(projects[i].id === theProject.id && projects[i].name === "Untitled Project") displayModal();
    }
  })

  $scope.sendProject = function() {
    ProjectFactory.updateName(theProject.id, $scope.inputTitle)
    .then(function(){
      $state.reload()
      modal.style.display = "none";
    })
  }
  //END MODAL CODE


  //GRID CODE
  $scope.dimension = 1

  var hasGrid = false;
  $scope.toggleGrid = function () {
    if (hasGrid) {
      removeGrid()
      $rootScope.$broadcast('changeGrid', 1)
      hasGrid = false;
    }
    else {
      removeGrid()
      createGrid()
      $rootScope.$broadcast('changeGrid', 50);
      hasGrid = true;
    }
  }

  var removeGrid = function(){
    $('.grid').remove();
  }

  var createGrid = function() {
    $scope.dimension = 50;
    var ratioW = Math.floor($(document).width()/50),
        ratioH = Math.floor($(document).height()/50);

    var parent = $('<div />', {
        class: 'grid',
        width: ratioW  * 50,
        height: ratioH  * 50
    }).addClass('grid').appendTo('#canvas');

    for (var i = 0; i < ratioH; i++) {
        for(var p = 0; p < ratioW; p++){
            $('<div />', {
                width: 50 - 1,
                height: 50 - 1
            }).appendTo(parent);
        }
    }
  }
  //END GRID CODE


  //checking if saved project has a navbar already
  $scope.duplicateNavbar = false;
  theProject.elements.forEach(function (element) {
    if (element.type === 'navbar')  $scope.duplicateNavbar = true;
  })


  $scope.addComponent = function (type) {
    if (type==='button') {
      $scope.elements.push({type: type, projectId: theProject.id, color: 'blue', shade: 'original', top: 100, left: 400, width: 200, height: 100});
    }
    else if (type==='logo') {
      $scope.elements.push({type: type, projectId: theProject.id, top: 100, left: 400, width: 100, height: 100});
    }
    else if (type==='navbar' && $scope.duplicateNavbar===false) {
      $scope.elements.push({type: type, projectId: theProject.id, color: 'blue', shade: 'original'});
      $scope.duplicateNavbar = true;
    }
    else if (type==='navbar' && $scope.duplicateNavbar) {
      alert('Navbar already exists!');
    }
    else if (type==='textbox') {
      $scope.elements.push({type: type, projectId: theProject.id, top: 100, left: 400, width: 200, height: 150, content: 'Enter Text Here...'});
    }
    else if (type==='header') {
      $scope.elements.push({type: type, projectId: theProject.id, top: 100, left: 400, width: 275, height: 80, content: 'Header', fontsize:Math.round(80/1.2)});
    }
    else $scope.elements.push({type: type, projectId: theProject.id, top:100, left: 400, width: 200, height: 150});

    $('.button-collapse').sideNav('hide');
  }

  $scope.addImage = function () {
    $scope.elements.push({type: 'image', url: $scope.image.url, projectId: theProject.id, top: 0, left: 0});
    $('.button-collapse').sideNav('hide');
  }

  $scope.changeProjectName = function () {
    ProjectFactory.updateName(theProject.id, $scope.projectName)
    .then(function () {
      Materialize.toast('Success! Your project name is updated.', 4000, 'teal darken-2');
    })
    .catch(function () {
      Materialize.toast('Uh Oh! There was an error.', 4000, 'red darken-3');
    })
  }

  $scope.finished = function () {
    ProjectFactory.updateBgColor(theProject.id, $scope.currentBgColor, $scope.currentBgShade)
    .then(function () {
     return ProjectFactory.deleteAllElements(theProject.id);
    })
    .then(function () {
      $scope.elements= $scope.elements.filter(function(element){
        return element.type!=='deleted';
      })
      $scope.elements.map(element => EditorFactory.createElement(element))
    })
    .then(function () {
      Materialize.toast('Success! Your project is saved!', 4000, 'teal darken-2');
    })
    .catch(function () {
      Materialize.toast('Error. Project could not be saved.', 4000, 'red darken-3');
    })
  }

  //for background color
  $scope.getClasses = function () {
    return `${$scope.currentBgColor} ${$scope.currentBgShade}`;
  }
  $scope.changeBgColor = function () {
    $scope.currentBgColor = $scope.selectedColor;
    $scope.currentBgShade = $scope.selectedShade;
  }


  $scope.selectedColor = 'blue';
  $scope.setColor = function (color) {
    $scope.selectedColor = color;
    $rootScope.$broadcast('colorChange', $scope.selectedColor)
  }

  $scope.selectedShade = 'original'
  $scope.setShade = function (shade) {
    $scope.selectedShade = shade;
    $rootScope.$broadcast('shadeChange', $scope.selectedShade)
  }

});
