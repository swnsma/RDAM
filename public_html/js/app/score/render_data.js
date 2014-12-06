

var this_graph=1;
index=1;
var a=0;
length_l=0;
var users_data=[];
var rend_mas=[$.jqplot.BarRenderer,$.jqplot.LineRenderer];
var rend=rend_mas[0];
var all=[];
//var FromDT = [];
//var ToDT = [];

var colors=[];
var is_bar=0;
//debugger;
var dayProduction = [];
var dayConsumption = [];

var weekProduction = [];
var weekConsumption = [];

var monthProduction = [];
var monthConsumption = [];

var dayTicks = [];
var weekTicks = [];
var monthTicks = [];

ko.bindingHandlers.active_us = {
    update: function(element, valueAccessor) {
        // First get the latest data that we're bound to
        var value = valueAccessor();
        //debugger;
        get_d(value);
    }
};


get_first();
var line=0;
function get_d(item) {
    all = item;
    users_data=users_data.splice(0,1);
    dayProduction = dayProduction.splice(0,1);
    weekProduction = weekProduction.splice(0,1);
    monthProduction = monthProduction.splice(0,1);
    all_col=[];
    all_col[0]="#63AD1F";
    for(var i =0;i<all.length;i++)
    {
        all_col[i+1]=all[i].color;
    }
    colors=all_col;

    if (length_l = item.length) {
        get_data(all[index-1].name_table);
    }
    else get_first();

}

function render() {

    for (var j = 0; j < users_data.length; j++) {
        var mas1 = [];
        for (var i = 6; i >= 0; i--) {
            mas1.push(users_data[j][i].Reading2);
            dayTicks[i]=day(users_data[0][i].ToDT.iso.slice(8,10),users_data[0][i].ToDT.iso.slice(5,7));
        }
        dayProduction[j] = mas1;
    }
    //debugger;
    for (var i = 6; i >= 0; i--) {
        dayTicks[i]=day(users_data[0][i].ToDT.iso.slice(8,10),users_data[0][i].ToDT.iso.slice(5,7));
    }

    for (var j = 0; j < users_data.length; j++) {
        var mas1 = [];
        for (var i = 22; i >= 19; i--) {
            mas1.push(users_data[j][i].Reading2);
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
        //debugger;
        monthProduction[j] = mas1;
    }
    for (var i = 18; i >= 7; i--) {

        monthTicks[i-7]=mont(users_data[0][i].ToDT.iso.slice(5,7));
    }

    changeGraph(this_graph);
}

function changeGraph(number) {
var ticks=[];
    var mas_dat=[];
    var title;
    if (number == 1) {
        dayTicks.sort(function(a, b) {
            a = new Date(a.replace(/(\d+) (\s+)./, '$2/2000/$1'));
            b = new Date(b.replace(/(\d+) (\s+)./, '$2/2000/$1'));
            return a - b;
        });
        ticks = dayTicks;
        mas_dat = dayProduction;
        title='Daily production';
    }
    if (number == 2) {
        weekTicks.sort(function(a, b) {
            a = new Date(a.replace(/(\d+) (\s+)./, '$2/2000/$1'));
            b = new Date(b.replace(/(\d+) (\s+)./, '$2/2000/$1'));
            return a - b;
        });
        ticks = weekTicks;
        mas_dat = weekProduction;
        title='Weekly production'
    }
    if (number == 3) {
        ticks = monthTicks;
        mas_dat = monthProduction;
        title='Monthly production';

    }
    if(number===3)
    {$('.change_view').css('display','none');
        rend=rend_mas[1];}
    else
    {$('.change_view').css('display','block');
        if(line)
            rend=rend_mas[1];
        else rend=rend_mas[0];
        }

        $('#chartDiv').empty();
        var plot1 = $.jqplot('chartDiv', mas_dat, {
            title: title,
            seriesDefaults: {
                renderer:rend,
                rendererOptions: {
                    fillToZero: true
                },
                shadow: false,
                pointLabels: {show: true},
                markerOptions: {shadow:false}
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
                    label:"kW",
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
