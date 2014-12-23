//var shown_co2_data=false, shown_trees_data=false;


function Product() {
    var app= new AppViewModel(values.getProduction,false);
    ko.applyBindings(app);
    button_constr($('.time1'));
}

manager.add(Product);

//amount of kW
ko.bindingHandlers.sumP={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        $("#"+element.id).html((sum).toFixed(1)+"kW");
    }
}

//amount of CO2
ko.bindingHandlers.sumC={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        $("#"+element.id).html((0.61*sum).toFixed(1)+"kg");
    }
}

//amount of trees
ko.bindingHandlers.sumT={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        $("#"+element.id).html((0.61*sum*0.026).toFixed(1)+"trees");
    }
}

//hours of vac cleaning
ko.bindingHandlers.sumV={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        $("#"+element.id).html((sum/1.5).toFixed(1)+"hours");
    }
}

//hours of vac cleaning
ko.bindingHandlers.sumCar={
    update:function(element,valueAccessor){
        var sum=valueAccessor()();
        $("#"+element.id).html((sum*0.61*3.8624256).toFixed(1)+"km");
    }
}




