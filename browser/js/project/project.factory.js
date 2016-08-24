app.factory('ProjectFactory', function($http) {

  var project = {};

  project.getProjects = function() {
    return $http.get('/api/projects')
    .then(function(res){
      return res.data;
    })
  }

  project.deleteById = function(id){
    return $http.delete('/api/projects/' + id)
    .then(function(res){
      return res.data;
    })
  }

  project.create = function(project){
    return $http.post('/api/projects/create', project)
    .then(function(res){
      return res.data;
    })
  }

  project.getProject = function(id){
    return $http.get('/api/projects/'+ id)
    .then(function(res){
      return res.data;
    })
  }


  project.deleteProject = function(projectId) {
    return $http.delete('/api/projects/' + projectId)
    .then(function(res){
      return res.data;
    })
  }

  project.updateName = function (projectId, name) {
    return $http.put('/api/projects/' + projectId, {name: name})
    .then(function (res) {
      return res.data;
    })
  }



  return project;
})
