function AppViewModelData(data, idChart,equalHeight,equalWidth,items){
    var self=this;
    self.sumProd=ko.observable(0);
    self.buttons=ko.observableArray(['Days','Weeks','Months']);
    self.sumVac=ko.computed(function(){
        return (self.sumProd()/1.5).toFixed(1)+ " hours";
    });
    self.sumC=ko.computed(function(){
        return (self.sumProd()*0.61).toFixed(1)+" kg";
    });
    self.sumCar=ko.computed(function(){
        return ((self.sumProd()*0.61*3.8624256).toFixed(1))+" km";
    });
    self.sumTrees=ko.computed(function(){
        return (self.sumProd()*0.61*0.026).toFixed(1)+" trees";
    });
    self.idChart = idChart;
    self.equalHeightElement=equalHeight;
    self.equalWidthElement=equalWidth;
    self.first_loading = ko.observable(false);
    self.data=items;
    self.thisGraph=ko.observable(0);

    self.changeData=function(data){
        var index=self.buttons().indexOf(data);
        self.thisGraph(index);
    };
}