
function changeGraph(ticks,mas_dat,title,rend,colors,showlegeng) {
    $('#chartDiv').empty();

    var option={
        seriesColors: colors,
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
            yoffset: 12,
            labels: ['production','consumption']
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks,
                tickOptions: {formatString: '%b %#d, %y'},
                tickInterval: '1 month'
            },

            yaxis: {
                label:"kWh",
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
    }
    if(showlegeng){
        option.legend.show=true;
    }

    plot1= $.jqplot('chartDiv', mas_dat, option);
}

//var options={
//    seriesDefault: {
//
//        showMarker:false
//    },
//    series: [
//        {
//            rendererOptions: {
//                fillToZero: true
//            },
//            shadow: false,
//            label:"consumption",
//
//            markerOptions: {shadow:false
//            }
//        },
//        {
//            rendererOptions: {
//                fillToZero: false
//            },
//            shadow: false,
//            label:"production",
//            markerOptions: {shadow:false}
//
//        }
//    ],
//    highlighter: {show: true, sizeAdjust: 25,
//        tooltipAxes:"y",
//        bringSeriesToFront:true
//    },
//    legend: {
//        show: true,
//        location: 'ne',     // compass direction, nw, n, ne, e, se, s, sw, w.
//        xoffset: 12,        // pixel offset of the legend box from the x (or x2) axis.
//        yoffset: 12        // pixel offset of the legend box from the y (or y2) axis.
//    },
//    axes: {
//
//        xaxis: {
//            renderer: $.jqplot.CategoryAxisRenderer,
//            tickOptions: {formatString: '%b %#d, %y'},
//            tickInterval: '1 month',
//            pad:1.05
//        },
//
//        yaxis: {
//            show:false,
//            label:"kW",
//            pad: 1.001,
//            tickOptions: {formatString: '%d'}
//        }
//    },
//    cursor: {show: true,
//        showHorizontalLine:true,
//        zoom:true,
//        clickReset:true},
//    grid: {
//        drawGridLines: false,
//        gridLineColor: '#fff',
//        background: '#eee',
//        borderColor: '#eee',
//        borderWidth: 1,
//        shadow: false,
//        renderer: $.jqplot.CanvasGridRenderer,
//        rendererOptions: {}
//    }
//    //seriesColors: colors
//};