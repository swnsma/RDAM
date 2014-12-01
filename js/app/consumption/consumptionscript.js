$(document).ready(function() {

    ko.bindingHandlers.battery = {
        init: function(element, valueAccessor) {

            var value = valueAccessor();

            var ctx = element.getContext('2d');
            var consumption = value.consumption;
            var production = value.production;

            var a = 550;
            var b = 150;

            if (production <= consumption) {
                var percentage = production / consumption;
            }
            else {
                percentage = 1;
            }

            element.width = a;
            element.height = b;

            var batteryWidth = a - 200;
            var batteryHeight = element.height;

            ctx.fillStyle = "#8BC34A";
            ctx.lineWidth=2;
            ctx.strokeRect(100, 0, batteryWidth * percentage, batteryHeight);
            ctx.fillRect(100, 1, batteryWidth * percentage, batteryHeight-2);

            ctx.fillStyle = "#FF8A65 ";
            ctx.strokeRect(batteryWidth * percentage+100, 0, batteryWidth - batteryWidth * percentage, batteryHeight);
            ctx.fillRect(batteryWidth * percentage+100, 1, batteryWidth - batteryWidth * percentage, batteryHeight-2);


            ctx.beginPath();
            ctx.arc(101,batteryHeight/2,batteryHeight/2-1,0.5*Math.PI,Math.PI*1.5);
            ctx.stroke();
            ctx.fillStyle = "#8BC34A";
            ctx.fill();


            ctx.beginPath();
            ctx.arc(batteryWidth*percentage+101,batteryHeight/2,batteryHeight/2-1,0.5*Math.PI,Math.PI*1.5);
            ctx.stroke();
            ctx.fillStyle = "#FF8A65";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(batteryWidth+100,batteryHeight/2,batteryHeight/2-1,0,Math.PI*2);
            ctx.stroke();
            ctx.fillStyle = "#F4EFD4";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(batteryWidth+100,batteryHeight/2,15,0,Math.PI*2);
            ctx.stroke();
            ctx.fillStyle = "black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(batteryWidth+93,batteryHeight/2,15,0,Math.PI*2);
            ctx.stroke();
        },
        update: function(element, valueAccessor) {
        }
    };

    var arr=[];

    var successFunction=function(someData){
        for(var i=0;i<someData.length;i++){
            arr.push(someData[i]);
        }

        var viewModelConstructor = function(data){
            this.batteries = data;
        };
        ko.applyBindings(new viewModelConstructor(arr));
    };

    function getData(successFunction) {
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
                    successFunction(response.results);
                }
            },

            error: function () {
            }
        };
        $.ajax(options);
    };

    getData(successFunction);

});
