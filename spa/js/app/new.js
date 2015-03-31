/**
 * Created by Таня on 31.03.2015.
 */
function AppViewModel(id,items,legend,get_type,equalHeight,equalWidth){
    var self= this;
    self.batteries = ko.observableArray([]);
    self.fromGrid = ko.observable('');
    self.fromPanel= ko.observable('');
    self.haveData = false;
    self.stringGrid=ko.computed(function(){
        if(self.haveData){
            return self.fromGrid()+' kWh';
        }else{
            return self.fromGrid();
        }
    });
    self.stringPanel= ko.computed(function(){
        if(self.haveData){
            return self.fromPanel()+' kWh';
        }else{
            return self.fromPanel();
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
    self.activate = function () {
        var id = window.location.hash.slice(1);
        api.getData(id, function (someValues) {
            var result = [];
            parseData(someValues, result);
            self.batteries(result)
        }, '');
    };
    self.equalHeightElement=equalHeight;
    self.equalWidthElement = equalWidth;
    self.desc =ko.observable("The Downing Street complex is a four storey Grade-I and II listed brick built Georgian terraced townhouse.It is a home to the Prime Minister and his family, and a busy office and workplace for the PM and his support staff. In 1732 the first-ever PM Robert Walpole refused to accept the house as a personal gift from King George II. Instead he insisted it be used by future First Lords of the Treasury. In 1735 the architect William Kent connected No.10 Downing Street to a larger house at the rear of the property (erected in 1677) facing Horse Guards Parade. 100% of PMO’s electricity supply is on a green tariff, generated from renewable sources.");
    self.resize=ko.observable(true);
    self.img = ko.observable();
    self.img("http://195.69.221.236/"+current_user.getPhoto());
    self.desc(current_user.getDescr());
    self.userName = ko.observable(current_user.getName());
    self.idChart = id;
    self.data=items;
    self.buttons=ko.observableArray(['Days','Weeks','Months']);
    self.thisGraph=ko.observable(0);
    self.first_loading=ko.observable(false);
    self.sumProd=ko.observable(0);
    self.sumP = ko.computed(function(){
        return self.sumProd()+" kWh";
    });
    self.sumC=ko.computed(function(){
        return (self.sumProd()*0.61).toFixed(1)+" kg";
    });
    self.sumTrees=ko.computed(function(){
        return (self.sumProd()*0.61*0.026).toFixed(1)+" trees";
    });
    self.sumVac=ko.computed(function(){
        return (self.sumProd()/1.5).toFixed(1)+ " hours";
    });
    self.sumCar=ko.computed(function(){
        return ((self.sumProd()*0.61*3.8624256).toFixed(1))+" km";
    });
    self.legend=legend;
    self.get_type=get_type;
    self.appearance=ko.observable(true);
    self.changeAppearance=function(){
        self.appearance(!self.appearance());
    };
    self.changeData=function(data){
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
                viewModel.sumProd(sum.toFixed(1));
                changeGraph(viewModel.idChart,dd,product,dd[0]+' - '+dd[dd.length-1],rend,['#EAA228','#4BB2C5'],viewModel.legend,viewModel.equalHeightElement,viewModel.equalWidthElement);
            },
            function(e){
                alert(e);
            },viewModel.get_type

        )
    },
    update: function(element, valueAccessor, allBindings, viewModel){
        if(viewModel.first_loading()) {
            viewModel.resize();
            var masId = [current_user.getId()];
            viewModel.thisGraph();
            var rend;
            if(viewModel.appearance()){
                rend=$.jqplot.BarRenderer;
            }else{
                rend=$.jqplot.LineRenderer;
            }
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
            changeGraph(viewModel.idChart,dd, product,periodDate, rend, ['#EAA228','#4BB2C5'],viewModel.legend,viewModel.equalHeightElement,viewModel.equalWidthElement);

        }

    }
}


$(document).ready(function () {
    ko.applyBindings(new AppViewModel('chart_home',values.getProCon,true,'',$(".table-metrics"),$(".graph-container")));
});
