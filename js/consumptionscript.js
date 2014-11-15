$(document).ready(function () {
    var dayProduction = 10;
    var dayConsumption = 20;

    var weekProduction = 300;
    var weekConsumption = 450;

    var monthProduction = 340;
    var monthConsumption = 460;


    var batteryRender = function (id, production, consumption, day) {

        var $target = $('.batteryContainer');
        var $width = $target.css('width');
        var a = $width.substr(0, $width.length - 2);

        var $height = $target.css('height');
        var b = $height.substr(0, $height.length - 2);
        if (production <= consumption) {
            var percentage = production / consumption;
        }
        else {
            percentage = 1;
        }
        var example = document.getElementById(id),
            ctx = example.getContext('2d');

        example.width = a;
        example.height = b;

        var batteryWidth = a - 50;
        var batteryHeight = example.height;
        ctx.strokeStyle="black";
        ctx.strokeRect(0, 0, batteryWidth * percentage, batteryHeight);

        ctx.fillStyle = "#71BF44";

        ctx.fillRect(0, 0, batteryWidth * percentage, batteryHeight);

        ctx.strokeRect(batteryWidth * percentage, 0, batteryWidth - batteryWidth * percentage, batteryHeight);
        ctx.font = "60px Georgia";
        ctx.strokeText('+', 20, 60);


        ctx.fillStyle = "#BF4444 ";
        ctx.fillRect(batteryWidth * percentage, 0, batteryWidth - batteryWidth * percentage, batteryHeight);

        if(percentage!==1) {
            ctx.font = "80px Georgia";
            ctx.strokeText('-', batteryWidth-80, batteryHeight-130);
        }
        ctx.fillStyle = "#333";
        ctx.fillRect(batteryWidth, batteryHeight / 2 - 25, 50, 50);

        $target = document.getElementById(id);

        var $target1 = $target.parentNode;
        //console.log($target1);

        var taken = consumption - production;

        var $prodSpan = $('<div>');
        $prodSpan.appendTo($target1).addClass('prodSpan').addClass('prod').text(day + ' production ' + production + ' kWatts.');
        if (percentage !== 1) {
            var $consSpan = $('<div>');
            $consSpan.appendTo($target1).addClass('prodSpan').addClass('cons').text(day + ' taken from grid ' + taken + ' kWatts.');
        }
        if(percentage==1)
        {
             $consSpan = $('<div>');
            $consSpan.appendTo($target1).addClass('prodSpan').addClass('cons').text(day + ' consumption ' + consumption + ' kWatts.');
        }
    };

    batteryRender('dayBattery', dayProduction, dayConsumption, 'Yesterday');

    batteryRender('weekBattery', weekProduction, weekConsumption, 'Last week');

    batteryRender('monthBattery', monthProduction, monthConsumption, 'Last month');


});