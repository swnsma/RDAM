

var main=function() {

    var modelHome= new AppViewModel('chart_home',values.getProCon,true,'',$(".table-metrics"),$(".graph-container"));
    modelHome.activate();
    ko.applyBindings(modelHome, document.getElementById('body'));
};
manager.add(main);
$(document).ready( function() {
    $('.subMenu').smint({
        'scrollSpeed' : 1000
    });
});