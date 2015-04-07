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