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
                    var obj ={};
                    obj.pageName = page.name;
                    obj.template = `<!DOCTYPE html>
<html lang="en">
    <head>
        <base href="/" />
        <title>Page Title Here</title>
        <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/css/materialize.min.css">
        <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/js/materialize.min.js"></script>
    </head>
    <body class="${page.bgcolor} ${page.bgshade}">`;
                        return PageFactory.getAllElements(res.id,page.id)
                        .then(function(elements){
                            elements[0].elements.forEach(function(element){
                                obj.template += renderCode(element);
                            })
                    obj.template+=`
    </body>
</html>`;
                    allTemplates.push(obj)
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

app.controller('RenderCodeCtrl', function($scope,$stateParams,$window,templateCode){
    $scope.templates = templateCode

    $scope.download = function(){
       // RenderCodeFactory.zip(templateCode)
        var zip = new JSZip();
        var count=0;
        templateCode.forEach(function(template){
           zip.file(template.pageName+".html", template.template)
           count ++;
        })
        zip.generateAsync({type:"base64"}).then(function (base64) {
            location.href="data:application/zip;base64," + base64;
        })
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

