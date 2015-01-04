ko.bindingHandlers.battery = {
    init: function(element, valueAccessor){
        var value=valueAccessor();
        var production=value.consumption;
        var takenFrom=value.takenFrom;

        /*var textBox= $('<div>');
        textBox.addClass('pieChartTextBox');
        textBox.appendTo(element);*/

        var chart = $('<div>');
        chart.appendTo(element);
        chart.attr('id', production);
        var data=[['Consumption',production],['Taken from grid',takenFrom]];
        var plot1 = jQuery.jqplot (chart.attr('id'), [data],
            {
                seriesColors: ["#4BB2C5", "#2d6a76"],

                seriesDefaults: {
                    renderer: jQuery.jqplot.DonutRenderer,
                    rendererOptions: {
                        diameter: 250,
                        showDataLabels: true,
                        startAngle: -90,
                        shadowOffset: 0,
                        shadowDepth: 0,
                        shadowAlpha: 0
                    }
                },
                grid: {
                    drawBorder:false,
                    shadow: false,
                    background: '#fff'
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

        /*var textBox = $('<div>');
        textBox.addClass('pieChartTextBox');
        textBox.appendTo(element);*/

        var chart = $('<div>');
        chart.appendTo(element);
        chart.attr('id', production);
        var data = [
            ['Consumption', production],
            ['Taken from grid', takenFrom]
        ];

        var plot1 = jQuery.jqplot(chart.attr('id'), [data],
            {
                seriesColors: ["#4BB2C5", "#2d6a76"],

                seriesDefaults: {
                    renderer: jQuery.jqplot.DonutRenderer,
                    rendererOptions: {
                        diameter: 250,
                        showDataLabels: true,
                        startAngle: -90,
                        shadowOffset: 0,
                        shadowDepth: 0,
                        shadowAlpha: 0
                    }
                },
                grid: {
                    drawBorder:false,
                    shadow: false,
                    background: '#fff'
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