function getData(func) {
    var options = {
        url: 'https://api.parse.com/1/classes/date/',
        type: 'GET',
        contentType: 'application/json',
        beforeSend: function (request) {
            request.setRequestHeader('X-Parse-Application-Id', 'dEruvPYiXg1FAzhn4u47ZP8Yjd7B2Ss6Gqjqi7h3');
            request.setRequestHeader('X-Parse-REST-API-Key', 'a6npew12pgZaQJSTeCtPru3cVGS9VmZzG1op4mK8');
        },
        success: function (response) {
            if (response && response.results && response.results.length) {
                var allData=[];
                for (var i = 0; i < response.results.length; i++) {
                    var a = response.results[i];
                    allData.push(a);
                }
                func(allData);
            }
        },

        error: function () {

        }
    };
    $.ajax(options);
};
var monthes=['January','February', 'March','April','May','June','July','August','September','October','November','December'];

function day(a,b) {
    var c=+b;
    return a+" "+monthes[c-1].slice(0,3)+".";
}

function mont(a)
{
    var c=+a;
    return monthes[c-1].slice(0,3);
}

function click_change()
{
        var a=$(this);
        if(a.hasClass("master"))
        {   rend=$.jqplot.BarRenderer;
            line=0;
            changeGraph(this_graph);


        }
        else
        {   rend=$.jqplot.LineRenderer;
            line=1;
            changeGraph(this_graph);

        }
        a.toggleClass("master");
}

function LoadingManager() {

    this.enable = function() {
        $('#loading').css('display', 'block');
        $('#data').css('display', 'none');
    };

    this.disable = function() {
        $('#loading').css('display', 'none');
        $('#data').css('display', 'block');
    };

    var self = this;

    function ajaxSetting() {
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                self.enable();
            },
            complete: function(xhr, settings) {
                self.disable();
            }
        });
    }

    (function() {
        ajaxSetting();
    })();
}

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
            pad: 1.001,
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
var loading = new LoadingManager();