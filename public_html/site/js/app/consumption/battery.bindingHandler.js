ko.bindingHandlers.battery = {
    init: function(element, valueAccessor){
        var value=valueAccessor();
        var production=value.consumption;
        var takenFrom=value.takenFrom;

        var textBox= $('<div>');
        textBox.addClass('pieChartTextBox');
        textBox.appendTo(element);

        var chart = $('<div>');
        chart.appendTo(element);
        chart.attr('id', production);
        var data=[['Consumption',production],['Taken from grid',takenFrom]];
        var plot1 = jQuery.jqplot (chart.attr('id'), [data],
            {
                seriesColors: ["#1EC269", "#F45E4D"],

                seriesDefaults: {
                    renderer: jQuery.jqplot.DonutRenderer,
                    rendererOptions: {
                        diameter: 200,
                        showDataLabels: true,
                        shadowOffset: 0,
                        shadowDepth: 0,
                        shadowAlpha: 0
                    }
                },
                grid: {
                    drawBorder:false,
                    shadow: false
                },
                highlighter: {
                    show: true,
                    sizeAdjust: 7.5
                },
                cursor: {
                    show: false
                }
            });
    },
    update:function(element, valueAccessor) {
        var value = valueAccessor();
        var production = value.consumption;
        var takenFrom = value.takenFrom;

        var textBox = $('<div>');
        textBox.addClass('pieChartTextBox');
        textBox.appendTo(element);

        var chart = $('<div>');
        chart.appendTo(element);
        chart.attr('id', production);
        var data = [
            ['Consumption', production],
            ['Taken from grid', takenFrom]
        ];

        var plot1 = jQuery.jqplot(chart.attr('id'), [data],
            {
                seriesColors: ["#1EC269", "#F45E4D"],

                seriesDefaults: {
                    renderer: jQuery.jqplot.DonutRenderer,
                    rendererOptions: {
                        diameter: 200,
                        showDataLabels: true,
                        shadowOffset: 0,
                        shadowDepth: 0,
                        shadowAlpha: 0
                    }
                },
                grid: {
                    drawBorder:false,
                    shadow: false
                },
                highlighter: {
                    show: true,
                    sizeAdjust: 7.5
                },
                cursor: {
                    show: false
                }
            });
    }
};