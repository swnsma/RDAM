/**
 * Created by Таня on 07.04.2015.
 */


$(document).ready( function() {
    var selfM = new AppViewModelSelf();
    ko.applyBindings(new AppViewModelAbout(window.app.dataApp.current_user),document.getElementById('home'));
    ko.applyBindings(new AppViewModelData(window.app.dataApp.current_user,'chart_home',$(".table-metrics"),$(".graph-container"),values.getProCon),document.getElementById('data'));
    ko.applyBindings(selfM,document.getElementById('self'));
    selfM.activate();

});