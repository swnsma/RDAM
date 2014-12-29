function ViewModel() {
    var that = this;

    that.batteries = ko.observableArray([]);
    that.activate = function () {
        var id = window.location.hash.substring(1);
        api.getData(id, function (someValues) {
            var result = [];
            parseData(someValues, result);
            that.batteries(result)
        }, '');
    }
};