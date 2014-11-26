function DateN(year, month, day) {
    this.year = year;
    this.month = month;
    this.day = day;
}
var getYear = function (str) {
    var year = str.slice(0, 4);
    return year;
};
var getMonth = function (str) {
    var month = str.slice(5, 7);
    return month;
}
var getDay = function (str) {
    var day = str.slice(8, 10);
    return day;
}
function render(item) {
    var FromDT = [];
    var ToDT = [];
    allData = item;
    var this_graph;
    console.log(allData);
    var weekProduction = [];

    var monthProduction = [];

    //   for (var i = 0; i < allData.length; i++) {
    //    FromDT.push(new DateN(getYear(allData[i].FromDT.iso), getMonth(allData[i].FromDT.iso), getDay(allData[i].FromDT.iso)));
    //    ToDT.push(new DateN(getYear(allData[i].ToDT.iso), getMonth(allData[i].ToDT.iso), getDay(allData[i].ToDT.iso)));
    //}
    var rend;

    rend=$.jqplot.BarRenderer;
    var dayProduction = [];
    var dayTicks =[];
    var weekTicks =[];
    var monthTicks =[];
    for (var i = 6; i >= 0; i--) {

        dayProduction.push(allData[i].Reading2);
        dayTicks.push(allData[i].FromDT.iso.slice(0,10));
    }

    var weekProduction = [];
    for (var i = 22; i >=19; i--) {

        weekProduction.push(allData[i].Reading2);
        weekTicks.push(allData[i].FromDT.iso.slice(8,10));
    }
    var monthProduction = [];
    for (var i = 18; i >= 7; i--) {

        monthProduction.push(allData[i].Reading2);
        monthTicks.push(allData[i].FromDT.iso.slice(5,7));
    }
    debugger;

    changeGraph(1);

    var $target = $('.graphContainer');
    var $dayButton = $('<div>');
    $dayButton.appendTo($target)
        .appendTo($target)
        .addClass('time')
        .addClass("first")
        .text('Days')
        .click(function () {
            $(this).addClass("is_active");
            $(this).siblings().removeClass("is_active");
            changeGraph(1);
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


    function changeGraph(number) {
        if (number == 1) {
            $('#chartDiv').empty();
            var $plot = $.jqplot('chartDiv', [dayProduction], {
                title: 'Daily production',
                axesDefaults: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                },
                axes: {
                    // options for each axis are specified in seperate option objects.
                    xaxis: {
                        label: "Days",
                        pad: 0
                    },
                    yaxis: {
                        pad: 1.2
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
        if (number == 2) {
            $('#chartDiv').empty();
            var $plot1 = $.jqplot('chartDiv', [weekProduction], {
                title: 'Weekly production',
                axesDefaults: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                },
                axes: {
                    // options for each axis are specified in seperate option objects.
                    xaxis: {
                        label: "Weeks",
                        pad: 0
                    },
                    yaxis: {
                        pad: 1.2
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
                    pointLabels: {show: true}
                },
                seriesColors: ['green']
            });
        }

        if (number == 3) {
            $('#chartDiv').empty();
            var $plot1 = $.jqplot('chartDiv', [monthProduction], {
                title: 'Monthly production',
                axesDefaults: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                },
                axes: {
                    // options for each axis are specified in seperate option objects.
                    xaxis: {
                        label: "Weeks",
                        pad: 0
                    },
                    yaxis: {
                        pad: 1.2
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
                    pointLabels: {show: true}
                },
                seriesColors: ['green']
            });

        }


    }
}