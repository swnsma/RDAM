
ko.bindingHandlers.active_us = {
    update: function(element, valueAccessor) {
        // First get the latest data that we're bound to
        var value = valueAccessor();
        get_d(value);
    }
};
index=0;
var a=0;
length_l=0;
var users_data=[];
var all=[];
var FromDT = [];
var ToDT = [];


var dayProduction = [];
var dayConsumption = [];

var weekProduction = [];
var weekConsumption = [];

var monthProduction = [];
var monthConsumption = [];




var dayTicks = [];
var weekTicks = [];
var monthTicks = [];
function get_d(item) {
    all = item;
    users_data=users_data.splice(1,1);
    dayProduction = dayProduction.splice(1,1);
    if (length_l = item.length) {
        get_data(all[index].name_table);
    }
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
        }
        dayProduction[j] = mas1;
    }
    console.log(dayProduction);
    //var weekProduction = [];
    //var weekConsumption = [];
    //for (var i = 22; i >=19; i--) {
    //
    //    weekProduction.push(allData[i].Reading2);
    //    weekConsumption.push(allData[i].Reading1);
    //    weekTicks.push(allData[i].FromDT.iso.slice(8,10));
    //}
    //var monthProduction = [];
    //var monthConsumption = [];
    //for (var i = 18; i >= 7; i--) {
    //
    //    monthProduction.push(allData[i].Reading2);
    //    monthConsumption.push(allData[i].Reading1);
    //    monthTicks.push(allData[i].FromDT.iso.slice(5,7));
    //}
    //debugger;
    changeGraph(1);
}

function changeGraph(number) {
    var rend;

    rend = $.jqplot.BarRenderer;
    if (number == 1) {
        $('#chartDiv').empty();
        this_graph = 1;

        var ticks = dayTicks;

        var plot1 = $.jqplot('chartDiv', dayProduction, {
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
                {label: 'consumption'},
                {label: 'production'},
            ],

            legend: {
                show: true,
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
            }
            //seriesColors: ['green', 'red']
        });

    }
}
//    if (number == 2) {
//        $('#chartDiv').empty();
//        this_graph=2;
//
//        var ticks = weekTicks;
//
//        var plot1 = $.jqplot('chartDiv', [weekProduction,weekConsumption], {
//            title: 'Weekly production',
//            seriesDefaults:{
//                renderer:rend,
//                rendererOptions: {fillToZero: true},
//                shadow:false,
//                pointLabels:{show:true}
//            },
//            series:[
//                {label:'consumption'},
//                {label:'production'},
//            ],
//
//            legend: {
//                show: true,
//                xoffset: 12,
//                yoffset: 12
//            },
//            axes: {
//
//                xaxis: {
//                    renderer: $.jqplot.CategoryAxisRenderer,
//                    ticks: ticks
//                },
//                yaxis: {
//                    pad: 1.05,
//                    tickOptions: {formatString: '%d'}
//                }
//            },
//            grid: {
//                drawGridLines: false,
//                gridLineColor: '#cccccc',
//                background: '#eee',
//                borderColor: '#999999',
//                borderWidth: 2.0,
//                shadow: false,
//                renderer: $.jqplot.CanvasGridRenderer,
//                rendererOptions: {}
//            }
//            //seriesColors: ['green', 'red']
//        });
//
//    }
//
//    if (number == 3) {
//        $('#chartDiv').empty();
//        this_graph=3;
//        // Ticks should match up one for each y value (category) in the series.
//        var ticks = monthTicks;
//
//        var plot1 = $.jqplot('chartDiv', [monthProduction, monthConsumption], {
//            // The "seriesDefaults" option is an options object that will
//            // be applied to all series in the chart.
//            title: 'Monthly production',
//            seriesDefaults: {
//                renderer: rend,
//                rendererOptions: {fillToZero: true},
//                shadow: false,
//                pointLabels: {show: true}
//            },
//            // Custom labels for the series are specified with the "label"
//            // option on the series option.  Here a series option object
//            // is specified for each series.
//            series: [
//                {label: 'consumption'},
//                {label: 'production'},
//            ],
//            // Show the legend and put it outside the grid, but inside the
//            // plot container, shrinking the grid to accomodate the legend.
//            // A value of "outside" would not shrink the grid and allow
//            // the legend to overflow the container.
//            legend: {
//                show: true,
//                xoffset: 12,
//                yoffset: 12
//            },
//            axes: {
//                // Use a category axis on the x axis and use our custom ticks.
//                xaxis: {
//                    renderer: $.jqplot.CategoryAxisRenderer,
//                    ticks: ticks
//                },
//                // Pad the y axis just a little so bars can get close to, but
//                // not touch, the grid boundaries.  1.2 is the default padding.
//                yaxis: {
//                    pad: 1.05,
//                    tickOptions: {formatString: '%d'}
//                }
//            },
//            grid: {
//                drawGridLines: false,
//                gridLineColor: '#cccccc',
//                background: '#eee',
//                borderColor: '#999999',
//                borderWidth: 2.0,
//                shadow: false,
//                renderer: $.jqplot.CanvasGridRenderer,
//                rendererOptions: {}
//            }
//            //seriesColors: ['green', 'red']
//        });
//
//    }
//
