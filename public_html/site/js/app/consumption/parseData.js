function Battery(consumption, production, date2, type,label) {

    this.consumption = consumption;
    this.production = production;
    this.date2 = date2;
    this.type=type;
    this.label=label;
    if(production>consumption){
        this.takenFrom=0
    }
    else {
        this.takenFrom = Math.round(consumption - production)
    }
};

var parseData = function (someValues, result) {
    var dayConsumption = Math.round(someValues.data.day[0].values[0][2]);
    var dayProduction = Math.round(someValues.data.day[0].values[0][1]);
    var d = new Date(someValues.data.day[0].values[0][0]);
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var n = weekday[d.getDay()];
    var dayBattery = new Battery(dayConsumption, dayProduction, n+', '+(someValues.data.day[0].values[0][0]), 'day', 'Daily');
    result.push(dayBattery);
    n=someValues.data.week[0].values[1][0]+' - '+someValues.data.week[0].values[0][0];
    var weekConsumption = Math.round(someValues.data.week[0].values[0][2]);
    var weekProduction = Math.round(someValues.data.week[0].values[0][1]);
    var weekBattery = new Battery(weekConsumption, weekProduction, n, 'week','Weekly');
    result.push(weekBattery);

    var monthConsumption = Math.round(someValues.data.month[0].values[0][2]);
    var monthProduction = Math.round(someValues.data.month[0].values[0][1]);
    var monthDate = someValues.data.month[0].values[0][0];
    var monthBattery = new Battery(monthConsumption, monthProduction, monthDate, 'month','Monthly');


    result.push(monthBattery);
};