
app.config(function($stateProvider){
	$stateProvider.state('register', {
		url:'/register',
		templateUrl: 'js/login/register.html',
		controller: 'RegisterCtrl'
	});
});


app.controller('RegisterCtrl', function($scope, $state, RegisterFactory, ProjectFactory, AuthService) {

    $scope.sendRegister = function(){
        RegisterFactory.create($scope.register)
        .then(function(){
            let obj = {email: $scope.register.email, password: $scope.register.password}

            AuthService.login(obj).then(function(){
                ProjectFactory.getProjects()
                .then(function(projects){
                    $state.go('editor', {id: projects[0].id});
                })
                 
        
            }).catch(function() {
                $scope.error = 'Invalid login credentials!';
            });
        })
        .catch(function(){
            $scope.error = 'Email is invalid or already registered!'
            $scope.register.email = ''
            $scope.register.password = ''
        })
    }

    })