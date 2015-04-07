/**
 * Created by Таня on 07.04.2015.
 */


$(document).ready( function() {
    $(document).ready( function() {
        $('.menu').smint({
            'scrollSpeed' : 1000
        });
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
            });
        }
        )
});