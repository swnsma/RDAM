/**
 * Created by Таня on 07.04.2015.
 */

function AppViewModelData(data, idChart,equalHeight,equalWidth,items){
    var self=this;
    self.sumProd=ko.observable(0);
    self.buttons=ko.observableArray(['Days','Weeks','Months']);
    self.sumVac=ko.computed(function(){
        return (self.sumProd()/1.5).toFixed(1)+ " hours";
    });
    self.sumC=ko.computed(function(){
        return (self.sumProd()*0.61).toFixed(1)+" kg";
    });
    self.sumCar=ko.computed(function(){
        return ((self.sumProd()*0.61*3.8624256).toFixed(1))+" km";
    });
    self.sumTrees=ko.computed(function(){
        return (self.sumProd()*0.61*0.026).toFixed(1)+" trees";
    });
    self.idChart = idChart;
    self.equalHeightElement=equalHeight;
    self.equalWidthElement=equalWidth;
    self.first_loading = ko.observable(false);
    self.data=items;
    self.thisGraph=ko.observable(0);

    self.changeData=function(data){
        var index=self.buttons().indexOf(data);
        self.thisGraph(index);
    };
}
ko.bindingHandlers.showGraphProductionConsumption={
    init: function(element, valueAccessor, allBindings, viewModel){
        var masId = [window.app.HASH];
        var rend=$.jqplot.BarRenderer;
        values.getValues(masId,
            function(masid){
                debugger;
                $('#loading').css({
                    'display':'none'
                });
                $('#data').css({
                    'display':'block'
                });
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

