app.config(function ($compileProvider,$stateProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
    $stateProvider.state('exportCode', {
        url: '/exportcode/:id',
        controller: 'RenderCodeCtrl',
        templateUrl: 'js/renderCode/renderCode.html',
        resolve: {
            templateCode: function(ProjectFactory,$stateParams){
                var template = '';

                return ProjectFactory.getAllElements($stateParams.id)
                .then(function(res){
                    template += `<!DOCTYPE html>
<html lang="en">
    <head>
        <base href="/" />
        <title>Page Title Here</title>
        <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/css/materialize.min.css">
        <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/js/materialize.min.js"></script>
    </head>
    <body class="${res[0].bgcolor} ${res[0].bgshade}">`;

                    res[0].elements.forEach(function(element){
                        renderCode(element);
                    })
                })
                .then(function(){
                    template+=`
    </body>
</html>`;
                    return template
                })

                function renderCode(element){
                    if (element.type==='button') {
                        template+=`
        <button class="btn ${element.color} ${element.shade}" style="position: absolute; height: ${element.height}px; width:${element.width}px; top: ${element.top}px; left: ${element.left}px;">button</button>`;
                    } else if (element.type==='textbox') {
                        template+=`
        <div class="${element.color}-text text-${element.shade}" style="position: absolute; height: ${element.height}px; width:${element.width}px; top: ${element.top}px; left: ${element.left}px;">${element.content}</div>`;
                    } else if (element.type==='div') {
                        template+=`
        <div style="position: absolute; height: ${element.height}px; width:${element.width}px; top: ${element.top}px; left: ${element.left}px; border: 1px solid black"></div>`;
                    } else if (element.type==='image') {
                        template+=`
        <img src="${element.url}" style="position: absolute; height: ${element.height}px; width:${element.width}px; top: ${element.top}px; left: ${element.left}px;">`;
                    } else if (element.type==='logo') {
                        template+=`
        <img src="https://s9.postimg.org/7o47uj1lr/paletro2.png" style="position: absolute; height: ${element.height}px; width:${element.width}px; top: ${element.top}px; left: ${element.left}px;">`;
                    } else if (element.type==='navbar') {
                        template+=`
        <nav class="${element.color} ${element.shade}">
            <div class="nav-wrapper container">
                <a class="brand-logo">Sample Navbar</a>
                <ul id="nav-mobile" class="right hide-on-med-and-down">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                    <li><a href="#">Login</li></a></li>
                </ul>
            </div>
        </nav>`;
                    } else if(element.type==='header') {
                        template+=`
        <div class="${element.color}-text text-${element.shade}" style="position: absolute; height: ${element.height}px; width:${element.width}px; top: ${element.top}px; left: ${element.left}px; font-size: ${element.fontsize}px; line-height: ${element.height}px">${element.content}</div>`
                    }
                }
            }
        }
    });
});

app.controller('RenderCodeCtrl', function($scope,$stateParams,$window,templateCode){
    $scope.template = templateCode;

    //generate html file
    var blob = new Blob([ templateCode ], { type : 'html/HTML' });
    var url = $window.URL || $window.webkitURL;
    $scope.fileUrl = url.createObjectURL(blob);

    var clipboard;
    (function(){
        clipboard = new Clipboard('#copy-button');
    })();

    clipboard.on('success', function (e) {
        Materialize.toast('Ctrl+C! Now you can paste your code anywhere.', 4000, 'teal darken-2');
    })

    clipboard.on('error', function (e) {
        Materialize.toast("Uh Oh! Copy didn't work. Manual copy is needed.", 4000, 'red darken-3');
    })
})
