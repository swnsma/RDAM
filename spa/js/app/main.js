

var main=function() {

    var modelHome= new AppViewModel('chart_home',values.getProCon,true,'',$(".table-metrics"),$(".graph-container"));
    modelHome.activate();
    ko.applyBindings(modelHome, document.getElementById('body'));
    $(window).resize(function(){
        var model = models.getCurrentModel();
        if(model.resize!==undefined) {
            model.resize(!model.resize());
        }
    });
};
manager.add(main);