function Data()
{
    this.Production =  []
    this.Consumption =  []
    this.Ticks = []
    this.return_en =return_en(this.Production,this.Consumption);
}

var return_en = function(a,b){
    var c=[]
    if(a)
    {
        c[0]=a;
        c[1]=b;
        return c;
    }
    return [];
}

function Graph()
{
    self=this;
    self.days=new Data();
    self.weeks=new Data();
    self.months=new Data();
    self.this_graph=1;
    self.options;
    self.rend_mas=[$.jqplot.BarRenderer,$.jqplot.LineRenderer];
    self.rend=self.rend_mas[0];
    self.set_opt=function(obj)
    {
        if(obj)
        self.options=obj;
    };
    self.change_view = function()
    {
        if(self.rend===self.rend_mas[0])
        {
            self.rend=self.rend_mas[1];
        }
        else
        {
            self.rend=self.rend_mas[0];
        }
    };
    self.data_to_chart=function(item){

        allData = item;
        //console.log(allData);
        for (var i = 6; i >= 0; i--) {
            self.days.Production.push(allData[i].Reading2);
            self.days.Consumption.push(allData[i].Reading1);
            self.days.Ticks.push(allData[i].FromDT.iso.slice(0, 10));
        }
        for (var i = 22; i >= 19; i--) {
            self.weeks.Production.push(allData[i].Reading2);
            self.weeks.Consumption.push(allData[i].Reading1);
            self.weeks.Ticks.push(allData[i].FromDT.iso.slice(8, 10));
        }
        for (var i = 18; i >= 7; i--) {
            self.months.Production.push(allData[i].Reading2);
            self.months.Consumption.push(allData[i].Reading1);
            self.months.Ticks.push(allData[i].FromDT.iso.slice(5, 7));
        }
        setTimeout(function() {
            self.render_graph();
        }, 1000);

    }

    self.render_graph=function(n){

        var ticks=[];
        var mas_dat=[];
        var title;
        if(n)
            self.this_graph=n;
        number = self.this_graph;
        var days=self.days;
        var weeks=self.weeks;
        var months=self.months;

        switch (number)
        {
            case 1:
                days.Ticks.sort(function(a, b) {
                    a = new Date(a.replace(/(\d+) (\s+)./, '$2/2000/$1'));
                    b = new Date(b.replace(/(\d+) (\s+)./, '$2/2000/$1'));
                    return a - b;
                });
                ticks = days.Ticks;
                mas_dat=days.return_en;
                title='Daily production';
                break;
            case 2:
                weeks.Ticks.sort(function(a, b) {
                    a = new Date(a.replace(/(\d+) (\s+)./, '$2/2000/$1'));
                    b = new Date(b.replace(/(\d+) (\s+)./, '$2/2000/$1'));
                    return a - b;
                });
                ticks = weeks.Ticks;
                mas_dat=weeks.return_en;
                title='Weekly production';

                break;
            case 3:
                ticks = months.Ticks;
                mas_dat=months.return_en;
                title='Monthly production';

                break;
        }
        self.options.title=title;
        self.options.axes.xaxis.ticks=ticks;
        for(var i=0;i<self.options.series.length;i++)
        self.options.series[i].renderer=self.rend;
        if(mas_dat[0]&&mas_dat[0].length)
        {
            $("#chartDiv").empty();
            var plot1 = $.jqplot("chartDiv", mas_dat,self.options);

        }
    }

}

