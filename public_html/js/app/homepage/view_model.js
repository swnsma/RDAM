
function AppViewModel(){
    var self= this;
    self.buttons=ko.observableArray(['Days','Weeks','Months']);
    self.thisGraph=ko.observable(0);
    self.first_loading=ko.observable(false);
    self.rendMas=[$.jqplot.BarRenderer,$.jqplot.LineRenderer];
    self.rend=ko.observable($.jqplot.BarRenderer);

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
                debugger;
                var dd = values.getDate('day',masId)
                viewModel.first_loading(true);
                changeGraph(dd,values.gertProCon('day',masId),dd[0]+' - '+dd[dd.length-1],viewModel.rend(),['#990011','#001199'],true);
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
            debugger;
            var type = 'day';
            if (viewModel.thisGraph() === 1) {
                type = 'week';
            } else if (viewModel.thisGraph() === 2) {
                type = 'month';
            }

                debugger;
            var dd = values.getDate(type, masId)
                changeGraph(dd, values.gertProCon(type, masId), dd[0]+ ' - '+dd[dd.length-1], viewModel.rend(), ['#990011','#001199'],true);

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
function HomePage() {
    var app= new AppViewModel();
    ko.applyBindings(app);
    buttonConstr($('.time1'));
}

manager.add(HomePage);



//function appView(items)
//{
//    var viewM=new View_model(processData(items));
//    ko.applyBindings(viewM);
//    buttonConstr(".time1");
//}
//function buttonConstr(clas)
//{
//    $(clas)
//        .click(function () {
//            $(this).addClass("is_active");
//            $(this).siblings().removeClass("is_active");
//        })
//        .mouseenter(function () {
//            $(this).addClass("on_button")
//        })
//        .mouseleave(function () {
//            $(this).removeClass("on_button")
//        })
//        .first()
//        .addClass("is_active");
//}
//function processData(item){
//
//    allData = item;
//    //console.log(allData);
//    var data=[];
//    for(var i=0;i<3;i++)
//        data.push(new Data());
//    for (var i = 6; i >= 0; i--) {
//        data[0].Production.push(allData[i].Reading2);
//        data[0].Consumption.push(allData[i].Reading1);
//        data[0].Ticks.push(day(allData[i].ToDT.iso.slice(8,10),allData[i].ToDT.iso.slice(5,7)));
//    }
//    data[0].title='Daily';
//    for (var i = 22; i >= 19; i--) {
//        data[1].Production.push(allData[i].Reading2);
//        data[1].Consumption.push(allData[i].Reading1);
//        data[1].Ticks.push(day(allData[i].ToDT.iso.slice(8,10),allData[i].ToDT.iso.slice(5,7)));
//    }
//    data[1].title='Weekly';
//    for (var i = 18; i >= 7; i--) {
//        data[2].Production.push(allData[i].Reading2);
//        data[2].Consumption.push(allData[i].Reading1);
//       data[2].Ticks.push(mont(allData[i].ToDT.iso.slice(5,7)));
//    }
//   data[2].title='Monthly';
//return data;
//}
//
//
//
