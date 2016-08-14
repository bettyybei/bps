
app.factory('RegisterFactory', function($http){
	var register = {}

	register.create = function(data){
		console.log("HERE")
		return $http.post('/api/users', data)
		.then(function (user){
			return user.data
		})
	}
	return register

})