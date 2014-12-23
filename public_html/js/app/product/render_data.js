//var shown_co2_data=false, shown_trees_data=false;

//(function (){
//    $('#treeInfo')
//        .click(function()
//        {
//            if(shown_trees_data)
//            {
//                shown_trees_data=false;
//                $('span', this).remove();
//                $(this).html('<img src="img/tree2.png" class="factory"/>');
//
//            }
//            else
//            {
//                shown_trees_data=true;
//                $('img', this).remove();
//                $(this).html('<span>Your avoided CO² emission is equal to the amount of CO² emission sequestered by (amount) of tree seedlings over the period of 10 years. 1kg of CO² equals 0.026 seedlings.</span>');
//
//            }
//        });
//    $('#co2Info')
//        .click(function()
//        {
//            if(shown_co2_data)
//            {
//                shown_co2_data=false;
//                $('span', this).remove();
//                $(this).html('<img src="img/fact1.png" class="factory"/>');
//            }
//            else{
//                shown_co2_data=true;
//                $('img', this).remove();
//                $(this).html('<span>The CO² emissie-factor is 0,61kg CO² on 1KWh of energy. Now you see avoid CO² emission for the period of time selected in the chart.</span>')
//            }
//        })
//})();
//var options={
//    seriesDefault: {
//
//        showMarker:false
//    },
//           series: [
//    {
//        rendererOptions: {
//            fillToZero: true
//        },
//        shadow: false,
//        label:"consumption",
//
//        markerOptions: {shadow:false
//        }
//    }
//    ],
//    highlighter: {show: true, sizeAdjust: 25,
//        tooltipAxes:"y",
//        bringSeriesToFront:true
//    },
////    legend: {
////        show: true,
////        location: 'ne',     // compass direction, nw, n, ne, e, se, s, sw, w.
////        xoffset: 12,        // pixel offset of the legend box from the x (or x2) axis.
////        yoffset: 12        // pixel offset of the legend box from the y (or y2) axis.
////    },
//    axes: {
//
//        xaxis: {
//            renderer: $.jqplot.CategoryAxisRenderer,
//            tickOptions: {formatString: '%b %#d, %y'},
//            tickInterval: '1 month',
//            pad:1.05
//        },
//
//        yaxis: {
//            show:false,
//            label:"kW",
//            pad: 1.001,
//            tickOptions: {formatString: '%d'}
//        }
//    },
//    cursor: {show: true,
//        showHorizontalLine:true,
//        zoom:true,
//        clickReset:true},
//    grid: {
//        drawGridLines: false,
//        gridLineColor: '#fff',
//        background: '#eee',
//        borderColor: '#eee',
//        borderWidth: 1,
//        shadow: false,
//        renderer: $.jqplot.CanvasGridRenderer,
//        rendererOptions: {}
//    }
//    //seriesColors: colors
//};
//
//function processData(item){
//
//    allData = item;
//    //console.log(allData);
//    var data=[];
//    for(var i=0;i<3;i++)
//        data.push(new Data());
//    for (var i = 6; i >= 0; i--) {
//        data[0].Production.push(allData[i].Reading2);
//        data[0].Ticks.push(day(allData[i].ToDT.iso.slice(8,10),allData[i].ToDT.iso.slice(5,7)));
//    }
//    data[0].title='Daily';
//    for (var i = 22; i >= 19; i--) {
//        data[1].Production.push(allData[i].Reading2);
//        data[1].Ticks.push(day(allData[i].ToDT.iso.slice(8,10),allData[i].ToDT.iso.slice(5,7)));
//    }
//    data[1].title='Weekly';
//    for (var i = 18; i >= 7; i--) {
//        data[2].Production.push(allData[i].Reading2);
//        data[2].Ticks.push(mont(allData[i].ToDT.iso.slice(5,7)));
//    }
//    data[2].title='Monthly';
//    return data;
//}
//
//function Product() {
//    getData(appView);
//}
//
//manager.add(Product);
//
//function appView(items)
//{
//    var view_m=new View_model(processData(items));
//    ko.applyBindings(view_m);
//    button_constr(".time1");
//}

function AppViewModel(){
    var self= this;
    self.buttons=ko.observableArray(['Days','Weeks','Months']);
    self.thisGraph=ko.observable(0);
    self.first_loading=ko.observable(false);
    self.rendMas=[$.jqplot.BarRenderer,$.jqplot.LineRenderer];
    self.rend=ko.observable($.jqplot.BarRenderer);
    self.sumProd=ko.observable(0);

    self.changeConsProd=function()
    {
        if(self.rend()===$.jqplot.LineRenderer){
            self.rend($.jqplot.BarRenderer)
        }else
        {
            self.rend($.jqplot.LineRenderer)
        }
    }
    self.changeData=function(data)
    {

        var index=self.buttons().indexOf(data);
        self.thisGraph(index);
    }
}
ko.bindingHandlers.showGraph={
    init: function(element, valueAccessor, allBindings, viewModel){
        var masId = [current_user.getId()];
        values.getValues(masId,
            function(masid){
                $('#loading').css({
                    'display':'none'
                })
                $('#data').css({
                    'display':'block'
                })

                var dd = values.getDate('day',masId)
                viewModel.first_loading(true);
                var product = values.getProduction('day',masId);
                var sum = 0;
                for(var i in product[0]){
                    sum+=product[0][i];
                }
                viewModel.sumProd(sum);
                changeGraph(dd,values.getProduction('day',masId),dd[0]+' - '+dd[dd.length-1],viewModel.rend(),['#4BB2C5']);
            },
            function(e){
                alert(e);
            }

        )
    },
    update: function(element, valueAccessor, allBindings, viewModel){
        if(viewModel.first_loading()) {
            var masId = [current_user.getId()];
            viewModel.thisGraph();

            var type = 'day';
            if (viewModel.thisGraph() === 1) {
                type = 'week';
            } else if (viewModel.thisGraph() === 2) {
                type = 'month';
            }


            var dd = values.getDate(type, masId)
            var product = values.getProduction(type,masId);
            var sum = 0;
            for(var i in product[0]){
                sum+=product[0][i];
            }
            viewModel.sumProd(sum);
            changeGraph(dd, values.getProduction(type, masId), dd[0]+ ' - '+dd[dd.length-1], viewModel.rend(), ['#4BB2C5']);
        }

    }
}
function buttonConstr(clas)
{
    $(clas)
        .click(function () {
            $(this).addClass("is_active");
            $(this).siblings().removeClass("is_active");
        })
        .mouseenter(function () {
            $(this).addClass("on_button")
        })
        .mouseleave(function () {
            $(this).removeClass("on_button")
        })
        .first()
        .addClass("is_active");
}
function Product() {
    var app= new AppViewModel();
    ko.applyBindings(app);
    buttonConstr($('.time1'));
}

manager.add(Product);

//amount of kW
ko.bindingHandlers.sumP={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        $("#"+element.id).html((sum).toFixed(1)+"kW");
    }
}

//amount of CO2
ko.bindingHandlers.sumC={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        $("#"+element.id).html((0.61*sum).toFixed(1)+"kg");
    }
}

//amount of trees
ko.bindingHandlers.sumT={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        $("#"+element.id).html((0.61*sum*0.026).toFixed(1)+"trees");
    }
}

//hours of vac cleaning
ko.bindingHandlers.sumV={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        $("#"+element.id).html((sum/1.5).toFixed(1)+"hours");
    }
}

//hours of vac cleaning
ko.bindingHandlers.sumCar={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        $("#"+element.id).html((sum*0.61*3.8624256).toFixed(1)+"km");
    }
}




