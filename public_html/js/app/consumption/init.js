$(document).ready(function() {

    var viewModel = new ViewModel();
    viewModel.activate();

    ko.applyBindings(viewModel);

});
