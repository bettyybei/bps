app.factory('EditorFactory', function($http){
	var EditorFactory = {};

	EditorFactory.createElement = function(pageId, element){
		return 	$http.post('/api/elements/'+ pageId, element)
		.then(function(res){
			return res.data;
		})
	}

	EditorFactory.getWebpage = function(id){
		return $http.get('/api/elements/'+ id)
		.then(function(res){
			return res.data;
		})
	}

	EditorFactory.update = function(id,element){
		return $http.put('/api/elements/' + id, element)
		.then(function(res){
			return res.data;
		})
	}

	return EditorFactory;
})