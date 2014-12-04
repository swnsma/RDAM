
var options={
    seriesDefault: {

        showMarker:false
    },
    series: [
        {
            rendererOptions: {
                fillToZero: true
            },
            shadow: false,
            label:"consumption",

            markerOptions: {shadow:false
            }
        },
        {
            rendererOptions: {
                fillToZero: false
            },
            shadow: false,
            label:"production",
            markerOptions: {shadow:false}

        }
    ],
    highlighter: {show: true, sizeAdjust: 25,
        tooltipAxes:"y",
        bringSeriesToFront:true
    },
    legend: {
        show: true,
        location: 'ne',     // compass direction, nw, n, ne, e, se, s, sw, w.
        xoffset: 12,        // pixel offset of the legend box from the x (or x2) axis.
        yoffset: 12        // pixel offset of the legend box from the y (or y2) axis.
    },
    axes: {

        xaxis: {
            renderer: $.jqplot.CategoryAxisRenderer,
            tickOptions: {formatString: '%b %#d, %y'},
            tickInterval: '1 month',
            pad:1.05
        },

        yaxis: {
            show:false,
            label:"kW",
            pad: 1.001,
            tickOptions: {formatString: '%d'}
        }
    },
    cursor: {show: true,
        showHorizontalLine:true,
        zoom:true,
        clickReset:true},
    grid: {
        drawGridLines: false,
        gridLineColor: '#fff',
        background: '#eee',
        borderColor: '#eee',
        borderWidth: 1,
        shadow: false,
        renderer: $.jqplot.CanvasGridRenderer,
        rendererOptions: {}
    }
    //seriesColors: colors
};




$(document).ready(function() {
    getData(appView);
});


function appView(items)
{
    var view_m=new View_model(process_data(items));
    ko.applyBindings(view_m);
    button_constr(".time1");
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
function process_data(item){

    allData = item;
    //console.log(allData);
    var data=[];
    for(var i=0;i<3;i++)
        data.push(new Data());
    for (var i = 6; i >= 0; i--) {
        data[0].Production.push(allData[i].Reading2);
        data[0].Consumption.push(allData[i].Reading1);
        data[0].Ticks.push(day(allData[i].ToDT.iso.slice(8,10),allData[i].ToDT.iso.slice(5,7)));
    }
    data[0].title='Daily';
    for (var i = 22; i >= 19; i--) {
        data[1].Production.push(allData[i].Reading2);
        data[1].Consumption.push(allData[i].Reading1);
        data[1].Ticks.push(day(allData[i].ToDT.iso.slice(8,10),allData[i].ToDT.iso.slice(5,7)));
    }
    data[1].title='Weekly';
    for (var i = 18; i >= 7; i--) {
        data[2].Production.push(allData[i].Reading2);
        data[2].Consumption.push(allData[i].Reading1);
       data[2].Ticks.push(mont(allData[i].ToDT.iso.slice(5,7)));
    }
   data[2].title='Monthly';
return data;
}


ko.bindingHandlers.render_chart={
    update:function(element, valueAccessor, allBindings, viewModel, bindingContext){
        var ticks=[];
        var mas_dat=[];
        var title;
        var self=bindingContext.$root;7//
        var to_rend = ko.unwrap(valueAccessor());
        //var plot=self.plot;
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
        //{
            $("#"+element.id).empty();
            console.dir(self.options);
            plot= $.jqplot(element.id, mas_dat,self.options);
        //}

    }
}

