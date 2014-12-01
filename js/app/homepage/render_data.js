
var options={
    seriesDefault: {
        showMarker:false
    },
    series: [
        {
            rendererOptions: {
                fillToZero: true
            },
            shadow: false,
            label:"consumption",

            markerOptions: {shadow:false
            }
        },
        {

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
};
function button_constr(func,el,p,n,text)
{
    el.appendTo(p)
        .addClass('time1')
        .text(text)
        .click(function () {
            $(this).addClass("is_active");
            $(this).siblings().removeClass("is_active");
            func(n);})
        .mouseenter(function () {
            $(this).addClass("on_button")
        })
        .mouseleave(function () {
            $(this).removeClass("on_button")
        });
}
function click_change(func1,func2)
{
    var a=$(this);
    func1();
    func2();
    a.toggleClass("master");
}
function HomePage() {
    var chart = new Graph();
    chart.set_opt(options);
    getData(function(data) {
        chart.data_to_chart(data);
    });
    var $target = $('.graphContainer');
    var $dayButton = $('<div>');
    var $weekButton = $('<div>');
    var $monthButton = $('<div>');
    button_constr(chart.render_graph,$dayButton, $target, 1,'Days');
    button_constr(chart.render_graph,$weekButton, $target, 2,'Weeks');
    button_constr(chart.render_graph,$monthButton, $target, 3,'Months');
    $('.change_view_homepage').click(click_change(chart.change_view, chart.render_graph));
    $($dayButton).addClass("is_active");
};

$(document).ready(function() {
    new HomePage();
});
