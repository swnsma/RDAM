ko.bindingHandlers.title = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        $('title').text(viewModel.userName() + " | RTE");
    }
};