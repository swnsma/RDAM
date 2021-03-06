function removeLoad(){
    setTimeout(function(){
        $("#loadScreen")
            .addClass("hiding");
        setTimeout(function(){
            $("#loadScreen")
                .addClass("no")
        }, 1000);
    },500);
}
function errorMessage(){
    $('#error').css({'display':'block'});
    $('#load').css({'display':'none'});
}
$(document).ready( function() {
        $('.menu').smint({
            'scrollSpeed' : 1000
        });
    window.app.api.getInfoByUser(window.app.HASH).promise().done(function(response){
        if (response) {
            window.app.dataApp.current_user = response.data[0];
        }})
        .done(
        function(){
            return window.app.api.getData(window.app.HASH).promise().done(function(response){
                window.app.dataApp.data = response;
                var selfM = new AppViewModelSelf();
                ko.applyBindings(new AppViewModelAbout(window.app.dataApp.current_user),document.getElementById('home'));
                ko.applyBindings(new AppViewModelData(window.app.dataApp.current_user,'chart_home',$(".table-metrics"),$(".graph-container"),values.getProCon),document.getElementById('data'));
                ko.applyBindings(selfM,document.getElementById('self'));
                ko.applyBindings(new ViewModelScore(),document.getElementById('score'));
                selfM.activate();
            }).done(function(){
                window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,"script","twitter-wjs"));
                removeLoad();
            })
        }
        ).fail(function(){
            errorMessage();
        });
});
$(window).bind('hashchange', function() {
        location.reload();
    });