app.config(function ($stateProvider) {
    $stateProvider.state('pages', {
        url: '/project/:id',
        controller: 'PageController',
        templateUrl: 'js/page/page.html',
        resolve: {
        	AllPages: function(PageFactory, $stateParams){
        		return PageFactory.getAllPages($stateParams.id)
        		.then(function(pages){
        			return pages;
        		});
        	},
            projectName: function(ProjectFactory, $stateParams) {
                return ProjectFactory.getProject($stateParams.id)
                .then(function(project) {
                    return project.name;
                })
            }
        }
    });
});

app.controller('PageController', function($scope,AllPages, projectName, $stateParams,PageFactory,$state,ProjectFactory){
    $scope.pages = AllPages;
    $scope.projectName = projectName;

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

    if(projectName === "Untitled Project") displayModal();

    $scope.sendProject = function() {
        ProjectFactory.updateName($stateParams.id, $scope.inputTitle)
        .then(function(){
            $state.reload()
            modal.style.display = "none";
        })
    }
    //END MODAL CODE

    $scope.openProjName = function() {
        displayModal();
    }

    $scope.addPage = function(){
        PageFactory.create($stateParams.id)
        .then(function(page){
          $scope.loadPage(page.id);
        });
    }

    $scope.deletePage = function(id){
        if(confirm('Are you sure you want to delete this page? This cannot be undone.')){
            PageFactory.deletePage($stateParams.id, id)
            .then(function () {
                $state.reload();
            });
        }
    }

    $scope.loadPage = function(input) {
        $state.go('editor', { pageId: input, projectId: $stateParams.id });
    }

    $scope.exportCode = function() {
        $state.go('exportCode', { id: $stateParams.id });
    }

})