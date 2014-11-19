$(document).ready(function () {
    var allData=[];

    var dayProduction;
    var dayConsumption;
    var weekProduction;
    var weekConsumption;
    var monthProduction;
    var monthConsumption;

    function getData() {
        var options = {
            url: 'https://api.parse.com/1/classes/consumption_data/',
            type: 'GET',
            contentType: 'application/json',
            beforeSend: function (request) {
                request.setRequestHeader('X-Parse-Application-Id', 'dEruvPYiXg1FAzhn4u47ZP8Yjd7B2Ss6Gqjqi7h3');
                request.setRequestHeader('X-Parse-REST-API-Key', 'a6npew12pgZaQJSTeCtPru3cVGS9VmZzG1op4mK8');
            },
            success: function (response) {
                if (response && response.results && response.results.length) {

                    for (var i = 0; i < response.results.length; i++) {
                        var a = response.results[i];
                        allData.push(a);
                    }
                    dayProduction = allData[1].production;
                    dayConsumption = allData[1].consumption;
                    batteryRender('dayBattery', dayProduction, dayConsumption, 'Yesterday');

                    weekProduction=allData[0].production;
                    weekConsumption= allData[0].consumption;
                    batteryRender('weekBattery', weekProduction, weekConsumption, 'Last week');

                    monthProduction=allData[2].production;
                    monthConsumption= allData[2].consumption;
                    batteryRender('monthBattery', monthProduction, monthConsumption, 'Last month');

                }
            },

            error: function () {
            }
        };
        $.ajax(options);
    };
getData();

    var batteryRender = function (id, production, consumption,day ) {



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


        var pic       = new Image();
        pic.src    = 'img/solna15.png';
        pic.onload = function() {
            ctx.drawImage(pic, 10,50);
        };


        ctx.fillStyle = "#71BF44";

        ctx.fillRect(0, 0, batteryWidth * percentage, batteryHeight);

        ctx.strokeRect(batteryWidth * percentage, 0, batteryWidth - batteryWidth * percentage, batteryHeight);



        ctx.fillStyle = "#BF4444 ";
        ctx.fillRect(batteryWidth * percentage, 0, batteryWidth - batteryWidth * percentage, batteryHeight);


        if(percentage!==1) {
            var pic2      = new Image();
            pic2.src    = 'img/molniya.png';
            pic2.onload = function() {
                ctx.drawImage(pic2, 580,50);
            };
        }
        ctx.fillStyle = "#333";
        ctx.fillRect(batteryWidth, batteryHeight / 2 - 25, 30, 50);

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

});