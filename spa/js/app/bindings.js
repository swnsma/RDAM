//amount of kW
ko.bindingHandlers.sumP={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        $("#"+element.id).html((sum).toFixed(1)+" kWh");
    }
}

//amount of CO2
ko.bindingHandlers.sumC={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        //&nbsp - nonbreak space
        $("#"+element.id).html((0.61*sum).toFixed(1)+"&nbspkg");
    }
}

//amount of trees
ko.bindingHandlers.sumT={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        //&nbsp - nonbreak space
        $("#"+element.id).html((0.61*sum*0.026).toFixed(1)+"&nbsptrees");
    }
}

//hours of vac cleaning
ko.bindingHandlers.sumV={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        //&nbsp - nonbreak space
        $("#"+element.id).html((sum/1.5).toFixed(1)+"&nbsphours");
    }
}

//hours of vac cleaning
ko.bindingHandlers.sumCar={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        //&nbsp - nonbreak space
        $("#"+element.id).html((sum*0.61*3.8624256).toFixed(1)+"&nbspkm");
    }
}

