﻿
var sum_days=0;
var sum_weeks=0;
var sum_month=0;
var shown_co2_data=false, shown_trees_data=false;
var weekProduction = [];
var monthProduction = [];
var dayProduction = [];
var dayTicks =[];
var weekTicks =[];
var monthTicks =[];

var rend;
//rend = $.jqplot.BarRenderer;
(function (){
    $('#treeInfo')
        .click(function()
        {
            if(shown_trees_data)
            {
                shown_trees_data=false;
                $('span', this).remove();
                $(this).html('<img src="img/tree2.png" class="factory"/>');

            }
            else
            {
                shown_trees_data=true;
                $('img', this).remove();
                $(this).html('<span>Your avoided CO² emission is equal to the amount of CO² emission sequestered by (amount) of tree seedlings over the period of 10 years. 1kg of CO² equals 0.026 seedlings.</span>');

            }
        });
    $('#co2Info')
        .click(function()
        {
            if(shown_co2_data)
            {
                shown_co2_data=false;
                $('span', this).remove();
                $(this).html('<img src="img/fact1.png" class="factory"/>');
            }
            else{
                shown_co2_data=true;
                $('img', this).remove();
                $(this).html('<span>The CO² emissie-factor is 0,61kg CO² on 1KWh of energy. Now you see avoid CO² emission for the period of time selected in the chart.</span>')
            }
        })
})();
function render(item) {
    allData = item;
    //console.log(allData);
    for (var i = 6; i >= 0; i--) {
        sum_days += allData[i].Reading2;
        dayProduction.push(allData[i].Reading2);
        dayTicks.push(allData[i].FromDT.iso.slice(0, 10));

    }
    for (var i = 22; i >= 19; i--) {
        sum_weeks += allData[i].Reading2;
        weekProduction.push(allData[i].Reading2);
        weekTicks.push(allData[i].FromDT.iso.slice(8, 10));
    }
    for (var i = 18; i >= 7; i--) {
        sum_month += allData[i].Reading2;
        monthProduction.push(allData[i].Reading2);
        monthTicks.push(allData[i].FromDT.iso.slice(5, 7));
    }

    changeGraph(1);
    $("#co2").html((0.61*sum_days).toFixed(1)+" kg");
    $('#trees').html((0.61*sum_days*0.026).toFixed(1)+" seedlings")
}

function changeGraph(number) {
        var production;
        var title;
        if (number == 1) {
            production=dayProduction;
            title = 'Daily production';
        }
        if (number == 2) {
          production=weekProduction;
            title = 'Weekly production';
        }

        if (number == 3) {
          production=monthProduction;
            title = 'Monthly production';
        }
        $('#chartDiv').empty();
        var $plot = $.jqplot('chartDiv', [production], {
            title:title,
            axesDefaults: {
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer
            },
            axes: {
                renderer: $.jqplot.CategoryAxisRenderer,
                // options for each axis are specified in seperate option objects.
                xaxis: {
                    label: "Days",
                    pad: 0
                },
                yaxis: {
                    label:"kW",
                    pad: 1.2,
                    tickOptions: {formatString: '%d'}
                }
            },
            //grid: {borderColor: 'transparent', shadow: false},
            grid: {
                drawGridLines: false,
                gridLineColor: '#cccccc',
                background: '#eee',
    borderColor: '#999999',
    borderWidth: 2.0,
    shadow: false,
    renderer: $.jqplot.CanvasGridRenderer,
    rendererOptions: {}
},
series:[ {
//    renderer: rend,
        rendererOptions: {fillToZero: true},
    shadow: false,
        pointLabels: {show: true},
    markerOptions: {shadow:false}
}],
seriesColors: ['green']
});
}
function co2ForDays()
{
    $("#co2").html((0.61*sum_days).toFixed(1)+" kg");
    $('#trees').html((0.61*sum_days*0.026).toFixed(1)+" seedlings")
}
function co2ForWeeks()
{
    $("#co2").html((0.61*sum_weeks).toFixed(1)+" kg");
    $('#trees').html((0.61*sum_weeks*0.026).toFixed(1)+" seedlings")
}
function co2ForMonth()
{
    $("#co2").html((0.61*sum_month).toFixed(1)+" kg");
    $('#trees').html((0.61*sum_month*0.026).toFixed(1)+" seedlings")
}
function button_constr(el,p,n,text, func)
{
    el.appendTo(p)
        .addClass('time1')
        .text(text)
        .click(function () {
            $(this).addClass("is_active");
            $(this).siblings().removeClass("is_active");
            if(func!==undefined);
            func();
            this_graph=n;
            changeGraph(n);})
        .mouseenter(function () {
            $(this).addClass("on_button")
        })
        .mouseleave(function () {
            $(this).removeClass("on_button")
        });
}
function Product() {
    getData(function(data) {
        render(data);
        setTimeout(function() {
            changeGraph(1);
        }, 1000);
    });

    var $target = $('.graphContainer');

    var  bt = $('<div>').addClass('button-center');
    bt.appendTo($target);

    var $dayButton = $('<div>').addClass("is_active");
    var $weekButton = $('<div>');
    var $monthButton = $('<div>');

    button_constr($dayButton, bt, 1,'Days', co2ForDays);
    button_constr($weekButton, bt, 2,'Weeks', co2ForWeeks);
    button_constr($monthButton, bt, 3,'Months', co2ForMonth);

}

$(document).ready(function() {
    new Product();
});