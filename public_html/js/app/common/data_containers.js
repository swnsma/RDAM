function Data()
{
    this.Production =  [];
    this.Consumption =  [];
    this.Ticks = [];
    this.return_en =return_en(this.Production,this.Consumption);
    this.sumProd =function(){return sum_n(this.Production);};
    this.sumCons ==function(){return sum_n(this.Consumption)};

}

var sum_n = function(a){
    var sum=0;
    for(i=0;i< a.length;i++)
    {
        sum+=a[i];
    }

    return sum;
};
var return_en = function(a,b){
    var c=[];
    if(a)
    {
        c[0]=a;
        c[1]=b;
        return c;
    }
    return [];
};

function View_model(items)
{
    self=this;
    self.data=items;
    self.thisGraph=ko.observable(3);
    self.options=options;
    self.plot;
    self.dataToRend= ko.observableArray();
    self.dataToRend(self.data[0]);
    self.rendMas=[$.jqplot.BarRenderer,$.jqplot.LineRenderer];
    self.rend=ko.observable(self.rendMas[0]);
    self.buttons=ko.observableArray(['Days','Weeks','Months']);
    self.sumProd = ko.observable(self.data[0].sumProd());
    self.change=function(){
        if (self.rend() === self.rendMas[0]) {
            self.rend($.jqplot.LineRenderer);
        }
        else {
            self.rend($.jqplot.BarRenderer);
        }
    };

    self.changeData=function(data)
    {   var index=self.buttons().indexOf(data);
        self.thisGraph(index+1);
        self.dataToRend(self.data[index]);
        self.sumProd(self.data[index].sumProd());

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


ko.bindingHandlers.renderChart={
    update:function(element, valueAccessor, allBindings, viewModel, bindingContext){
        var ticks=[];
        var mas_dat=[];
        var title;
        var self=bindingContext.$root;
        var to_rend = ko.unwrap(valueAccessor());
        to_rend.Ticks.sort(function(a, b) {
            a = new Date(a.replace(/(\d+) (\s+)./, '$2/2000/$1'));
            b = new Date(b.replace(/(\d+) (\s+)./, '$2/2000/$1'));
            return a - b;
        });
        ticks = to_rend.Ticks;
        mas_dat=to_rend.return_en;
        title=to_rend.title;
        self.options.title=title;
        self.options.axes.xaxis.ticks=ticks;
        for(i=0;i<self.options.series.length;i++)
            self.options.series[i].renderer=self.rend();

        $("#"+element.id).empty();
        console.dir(self.options);
        plot= $.jqplot(element.id, mas_dat,self.options);
    }
}


