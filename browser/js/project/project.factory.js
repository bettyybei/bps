app.factory('ProjectFactory', function($http) { 

  var project = {};


  project.getProjects = function() {
    return $http.get('/api/projects')
    .then(function(res){
    return res.data
    })
  }

  project.deleteById = function(id){
    return $http.delete('/api/projects/' + id)
      .then(function(response){
        return response.data
      })
  }

  project.create = function(elements){
    return $http.post('/api/projects/create', elements)
    .then(function(response){
      return response.data
    })
  }
return project;
})
