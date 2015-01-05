function ViewModel() {
    var that = this;

    that.batteries = ko.observableArray([]);
    that.fromGrid = ko.observable('');
    that.fromPanel= ko.observable('');
    that.haveData = false;
    that.stringGrid=ko.computed(function(){
        if(that.haveData){
            return that.fromGrid()+' kWh';
        }else{
            return that.fromGrid();
        }
    });
    that.stringPanel= ko.computed(function(){
        if(that.haveData){
            return that.fromPanel()+' kWh';
        }else{
            return that.fromPanel();
        }
    });
    that.changeTextData= function(newData){
        if(newData[0]===0||newData[1]===0||newData[0]>0&&newData[1]>0){
            that.haveData=true;
        }else{
            that.haveData=false;
        }
        that.fromGrid(newData[0]);
        that.fromPanel(newData[1]);
    };
    that.activate = function () {
        var id = window.location.hash.slice(1);
        api.getData(id, function (someValues) {
            var result = [];
            parseData(someValues, result);
            that.batteries(result)
        }, '');
    };
}