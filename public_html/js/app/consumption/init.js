function Consumption() {
    var viewModel = new ViewModel();
    viewModel.activate();
    ko.applyBindings(viewModel);
}

manager.add(Consumption);

