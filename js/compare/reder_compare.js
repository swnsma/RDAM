
ko.bindingHandlers.active_us = {
    update: function(element, valueAccessor) {
        // First get the latest data that we're bound to
        var value = valueAccessor();
        //debugger;
        get_d(value);

    }
};
var rend;


var this_graph=1;
index=0;
var a=0;
length_l=0;
var users_data=[];
var all=[];
var FromDT = [];
var ToDT = [];

var colors=[];
var dayProduction = [];
var dayConsumption = [];

var weekProduction = [];
var weekConsumption = [];

var monthProduction = [];
var monthConsumption = [];

var dayTicks = [];
var weekTicks = [];
var monthTicks = [];
var monthes=['January','February', 'March','April','May','June','July','August','September','October','November','December'];
function get_d(item) {
    all = item;
    users_data=users_data.splice(1,1);
    dayProduction = dayProduction.splice(1,1);
    colors=colors.splice(1,1);
    for(var i =0;i<all.length;i++)
    {
        colors[i]=all[i].color;
    }
    if (length_l = item.length) {
        get_data(all[index].name_table);
    }
}
function day(a,b) {
    var c=+b;
    return a+" "+monthes[c].slice(0,3)+".";
}

function mont(a,b)
{
    var c=+a;
    debugger;
return ""+monthes[c].slice(0,3)+". "+b+"";
}

function render() {

    //   for (var i = 0; i < allData.length; i++) {
    //    FromDT.push(new DateN(getYear(allData[i].FromDT.iso), getMonth(allData[i].FromDT.iso), getDay(allData[i].FromDT.iso)));
    //    ToDT.push(new DateN(getYear(allData[i].ToDT.iso), getMonth(allData[i].ToDT.iso), getDay(allData[i].ToDT.iso)));
    //}

    for (var j = 0; j < users_data.length; j++) {
        var mas1 = [];
        for (var i = 6; i >= 0; i--) {
            mas1.push(users_data[j][i].Reading2);
            dayTicks[i]=day(users_data[0][i].ToDT.iso.slice(8,10),users_data[0][i].ToDT.iso.slice(5,7));
        }
        dayProduction[j] = mas1;
    }
    for (var i = 6; i >= 0; i--) {
        dayTicks[i]=day(users_data[0][i].ToDT.iso.slice(8,10),users_data[0][i].ToDT.iso.slice(5,7));
    }

    for (var j = 0; j < users_data.length; j++) {
        var mas1 = [];
        for (var i = 22; i >= 19; i--) {
            mas1.push(users_data[j][i].Reading2);
            weekTicks[i-19]=day(users_data[0][i].ToDT.iso.slice(8,10),users_data[0][i].ToDT.iso.slice(5,7));
        }
        weekProduction[j] = mas1;
    }
    for (var i = 22; i >= 19; i--) {
        weekTicks[i-19]=day(users_data[0][i].ToDT.iso.slice(8,10),users_data[0][i].ToDT.iso.slice(5,7));
    }

    for (var j = 0; j < users_data.length; j++) {
        var mas1 = [];
        for (var i = 18; i >= 7; i--) {
            mas1.push(users_data[j][i].Reading2);
        }
        monthProduction[j-7] = mas1;
    }
    for (var i = 18; i >= 7; i--) {

        //monthTicks[i-7]=mont(users_data[0][i].ToDT.iso.slice(5,7),users_data[0][i].ToDT.iso.slice(0,4));
    }
    console.log(dayProduction);

    changeGraph(this_graph);
}

function changeGraph(number) {
var ticks=[];
    var mas_dat=[];
    if (number == 1) {
        ticks = dayTicks;
        mas_dat = dayProduction;
    }
    if (number == 2) {
        ticks = weekTicks;
        mas_dat = weekProduction;
    }
    if (number == 3) {
        ticks = monthTicks;
        mas_dat = monthProduction;
    }
        $('#chartDiv').empty();
        this_graph = 1;



        var plot1 = $.jqplot('chartDiv', mas_dat, {
            title: 'Daily production',
            seriesDefaults: {
                renderer: rend,
                rendererOptions: {
                    fillToZero: true
                },
                shadow: false,
                pointLabels: {show: true}
            },

            series: [

            ],

            legend: {
                show: false,
                xoffset: 12,
                yoffset: 12
            },
            axes: {

                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: ticks,
                    tickOptions: {formatString: '%b %#d, %y'},
                    tickInterval: '1 month'
                },

                yaxis: {
                    pad: 1.05,
                    tickOptions: {formatString: '%d'}
                }
            },
            grid: {
                drawGridLines: false,
                gridLineColor: '#cccccc',
                background: '#eee',
                borderColor: '#999999',
                borderWidth: 2.0,
                shadow: false,
                renderer: $.jqplot.CanvasGridRenderer,
                rendererOptions: {}
            },
            seriesColors: colors
        });



}
//
