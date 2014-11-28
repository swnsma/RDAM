

var dayProduction = [];
var dayConsumption = [];

var weekProduction = [];
var weekConsumption = [];

var monthProduction = [];
var monthConsumption = [];
var dayTicks =[];
var weekTicks =[];
var monthTicks =[];

var rend;
rend=$.jqplot.BarRenderer;
var this_graph;


function changeGraph(number) {
    var ticks=[];
    var mas_dat=[];
    var title;
    switch (number)
    {
        case 1:
        dayTicks.sort(function(a, b) {
            a = new Date(a.replace(/(\d+) (\s+)./, '$2/2000/$1'));
            b = new Date(b.replace(/(\d+) (\s+)./, '$2/2000/$1'));
            return a - b;
        });
        ticks = dayTicks;
        mas_dat[0] = dayProduction;
        mas_dat[1] = dayConsumption;
        title='Daily production';
   break;
        case 2:
        weekTicks.sort(function(a, b) {
            a = new Date(a.replace(/(\d+) (\s+)./, '$2/2000/$1'));
            b = new Date(b.replace(/(\d+) (\s+)./, '$2/2000/$1'));
            return a - b;
        });
        ticks = weekTicks;
        mas_dat[0] = weekProduction;
        mas_dat[1] = dayConsumption;
        title='Weekly production';

        break;
        case 3:
        ticks = monthTicks;
        mas_dat[0] = monthProduction;
        mas_dat[1] = dayConsumption;
        title='Monthly production';

            break;
    }
this_graph=number;
    $('#chartDiv').empty();
    var plot1 = $.jqplot('chartDiv', mas_dat, {
        title: title,
        seriesDefaults: {
            renderer: rend,
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
        }
        //seriesColors: colors
    });



}

function render(item) {

    allData = item;
    //console.log(allData);
    for (var i = 6; i >= 0; i--) {
        dayProduction.push(allData[i].Reading2);
        dayConsumption.push(allData[i].Reading1);
        dayTicks.push(allData[i].FromDT.iso.slice(0, 10));

    }
    for (var i = 22; i >= 19; i--) {
        weekProduction.push(allData[i].Reading2);
        weekConsumption.push(allData[i].Reading1);
        weekTicks.push(allData[i].FromDT.iso.slice(8, 10));
    }
    for (var i = 18; i >= 7; i--) {
        monthProduction.push(allData[i].Reading2);
        monthConsumption.push(allData[i].Reading1);
        monthTicks.push(allData[i].FromDT.iso.slice(5, 7));
    }

    changeGraph(1);

}

$(document).ready(function () {
    getData(render);
    var $target = $('.graphContainer');
    var $dayButton = $('<div>');
    $dayButton.appendTo($target)
        .appendTo($target)
        .addClass('time')
        .addClass("first")
        .text('Days')
        .click(function () {
            changeGraph(1);
            $(this).addClass("is_active");
            $(this).siblings().removeClass("is_active");
        })
        .mouseenter(function () { $(this).addClass("on_button") })
        .mouseleave(function () { $(this).removeClass("on_button") })
        .addClass("is_active");
    var $weekButton = $('<div>');
    $weekButton
        .appendTo($target)
        .addClass('time')
        .text('Weeks')
        .click(function () {
            changeGraph(2);
            $(this).addClass("is_active");
            $(this).siblings().removeClass("is_active");
        })
        .mouseenter(function () { $(this).addClass("on_button") })
        .mouseleave(function () { $(this).removeClass("on_button") });
    var $monthButton = $('<div>');
    $monthButton
        .appendTo($target)
        .addClass('time')
        .text('Months')
        .click(function () {
            changeGraph(3);
            $(this).addClass("is_active");
            $(this).siblings().removeClass("is_active");
        })
        .mouseenter(function () { $(this).addClass("on_button") })
        .mouseleave(function () { $(this).removeClass("on_button") });

    $('.change_view')
        .click(function() {
            var a=$(this);
            if(a.hasClass("master"))
            {rend=$.jqplot.BarRenderer;
                changeGraph(this_graph);
            }
            else
            {rend=$.jqplot.LineRenderer;
                changeGraph(this_graph);
            }
            a.toggleClass("master");

        });


});