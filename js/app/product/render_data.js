
var sum_days=0;
var sum_weeks=0;
var sum_month=0;

var weekProduction = [];
var monthProduction = [];
var dayProduction = [];
var dayTicks =[];
var weekTicks =[];
var monthTicks =[];

var rend;
rend = $.jqplot.BarRenderer;

function render(item) {
    allData = item;
    //console.log(allData);
    for (var i = 6; i >= 0; i--) {
        sum_days += allData[i].Reading2;
        dayProduction.push(allData[i].Reading2);
        dayTicks.push(allData[i].FromDT.iso.slice(0, 10));

    }
    for (var i = 22; i >= 19; i--) {
        sum_weeks += allData[i].Reading2;
        weekProduction.push(allData[i].Reading2);
        weekTicks.push(allData[i].FromDT.iso.slice(8, 10));
    }
    for (var i = 18; i >= 7; i--) {
        sum_month += allData[i].Reading2;
        monthProduction.push(allData[i].Reading2);
        monthTicks.push(allData[i].FromDT.iso.slice(5, 7));
    }

    changeGraph(1);
    $("#co2").html((0.61*sum_days).toFixed(1)+" kg");
}

    function changeGraph(number) {
        var production;

        if (number == 1) {
            production=dayProduction;
        }
        if (number == 2) {
          production=weekProduction;
        }

        if (number == 3) {
          production=monthProduction;
        }
        $('#chartDiv').empty();
        var $plot = $.jqplot('chartDiv', [production], {
            title: 'Daily production',
            axesDefaults: {
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer
            },
            axes: {
                renderer: $.jqplot.CategoryAxisRenderer,
                // options for each axis are specified in seperate option objects.
                xaxis: {
                    label: "Days",
                    pad: 0
                },
                yaxis: {
                    label:"kW",
                    pad: 1.2,
                    tickOptions: {formatString: '%d'}
                }
            },
            //grid: {borderColor: 'transparent', shadow: false},
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
            seriesDefaults: {
                renderer: rend,
                rendererOptions: {fillToZero: true},
                shadow: false,
                pointLabels: {show: true},
                markerOptions: {shadow:false}
            },
            seriesColors: ['green']
        });
}

function Product() {
    getData(render);

    setTimeout(function() {
        changeGraph(1);
    }, 1000);

    var $target = $('.graphContainer');
    var $dayButton = $('<div>');
    var $weekButton = $('<div>');
    var $monthButton = $('<div>');

    button_constr($dayButton, $target, 1,'Days');
    button_constr($weekButton, $target, 2,'Weeks');
    button_constr($monthButton, $target, 3,'Months');

}

$(document).ready(function() {
    new Product();
});