
function HomePage() {
    var app= new AppViewModel(values.getProCon,true);
    ko.applyBindings(app);
    button_constr($('.time1'));
}
manager.add(HomePage);

