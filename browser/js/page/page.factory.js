app.factory('PageFactory', function($http){

	var PageFactory = {};

	PageFactory.getAllPages = function(id){
		return $http.get('/api/project/'+id+'/page')
		.then(function(res){
			return res.data;
		})
	}

	PageFactory.create = function(id, page){
    return $http.post('/api/project/'+id+'/create', page)
    .then(function(res){
      return res.data;
    })
  }

  PageFactory.deletePage = function(projectId, pageId) {
	    return $http.delete('/api/project/'+projectId+'/page/'+pageId)
	}

	PageFactory.deleteAllElements = function(pageId) {
	    return $http.delete('/api/elements/'+pageId)
	}

	PageFactory.getAllElements = function (projectId, pageId) {
	    return $http.get('/api/project/'+projectId+'/page/'+pageId)
	    .then(function(res){
	      return res.data;
	    })
	}

	PageFactory.updateName = function (projectId, pageId, name) {
	    return $http.put('/api/project/'+projectId+'/page/'+pageId, {name: name})
	    .then(function (res) {
	      return res.data;
	    })
	}

	PageFactory.updateBgColor = function (projectId, pageId, color, shade) {
	    return $http.put('/api/project/' + projectId +'/page/' + pageId, {bgcolor: color, bgshade: shade})
	    .then(function (res) {
	      return res.data;
	    })
	}

	return PageFactory;
})