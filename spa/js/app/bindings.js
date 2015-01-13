//amount of kW
ko.bindingHandlers.sumP={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        $("#"+element.id).html((sum).toFixed(1)+" kWh");
    }
};
ko.bindingHandlers.battery = {
    update:function(element, valueAccessor, allBindings,currentContext,  viewModel) {
        $(element).css('display', 'block');
        var value = valueAccessor();
        var production = value.production;
        var takenFrom = value.takenFrom;
        var incrementBattery=1;
        var zoom;
        switch (value.type){
            case 'day':
                incrementBattery=1;
                zoom=0.90;
                break;
            case 'week':
                incrementBattery=2;
                zoom=0.98;
                break;
            case 'month':
                incrementBattery=3;
                zoom=1.05;
                break;
        }
        $('#battery'+incrementBattery).remove();
        var data = [
            ['Consumption', production],
            ['Taken from grid', takenFrom]
        ];
        var chart = $('<div>')
            .appendTo(element)
            .attr('id', 'battery'+incrementBattery);
        var showFromGrid=takenFrom;
        var showFromPanel;

        if(value.consumption<value.production){
            showFromPanel=value.consumption;
        }else{
            showFromPanel=value.production;
        }
        $(element).parent()
            .on('mouseover', function(){
                viewModel.$root.changeTextData([showFromGrid, showFromPanel])})
            .on('mouseleave', function(){
                viewModel.$root.changeTextData(['', ''])});

        var plot1 = jQuery.jqplot(chart.attr('id'), [data],
            {
                seriesColors: ["#4BB2C5", "#2d6a76"],

                seriesDefaults: {
                    renderer: jQuery.jqplot.DonutRenderer,
                    rendererOptions: {
                        diameter: 250*zoom,
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
                    background: "#F9F9F9"

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
//amount of CO2
ko.bindingHandlers.sumC={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        //&nbsp - nonbreak space
        $("#"+element.id).html((0.61*sum).toFixed(1)+"&nbspkg");
    }
};

//amount of trees
ko.bindingHandlers.sumT={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        //&nbsp - nonbreak space
        $("#"+element.id).html((0.61*sum*0.026).toFixed(1)+"&nbsptrees");
    }
};

//hours of vac cleaning
ko.bindingHandlers.sumV={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        //&nbsp - nonbreak space
        $("#"+element.id).html((sum/1.5).toFixed(1)+"&nbsphours");
    }
};

//hours of vac cleaning
ko.bindingHandlers.sumCar={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        //&nbsp - nonbreak space
        $("#"+element.id).html((sum*0.61*3.8624256).toFixed(1)+"&nbspkm");
    }
};

