
function removeLoad(){
    setTimeout(function(){
        $("#loadScreen")
            .addClass("hiding")
        setTimeout(function(){
            $("#loadScreen")
                .addClass("no")
        }, 1000);
    },500);
}
var main=function() {

    var modelHome= new AppViewModel('chart_home',values.getProCon,true,'',$(".table-metrics"),$(".graph-container"));
    modelHome.activate();
    ko.applyBindings(modelHome);
    removeLoad();
};
manager.add(main);
$(document).ready( function() {
    $('.subMenu').smint({
        'scrollSpeed' : 1000
    });
});
