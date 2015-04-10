function AppViewModelSelf(){
    var self= this;
    self.haveData = false;
    self.batteries = ko.observableArray([]);
    self.fromGrid = ko.observable('');
    self.fromPanel= ko.observable('');
    self.stringGrid=ko.computed(function(){
        if(self.haveData){
            return self.fromGrid()+' kWh';
        }else{
            return self.fromGrid();
        }
    });
    self.changeTextData= function(newData){
        if(newData[0]===0||newData[1]===0||newData[0]>0&&newData[1]>0){
            self.haveData=true;
        }else{
            self.haveData=false;
        }
        self.fromGrid(newData[0]);
        self.fromPanel(newData[1]);
    };
    self.stringPanel= ko.computed(function(){
        if(self.haveData){
            return self.fromPanel()+' kWh';
        }else{
            return self.fromPanel();
        }
    });
    self.activate = function () {
        var result = [];
        var dayConsumption = Math.round(app.dataApp.data.data.day[0].values[0][2]);
        var dayProduction = Math.round(app.dataApp.data.data.day[0].values[0][1]);
        var d = new Date(app.dataApp.data.data.day[0].values[0][0]);
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        var n = weekday[d.getDay()];
        var dayBattery = new Battery(dayConsumption, dayProduction, n+', '+(app.dataApp.data.data.day[0].values[0][0]), 'day', 'Daily');
        result.push(dayBattery);
        n=app.dataApp.data.data.week[0].values[1][0]+' - '+app.dataApp.data.data.week[0].values[0][0];
        var weekConsumption = Math.round(app.dataApp.data.data.week[0].values[0][2]);
        var weekProduction = Math.round(app.dataApp.data.data.week[0].values[0][1]);
        var weekBattery = new Battery(weekConsumption, weekProduction, n, 'week','Weekly');
        result.push(weekBattery);
        var monthConsumption = Math.round(app.dataApp.data.data.month[0].values[0][2]);
        var monthProduction = Math.round(app.dataApp.data.data.month[0].values[0][1]);
        var monthDate = app.dataApp.data.data.month[0].values[0][0];
        var monthBattery = new Battery(monthConsumption, monthProduction, monthDate, 'month','Monthly');
        result.push(monthBattery);
            self.batteries(result);
    };
}
function Battery(consumption, production, date2, type,label) {

    this.consumption = consumption;
    this.production = production;
    this.date2 = date2;
    this.type=type;
    this.label=label;
    if(production>consumption){
        this.takenFrom=0;
    }
    else {
        this.takenFrom = Math.round(consumption - production);
    }
}