
function AppViewModel(items,legend,get_type){
    var self= this;
    self.data=items;
    self.buttons=ko.observableArray(['Days','Weeks','Months']);
    self.thisGraph=ko.observable(0);
    self.first_loading=ko.observable(false);
    self.sumProd=ko.observable(0);
    self.legend=legend;
    self.get_type=get_type;
    self.appearance=ko.observable(true);
    self.changeAppearance=function()
    {
        self.appearance(!self.appearance());
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
        var rend;
        if(viewModel.appearance()){
            rend=$.jqplot.BarRenderer;
        }else
        {
           rend=$.jqplot.LineRenderer;
        }
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

                var product = viewModel.data('day',masId);
                var sum = 0;
                for(var i in product[0]){
                    sum+=product[0][i];
                }
                viewModel.sumProd(sum);
                changeGraph(dd,product,dd[0]+' - '+dd[dd.length-1],rend,['#EAA228','#4BB2C5'],viewModel.legend);
            },
            function(e){
                alert(e);
            },viewModel.get_type

        )
    },
    update: function(element, valueAccessor, allBindings, viewModel){
        if(viewModel.first_loading()) {
            var masId = [current_user.getId()];
            viewModel.thisGraph();
            var rend;
            if(viewModel.appearance()){
                rend=$.jqplot.BarRenderer;
            }else
            {
                rend=$.jqplot.LineRenderer;
            }
            var type = 'day';
            if (viewModel.thisGraph() === 1) {
                type = 'week';
            } else if (viewModel.thisGraph() === 2) {
                type = 'month';
            };
            var dd = values.getDate(type, masId);
            var product = viewModel.data(type,masId);
            var sum = 0;
            var firstdd = dd[0];
            if(type=='week'){
                var d = new Date();
                var a =3600*24*1000*7;
                d.setTime(Date.parse(dd[0]) - a);
                firstdd= d.getDate()+ ' '+m_names[d.getMonth()]+' '+ d.getFullYear();
                console.log(d.toLocaleString());
            }

            for(var i in product[0]){
                sum+=product[0][i];
            }
            viewModel.sumProd(sum);
            changeGraph(dd, product, firstdd+ ' - '+dd[dd.length-1], rend, ['#EAA228','#4BB2C5'],viewModel.legend);

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


