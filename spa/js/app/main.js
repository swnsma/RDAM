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
var main=function() {
    api.reqest().promise().done(function(response){
        window.app.data = response.data;
    }).fail(function(){
        console.log("something going wrong");
    });
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
