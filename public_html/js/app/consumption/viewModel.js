function ViewModel(data){
    var that= this;

    that.batteries = ko.observableArray([]);
    that.activate = function(){
        api.getData(function(someData){
            var result=[];
            for(var i=0;i<someData.length;i++){
                someData[i].takenFrom=someData[i].consumption-someData[i].production;
                result.push(someData[i]);
            }
            that.batteries(result);
        })
    }
};