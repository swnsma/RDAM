
ko.bindingHandlers.graph = {
    update: function (element, valueAccessor) {
        var desc = valueAccessor();
        var rawData = ko.unwrap(desc);
        drawGraph(element, rawData);
    }
}