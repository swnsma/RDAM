
function HomePage() {
    var app= new AppViewModel(values.getProCon,true);
    ko.applyBindings(app);
    button_constr($('.period'));
}
manager.add(HomePage);

