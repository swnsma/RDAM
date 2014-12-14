
function changeGraph(ticks,mas_dat,title,rend,colors) {
    $('#chartDiv').empty();
    plot1= $.jqplot('chartDiv', mas_dat, {
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
    });
}