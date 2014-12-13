ko.bindingHandlers.battery = {
    init: function(element, valueAccessor) {

        var value = valueAccessor();

        var consumption = value.consumption;
        var production = value.production;

        var percentage=production/consumption*100;


        element.style.width=percentage+'%';
        //element.innerText='adsdafads'
    }
};