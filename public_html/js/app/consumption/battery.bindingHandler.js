ko.bindingHandlers.battery = {
    init: function(element, valueAccessor) {

        var value = valueAccessor();

        var ctx = element.getContext('2d');
        var consumption = value.consumption;
        var production = value.production;
        var a = 400;
        var b = 120;
        if (production <= consumption) {
            var percentage = production / consumption;
        }
        else {
            percentage = 1;
        }

        element.width =a;
        element.height = b;

        var batteryWidth =element.width;
        var batteryHeight = element.height;

        ctx.fillStyle = "#4CAF50";
        ctx.lineWidth=2;
        ctx.fillRect(0, 0, batteryWidth * percentage, batteryHeight);

        ctx.fillStyle = 'rgb(244, 239, 212)';

        ctx.fillRect(batteryWidth * percentage, 0, batteryWidth - batteryWidth * percentage, batteryHeight);
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle='black';
        ctx.fillText(value.date2+' consumption '+consumption+' kWh',40,60)
    }
};