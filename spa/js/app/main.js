

var main=function() {
    function tab(clas,models){
        $(clas).click(function () {
            var that=$(this);
            var id = that.attr('tab');

            if (id == 'score') {
                if (!dataLoaded) {
                    return;
                }
                models.addModel('score', scoreViewModel);
            }

            var currentTab=$('.active-tab');
            var thisTab=$('#'+id);
            that
                .addClass('active-link')
                .siblings()
                .removeClass('active-link');
            currentTab.fadeOut(300);
            currentTab.removeClass('active-tab');
            thisTab.fadeIn(300);
            thisTab.addClass('active-tab');
            models.changeModel(id);
        }).first().click();
    }
    function Models()
    {
        this.models = [];
        this.currentModel=0;
        this.changeModel = function(id){
            var model = this.models[id];
            this.currentModel=model;
            ko.applyBindings(model,document.getElementById(id));
        }
        this.addModel = function(id,model){
            this.models[id]=model;
        };
        this.getCurrentModel = function(){
            return this.currentModel;
        }
    }

    var modelHome= new AppViewModel('chart_home',values.getProCon,true,'',$(".table-metrics"),$(".graph-container"));
    modelHome.activate();
    var modelScore= scoreViewModel;
    var modelWeather = new WeatherModel();
    getUsers(modelScore,analyze);
    var models = new Models();
    models.addModel('home',modelHome);
    //models.addModel('score', scoreViewModel);
    models.addModel('weather-list',modelWeather);
    models.changeModel('home');
    tab(".link",models);
    $(window).resize(function(){
        var model = models.getCurrentModel();
        if(model.resize!==undefined) {
            model.resize(!model.resize());
        }
    });
};
manager.add(main);