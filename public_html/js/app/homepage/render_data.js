
function HomePage() {
    getData(appView);
}

manager.add(HomePage);


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



