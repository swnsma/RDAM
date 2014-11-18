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
    var weekConsumption = [];

    var monthProduction = [];
    var monthConsumption = [];

    //   for (var i = 0; i < allData.length; i++) {
    //    FromDT.push(new DateN(getYear(allData[i].FromDT.iso), getMonth(allData[i].FromDT.iso), getDay(allData[i].FromDT.iso)));
    //    ToDT.push(new DateN(getYear(allData[i].ToDT.iso), getMonth(allData[i].ToDT.iso), getDay(allData[i].ToDT.iso)));
    //}
    var rend;

    rend=$.jqplot.BarRenderer;
    var dayProduction = [];
    var dayConsumption = [];
    var dayTicks =[];
    var weekTicks =[];
    var monthTicks =[];
    for (var i = 6; i >= 0; i--) {

        dayProduction.push(allData[i].Reading2);
        dayConsumption.push(allData[i].Reading1);
        dayTicks.push(allData[i].FromDT.iso.slice(0,10));
    }

    var weekProduction = [];
    var weekConsumption = [];
    for (var i = 22; i >=19; i--) {

        weekProduction.push(allData[i].Reading2);
        weekConsumption.push(allData[i].Reading1);
        weekTicks.push(allData[i].FromDT.iso.slice(8,10));
    }
    var monthProduction = [];
    var monthConsumption = [];
    for (var i = 18; i >= 7; i--) {

        monthProduction.push(allData[i].Reading2);
        monthConsumption.push(allData[i].Reading1);
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


    var change_view=$('.change_view')
        .click(function()
        {

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

    function changeGraph(number) {
        if (number == 1) {
            $('#chartDiv').empty();
            this_graph=1;
            // Ticks should match up one for each y value (category) in the series.
            var ticks = dayTicks;

            var plot1 = $.jqplot('chartDiv', [dayProduction,dayConsumption], {
                // The "seriesDefaults" option is an options object that will
                // be applied to all series in the chart.
                seriesDefaults:{
                    renderer:rend,
                    rendererOptions: {fillToZero: true},
                    shadow:false,
                    pointLabels:{show:true}
                },
                // Custom labels for the series are specified with the "label"
                // option on the series option.  Here a series option object
                // is specified for each series.
                series:[
                    {label:'consumption'},
                    {label:'production'},
                ],
                // Show the legend and put it outside the grid, but inside the
                // plot container, shrinking the grid to accomodate the legend.
                // A value of "outside" would not shrink the grid and allow
                // the legend to overflow the container.
                legend: {
                    show: true,
                    placement: 'se'
                },
                axes: {
                    // Use a category axis on the x axis and use our custom ticks.
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer,
                        ticks: ticks,
                        tickOptions:{formatString:'%b %#d, %y'},
                        tickInterval:'1 month'
                    },
                    // Pad the y axis just a little so bars can get close to, but
                    // not touch, the grid boundaries.  1.2 is the default padding.
                    yaxis: {
                        pad: 1.05,
                        tickOptions: {formatString: '%d'}
                    }
                }
                //seriesColors: ['green', 'red']
            });

        }
        if (number == 2) {
            $('#chartDiv').empty();
            this_graph=2;
            // Ticks should match up one for each y value (category) in the series.
            var ticks = weekTicks;

            var plot1 = $.jqplot('chartDiv', [weekProduction,weekConsumption], {
                // The "seriesDefaults" option is an options object that will
                // be applied to all series in the chart.
                seriesDefaults:{
                    renderer:rend,
                    rendererOptions: {fillToZero: true},
                    shadow:false,
                    pointLabels:{show:true}
                },
                // Custom labels for the series are specified with the "label"
                // option on the series option.  Here a series option object
                // is specified for each series.
                series:[
                    {label:'consumption'},
                    {label:'production'},
                ],
                // Show the legend and put it outside the grid, but inside the
                // plot container, shrinking the grid to accomodate the legend.
                // A value of "outside" would not shrink the grid and allow
                // the legend to overflow the container.
                legend: {
                    show: true,
                    placement: 'se'
                },
                axes: {
                    // Use a category axis on the x axis and use our custom ticks.
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer,
                        ticks: ticks
                    },
                    // Pad the y axis just a little so bars can get close to, but
                    // not touch, the grid boundaries.  1.2 is the default padding.
                    yaxis: {
                        pad: 1.05,
                        tickOptions: {formatString: '%d'}
                    }
                }
                //seriesColors: ['green', 'red']
            });

        }

        if (number == 3) {
            $('#chartDiv').empty();
            this_graph=3;
            // Ticks should match up one for each y value (category) in the series.
            var ticks = monthTicks;

            var plot1 = $.jqplot('chartDiv', [monthProduction, monthConsumption], {
                // The "seriesDefaults" option is an options object that will
                // be applied to all series in the chart.
                seriesDefaults: {
                    renderer: rend,
                    rendererOptions: {fillToZero: true},
                    shadow: false,
                    pointLabels: {show: true}
                },
                // Custom labels for the series are specified with the "label"
                // option on the series option.  Here a series option object
                // is specified for each series.
                series: [
                    {label: 'consumption'},
                    {label: 'production'},
                ],
                // Show the legend and put it outside the grid, but inside the
                // plot container, shrinking the grid to accomodate the legend.
                // A value of "outside" would not shrink the grid and allow
                // the legend to overflow the container.
                legend: {
                    show: true,
                    placement: 'se'
                },
                axes: {
                    // Use a category axis on the x axis and use our custom ticks.
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer,
                        ticks: ticks
                    },
                    // Pad the y axis just a little so bars can get close to, but
                    // not touch, the grid boundaries.  1.2 is the default padding.
                    yaxis: {
                        pad: 1.05,
                        tickOptions: {formatString: '%d'}
                    }
                }
                //seriesColors: ['green', 'red']
            });

        }

    }

}