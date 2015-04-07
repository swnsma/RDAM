function AppViewModelSelf(){
    var self= this;
    self.haveData = false;
    self.batteries = ko.observableArray([]);
    self.fromGrid = ko.observable('');
    self.fromPanel= ko.observable('');
    self.stringGrid=ko.computed(function(){
        if(self.haveData){
            return self.fromGrid()+' kWh';
        }else{
            return self.fromGrid();
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
    self.stringPanel= ko.computed(function(){
        if(self.haveData){
            return self.fromPanel()+' kWh';
        }else{
            return self.fromPanel();
        }
    });
    self.activate = function () {
        debugger;
        /*var id = window.location.hash.slice(1);
        window.app.api.getData(id, function (someValues) {*/
            var result = [];
            //parseData(someValues, result);
            parseData(app.dataApp.data, result);
            self.batteries(result);
        //}, '');
    };
}