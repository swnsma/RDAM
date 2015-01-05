ko.bindingHandlers.battery = {
    update:function(element, valueAccessor, allBindings,currentContext,  viewModel) {
        $('#data').css('display', 'block');
        var value = valueAccessor();
        var production = value.production;
        var takenFrom = value.takenFrom;
        var incrementBattery=1;
        var zoom;
        var margin;
        switch (value.type){
            case 'day':
                incrementBattery=1;
                zoom=0.85;
                margin='70px';
                break;
            case 'week':
                incrementBattery=2;
                margin='50px';
                zoom=0.92;
                break;
            case 'month':
                incrementBattery=3;
                zoom=1;
                break;
        }
        $('#battery'+incrementBattery).remove();

        var chart = $('<div>')
            .appendTo(element)
            .attr('id', 'battery'+incrementBattery);
        $(element).parent()
            .on('mouseover', function(){
                viewModel.$root.changeTextData([data[1][1], data[0][1]])})
            .on('mouseleave', function(){
                viewModel.$root.changeTextData(['', ''])});
        $(element).css('zoom',zoom);
        $(element).css('marginTop',margin);
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