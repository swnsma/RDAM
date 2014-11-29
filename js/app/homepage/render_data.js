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
seriesDefault: {
    showMarker:false
},
        series: [
            {
        renderer: rend,
            rendererOptions: {
            fillToZero: true
        },
        shadow: false,
            label:"consumption",

        markerOptions: {shadow:false
        }
    },
   {
        renderer: rend,
            rendererOptions: {
            fillToZero: false
        },
        shadow: false,
            label:"production",
        markerOptions: {shadow:false}

    },
            {

                  pointLabels:{
                 show: true
                 }
            }
        ],
        highlighter: {show: true, sizeAdjust: 25,
            tooltipAxes:"y",
            bringSeriesToFront:true
            },
        legend: {
            show: true,
            location: 'ne',     // compass direction, nw, n, ne, e, se, s, sw, w.
            xoffset: 12,        // pixel offset of the legend box from the x (or x2) axis.
            yoffset: 12        // pixel offset of the legend box from the y (or y2) axis.
        },
        axes: {

            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks,
                tickOptions: {formatString: '%b %#d, %y'},
                tickInterval: '1 month',
                pad:1.05
            },

            yaxis: {
                show:false,
                label:"kW",
                pad: 1,
                tickOptions: {formatString: '%d'}
            }
        },
        cursor: {show: true,
            showHorizontalLine:true,
        zoom:true,
        clickReset:true},
        grid: {
            drawGridLines: false,
            gridLineColor: '#fff',
            background: '#eee',
            borderColor: '#eee',
            borderWidth: 1,
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

function HomePage() {
    getData(render);
    var $target = $('.graphContainer');
    var $dayButton = $('<div>');
    var $weekButton = $('<div>');
    var $monthButton = $('<div>');
    button_constr($monthButton, $target, 3);
    button_constr($dayButton, $target, 1);
    button_constr($weekButton, $target, 2);
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
};

manager.add(HomePage);