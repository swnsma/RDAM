/**
 * Created by Таня on 07.04.2015.
 */

function AppViewModelSelf(){
    var self= this;
    self.haveData = false;
    self.batteries = ko.observableArray([]);
    self.fromGrid = ko.observable('');
    self.fromPanel= ko.observable('');
    self.stringGrid=ko.computed(function(){
        if(self.haveData){
            return self.fromGrid()+' kWh';
        }else{
            return self.fromGrid();
        }
    });
    self.changeTextData= function(newData){
        if(newData[0]===0||newData[1]===0||newData[0]>0&&newData[1]>0){
            self.haveData=true;
        }else{
            self.haveData=false;
        }
        self.fromGrid(newData[0]);
        self.fromPanel(newData[1]);
    };
    self.stringPanel= ko.computed(function(){
        if(self.haveData){
            return self.fromPanel()+' kWh';
        }else{
            return self.fromPanel();
        }
    });
    self.activate = function () {
        /*var id = window.location.hash.slice(1);
        window.app.api.getData(id, function (someValues) {*/
            var result = [];
            //parseData(someValues, result);
            parseDate(app.dataApp.data, result);
            self.batteries(result);
        //}, '');
    };
}
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
