(function(){
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

    ko.bindingHandlers.showGraphProductionConsumption={
        init: function(element, valueAccessor, allBindings, viewModel){
            var masId = [window.app.HASH];
            var rend=$.jqplot.BarRenderer;
            values.getValues(masId,
                function(masid){
                    var dd = values.getDate('day',masId);
                    viewModel.first_loading(true);
                    var product = viewModel.data('day',masId);
                    var sum = 0;
                    for(var i in product[0]){
                        sum+=product[0][i];
                    }
                    viewModel.sumProd(sum.toFixed(1));
                    changeGraph(viewModel.idChart,dd,product,dd[0]+' - '+dd[dd.length-1],rend,['#EAA228','#4BB2C5'],true,viewModel.equalHeightElement,viewModel.equalWidthElement);
                },
                function(e){
                    alert(e);
                },''

            )
        },
        update: function(element, valueAccessor, allBindings, viewModel){
            if(viewModel.first_loading()) {
                var masId = [window.app.HASH];
                viewModel.thisGraph();
                var rend =$.jqplot.BarRenderer;
                var type = 'day';
                if (viewModel.thisGraph() === 1) {
                    type = 'week';
                } else if (viewModel.thisGraph() === 2) {
                    type = 'month';
                }
                var dd = values.getDate(type, masId);
                var product = viewModel.data(type,masId);
                var sum = 0;
                var periodDate;
                if(type=='week'){
                    periodDate = dd[0].slice(0, dd[0].indexOf('-')-1) + ' - ' + dd[dd.length-1].slice(0, dd[dd.length-1].indexOf('-')-1);
                }
                else
                {
                    periodDate=dd[0]+' - '+dd[dd.length-1]
                }
                for(var i in product[0]){
                    sum+=product[0][i];
                }
                viewModel.sumProd(sum.toFixed(1));
                changeGraph(viewModel.idChart,dd,product,periodDate, rend, ['#EAA228','#4BB2C5'],true,viewModel.equalHeightElement,viewModel.equalWidthElement);
            }

        }
    }
})(window.ko);
