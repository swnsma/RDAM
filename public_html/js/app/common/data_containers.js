//
//function View_model(items)
//{
//    self=this;
//    self.data=items;
//    self.thisGraph=ko.observable(3);
//    self.options=options;
//    self.plot;
//    self.dataToRend= ko.observableArray();
//    self.dataToRend(self.data[0]);
//    self.rendMas=[$.jqplot.BarRenderer,$.jqplot.LineRenderer];
//    self.rend=ko.observable(self.rendMas[0]);
//    self.buttons=ko.observableArray(['Days','Weeks','Months']);
//    self.sumProd = ko.observable(self.data[0].sumProd());
//    self.change=function(){
//        if (self.rend() === self.rendMas[0]) {
//            self.rend($.jqplot.LineRenderer);
//        }
//        else {
//            self.rend($.jqplot.BarRenderer);
//        }
//    };
//
//    self.changeData=function(data)
//    {   var index=self.buttons().indexOf(data);
//        self.thisGraph(index+1);
//        self.dataToRend(self.data[index]);
//        self.sumProd(self.data[index].sumProd());
//
//    }
//}

function AppViewModel(items,legend){
    var self= this;
    self.data=items;
    self.buttons=ko.observableArray(['Days','Weeks','Months']);
    self.thisGraph=ko.observable(0);
    self.first_loading=ko.observable(false);
    self.rendMas=[$.jqplot.BarRenderer,$.jqplot.LineRenderer];
    self.rend=ko.observable($.jqplot.BarRenderer);
    self.sumProd=ko.observable(0);
    self.legend=legend;
    self.changeConsProd=function()
    {
        if(self.rend()===$.jqplot.LineRenderer){
            self.rend($.jqplot.BarRenderer)
        }else
        {
            self.rend($.jqplot.LineRenderer)
        }
    };
    self.changeData=function(data)
    {

        var index=self.buttons().indexOf(data);
        self.thisGraph(index);
    };
}
ko.bindingHandlers.showGraph={
    init: function(element, valueAccessor, allBindings, viewModel){
        var masId = [current_user.getId()];
        values.getValues(masId,
            function(masid){
                $('#loading').css({
                    'display':'none'
                });
                $('#data').css({
                    'display':'block'
                });
                var dd = values.getDate('day',masId);
                viewModel.first_loading(true);
                var d = new Date();
                var a =3600*24*1000*7;
                d.setTime(Date.parse(dd[0]) - a);
                console.log(d.toLocaleString());
                var product = viewModel.data('day',masId);
                var sum = 0;
                for(var i in product[0]){
                    sum+=product[0][i];
                }
                viewModel.sumProd(sum);
                changeGraph(dd,product,dd[0]+' - '+dd[dd.length-1],viewModel.rend(),['#EAA228','#4BB2C5'],viewModel.legend);
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
            };
            var dd = values.getDate(type, masId);
            var product = viewModel.data(type,masId);
            var sum = 0;

            for(var i in product[0]){
                sum+=product[0][i];
            }
            viewModel.sumProd(sum);
            changeGraph(dd, product, dd[0]+ ' - '+dd[dd.length-1], viewModel.rend(), ['#EAA228','#4BB2C5'],viewModel.legend);

        }

    }
}

function button_constr(clas)
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


