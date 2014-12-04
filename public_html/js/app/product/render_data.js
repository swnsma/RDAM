var shown_co2_data=false, shown_trees_data=false;

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

function process_data(item){

    allData = item;
    //console.log(allData);
    var data=[];
    for(var i=0;i<3;i++)
        data.push(new Data());
    for (var i = 6; i >= 0; i--) {
        data[0].Production.push(allData[i].Reading2);
        data[0].Ticks.push(day(allData[i].ToDT.iso.slice(8,10),allData[i].ToDT.iso.slice(5,7)));
    }
    data[0].title='Daily';
    for (var i = 22; i >= 19; i--) {
        data[1].Production.push(allData[i].Reading2);
        data[1].Ticks.push(day(allData[i].ToDT.iso.slice(8,10),allData[i].ToDT.iso.slice(5,7)));
    }
    data[1].title='Weekly';
    for (var i = 18; i >= 7; i--) {
        data[2].Production.push(allData[i].Reading2);
        data[2].Ticks.push(mont(allData[i].ToDT.iso.slice(5,7)));
    }
    data[2].title='Monthly';
    return data;
}

$(document).ready(function() {
    getData(appView);
});

function appView(items)
{
    var view_m=new View_model(process_data(items));
    ko.applyBindings(view_m);
    button_constr(".time1");
}

ko.bindingHandlers.sum_c={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        $("#"+element.id).html((0.61*sum).toFixed(1)+" kg");
    }
}

ko.bindingHandlers.sum_t={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        $("#"+element.id).html((0.61*sum*0.026).toFixed(1)+" seedlings");
    }
}




