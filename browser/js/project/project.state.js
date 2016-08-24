app.config(function ($stateProvider) {
    $stateProvider.state('projects', {
        url: '/projects',
        controller: 'ProjectController',
        templateUrl: 'js/project/projects.html',
        resolve: {
        	AllProjects: function(ProjectFactory){
        		return ProjectFactory.getProjects()
        		.then(function(projects){
        			return projects;
        		});
        	}
        }
    });
});

app.controller('ProjectController', function ($scope, AllProjects, ProjectFactory, $state) {
	$scope.projects = AllProjects;

  $scope.addProject = function(){
    ProjectFactory.create()
    .then(function(project){
      $scope.loadProject(project.id);
    });
  }

	$scope.deleteProject = function(id){
    if(confirm('Are you sure you want to delete this project? This cannot be undone.')){
      ProjectFactory.deleteProject(id)
  		.then(function () {
  			$state.reload();
  		});
    }
	}

  $scope.loadProject = function(input) {
    $state.go('pages', { id: input });
  }

  $scope.exportCode = function(input) {
    $state.go('exportCode', { id: input });
  }
})