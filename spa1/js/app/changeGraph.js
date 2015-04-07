
function changeGraph(id,ticks,mas_dat,title,rend,colors,showlegeng,elementEqualHeight,elementEqualWidth) {
    $('#'+id).empty();
    var height=elementEqualHeight.height();
    var width=elementEqualWidth.width();
    $("#"+id)
        .height(height-30)
        .width(width);
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
                tickOptions: {
                    formatString: '%b %#d, %y',
                    showGridline: false
                },
                tickInterval: '1 month'
            },

            yaxis: {
                label:"kWh",
                pad: 1.05,
                tickOptions: {
                    formatString: '%d'
//                    showGridline: false
                }
            }
        },

        grid: {
            drawGridLines: false,
            gridLineColor: '#cccccc',
            background: 'transparent',
            borderColor: 'transparent',
            borderWidth: 2.0,
            drawBorder: false,
            shadow: false,
            shadowColor: 'transparent',
            renderer: $.jqplot.CanvasGridRenderer,
            rendererOptions: {}
        }
    };
    if(showlegeng){
        option.legend.show=true;
    }

    plot1= $.jqplot(id, mas_dat, option);
}
