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