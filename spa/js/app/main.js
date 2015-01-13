

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
            if (id == 'score') {

                models.addModel('score', scoreViewModel);
            }
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
    //enables click event traking for chart
    $('#chartDiv').bind('jqplotDataClick',
        function (ev, seriesIndex, pointIndex, data) {
            function User(name, production, consumption, achievement){
                this.name = name;
                this.production = production;
                this.consumption = consumption;
                this.achievement = achievement;
            }

            var Users = [];

            var column = pointIndex;
            var scale = appVievM.thisGraph();
            var users = appVievM.return_active_user();
            var ids = [];
            ids.push(current_user.getId());
            var names = [];
            names.push(current_user.getName());
            for (var i=0; i<users.length; i++){
                ids.push(users[i].id());
                names.push(users[i].name());
            }
            var diapason = appVievM.currentRange();
            var v  = values.getDate(appVievM.currentRange(), ids);
            var date = v[pointIndex];

            if (appVievM.currentRange()=='week'){
                var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                var period=' from ';
                var day = parseInt(date);
                var month = date.substring(3,6);
                var year = date.substring(7,11);
                year = parseInt(year);
                switch (month){
                    case 'Jan':
                        month = 0;
                        break;
                    case 'Feb':
                        month = 1;
                        break;
                    case 'Mar':
                        month = 2;
                        break;
                    case 'Apr':
                        month = 3;
                        break;
                    case 'May':
                        month = 4;
                        break;
                    case 'Jun':
                        month = 5;
                        break;
                    case 'Jul':
                        month = 6;
                        break;
                    case 'Aug':
                        month = 7;
                        break;
                    case 'Sep':
                        month = 8;
                        break;
                    case 'Oct':
                        month = 9;
                        break;
                    case 'Nov':
                        month = 10;
                        break;
                    case 'Dec':
                        month = 11;
                        break;
                }
                var JSDate = new Date (year, month, day);

                JSDate.setDate(JSDate.getDate()-7)
                period += JSDate.getDate()+"'th "+months[JSDate.getMonth()]+' '+JSDate.getFullYear();
                period += ' to '+day+"'th "+months[month]+' '+year;
                appVievM.selectedDate('period '+period);
            } else {
                appVievM.selectedDate(date);
            }


            var arrcons = values.getConsumption(appVievM.currentRange(), ids);
            var arrprod = values.getProduction(appVievM.currentRange(), ids);

            appVievM.addInfo([]);

            for (var i=0;i<ids.length;i++){
                var cons = values.getConsumption(appVievM.currentRange(), ids)[i][pointIndex];
                var prod = values.getProduction(appVievM.currentRange(), ids)[i][pointIndex];
                cons = arrcons[i][pointIndex];
                prod = arrprod[i][pointIndex];
                cons = cons.toFixed(1);
                prod = prod.toFixed(1);
                Users.push( new User(names[i],cons, prod,'') );
            }

            //best producer and lowest consumer
            var best = Users[0].production;
            var best_n = 0;
            var lowest = Users[0].consumption;
            var lowest_n = 0;
            for (var i = 1; i<Users.length; i++){
                if (Users[i].production > best){
                    best = Users[i].production;
                    best_n = i;
                }
                if (Users[i].consumption < lowest){
                    lowest = Users[i].consumption;
                    lowest_n = i;
                }
            }
            Users[best_n].achievement = 'Best producer';
            Users[lowest_n].achievement = 'Lowest consumer';
            if(best_n==lowest_n){
                Users[best_n].achievement='Best in the peer group';
            }
            for (var i=0; i<Users.length;i++){
                appVievM.addInfo.push({
                    name: Users[i].name,
                    consumption: Users[i].consumption+' kWh',
                    production: Users[i].production+' kWh',
                    achievement: Users[i].achievement
                });
            }
        }
    );


};
manager.add(main);