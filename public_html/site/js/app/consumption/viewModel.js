function ViewModel() {
    var that = this;

    that.batteries = ko.observableArray([]);
    that.fromGrid = ko.observable('');
    that.fromPanel= ko.observable('');

    that.changeTextData= function(newData){
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