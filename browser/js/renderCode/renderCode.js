'use strict';

app.config(function ($compileProvider,$stateProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(|blob|):/);
    $stateProvider.state('exportCode', {
        url: '/exportcode/:id',
        controller: 'RenderCodeCtrl',
        templateUrl: 'js/renderCode/renderCode.html',
        resolve: {
            templateCode: function(ProjectFactory,$stateParams,PageFactory){
                var allTemplates = [];

                function renderCode(element){
                    if (element.type==='button') {
                        return `
        <button class="btn ${element.color} ${element.shade}" style="position: absolute; height: ${element.height}px; width:${element.width}px; top: ${element.top}px; left: ${element.left}px;">button</button>`;
                    } else if (element.type==='textbox') {
                        return `
        <div class="${element.color}-text text-${element.shade}" style="position: absolute; height: ${element.height}px; width:${element.width}px; top: ${element.top}px; left: ${element.left}px;">${element.content}</div>`;
                    } else if (element.type==='div') {
                        return `
        <div style="position: absolute; height: ${element.height}px; width:${element.width}px; top: ${element.top}px; left: ${element.left}px; border: 1px solid black"></div>`;
                    } else if (element.type==='image') {
                        return `
        <img src="${element.url}" style="position: absolute; height: ${element.height}px; width:${element.width}px; top: ${element.top}px; left: ${element.left}px;">`;
                    } else if (element.type==='logo') {
                        return `
        <img src="https://s9.postimg.org/7o47uj1lr/paletro2.png" style="position: absolute; height: ${element.height}px; width:${element.width}px; top: ${element.top}px; left: ${element.left}px;">`;
                    } else if (element.type==='navbar') {
                        return `
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
                        return `
        <div class="${element.color}-text text-${element.shade}" style="position: absolute; height: ${element.height}px; width:${element.width}px; top: ${element.top}px; left: ${element.left}px; font-size: ${element.fontsize}px; line-height: ${element.height}px">${element.content}</div>`
                    }
                }

                var all;
                return ProjectFactory.getProject($stateParams.id)
                .then(function(res){
                    all = res.pages.map(function(page){
                    var template = `<!DOCTYPE html>
<html lang="en">
    <head>
        <base href="/" />
        <title>Page Title Here</title>
        <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/css/materialize.min.css">
        <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/js/materialize.min.js"></script>
    </head>
    <body class="${res.bgcolor} ${res.bgshade}">`;

                        return PageFactory.getAllElements(res.id,page.id)
                        .then(function(elements){
                            elements[0].elements.forEach(function(element){
                                template += renderCode(element);
                            })
                    template+=`
    </body>
</html>`;
                    allTemplates.push(template)
                        })
                    })
                })
                .then(function(){
                    return Promise.all(all)
                    .then(function(){
                        return allTemplates
                    })
                })
            }
        }
    });
});

app.controller('RenderCodeCtrl', function($scope,$stateParams,$window,templateCode,RenderCodeFactory){
    $scope.templates = templateCode
    //generate html file
    // var blob = new Blob([ templateCode[0] ], { type : 'html/HTML' });
    // console.log('123',blob)
    var arr =[];


    for(var i=0; i<templateCode.length; i++){
        var blob = new Blob([ templateCode[i] ], { type : 'html/HTML' });
        var url = $window.URL || $window.webkitURL;
        $scope.url = url.createObjectURL(blob);
        arr.push($scope.url)
    }
    console.log(arr)

    // function callBack(){
    //     $scope.zip = zip;
    // }

    // zip.createWriter(new zip.BlobWriter("application/zip"), function(zipWriter) {
    //     arr.forEach(function(blob){
    //         zipWriter.add('1', new zip.BlobReader(blob), function() {
    //             // close the writer and calls callback function
    //             zipWriter.close(callback);
    //         });
    //     })
    // })


    $scope.download = function(){
        RenderCodeFactory.zip(templateCode)
        .then(function(res){
            console.log('123123',res)
            $scope.urltem = res;
        })

       // addFiles(arr)
    }




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

app.factory('RenderCodeFactory', function($http){
    var RenderCodeFactory = {};

    RenderCodeFactory.zip = function(templateCode){
        return $http.post('/api/projects/zipfile',templateCode)
        .then(function(res){
            console.log('123',res)
            return res.data;
        })
    }
    return RenderCodeFactory;
})
