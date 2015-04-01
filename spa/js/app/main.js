

var main=function() {

    var modelHome= new AppViewModel('chart_home',values.getProCon,true,'',$(".table-metrics"),$(".graph-container"));
    modelHome.activate();
    ko.applyBindings(modelHome);

};
manager.add(main);
$(document).ready( function() {
    $('.subMenu').smint({
        'scrollSpeed' : 1000
    });
});
