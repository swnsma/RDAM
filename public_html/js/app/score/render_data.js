
function changeGraph(ticks,mas_dat,title) {
//    var ticks=[];
//    var mas_dat=[];
//    var title;

    $('#chartDiv').empty();
    plot1= $.jqplot('chartDiv', mas_dat, {
//        seriesColors: [ "#EB0712", "#12C456", "#EAA228", "#579575", "#839557", "#958c12",
//            "#953579", "#4b5de4", "#d8b83f", "#ff5800", "#0085cc"],
        title: title,
        seriesDefaults: {
            renderer:$.jqplot.LineRenderer,
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