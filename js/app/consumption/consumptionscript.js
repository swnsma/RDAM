function Consumtion() {
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

    var batteryRender = function (id, production, consumption) {

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

        var batteryWidth = a - 200;
        var batteryHeight = example.height;


        if(percentage!==0) {
            var pic       = new Image();
            pic.src    = 'img/solna15.png';
            pic.onload = function() {
                ctx.drawImage(pic, 10,50);
            }};
//

        ctx.fillStyle = "#71BF44";
        ctx.lineWidth=2;
        ctx.strokeRect(100, 0, batteryWidth * percentage, batteryHeight);
        ctx.fillRect(100, 1, batteryWidth * percentage, batteryHeight-2);





        ctx.fillStyle = "#BF4444 ";
        ctx.strokeRect(batteryWidth * percentage+100, 0, batteryWidth - batteryWidth * percentage, batteryHeight);
        ctx.fillRect(batteryWidth * percentage+100, 1, batteryWidth - batteryWidth * percentage, batteryHeight-2);


        if(percentage!==1) {
            var pic2      = new Image();
            pic2.src    = 'img/31863.png';
            pic2.onload = function() {
                ctx.drawImage(pic2, 460,50);
            };
        }
        //ctx.scale(1,2);



        ctx.beginPath();
        ctx.arc(101,batteryHeight/2,batteryHeight/2-1,0.5*Math.PI,Math.PI*1.5);
        ctx.stroke();
        ctx.fillStyle = "#71BF44";
        ctx.fill();


        ctx.beginPath();
        ctx.arc(batteryWidth*percentage+101,batteryHeight/2,batteryHeight/2-1,0.5*Math.PI,Math.PI*1.5);
        ctx.stroke();
        ctx.fillStyle = "#BF4444";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(batteryWidth+100,batteryHeight/2,batteryHeight/2-1,0,Math.PI*2);
        ctx.stroke();
        ctx.fillStyle = "#F4EFD4";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(batteryWidth+100,batteryHeight/2,30,0,Math.PI*2);
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(batteryWidth+90,batteryHeight/2,30,0,Math.PI*2);
        ctx.stroke();

        //ctx.beginPath();
        //ctx.arc(batteryWidth+100,batteryHeight/2,20,0,Math.PI*2);
        //ctx.stroke();
        //ctx.fillStyle = "black";
        //ctx.fill();

        //  ctx.fillStyle = "yellow";
        //  ctx.font = 'bold 30px sans-serif';
        //  ctx.fillText("Total consumption "+ consumption+" kWatt", 140, 110);
        //  ctx.strokeStyle='black';
        //  ctx.strokeText("Total consumption "+ consumption+" kWatt", 140, 110);
        //  ctx.strokeStyle='black';

        //$target = document.getElementById(id);

        //  var $target1 = $target.parentNode;
        //  //console.log($target1);

        //  var taken = consumption - production;

        //  var $prodSpan = $('<div>');
        //  $prodSpan.appendTo($target1).addClass('prodSpan').addClass('prod').text(day + ' production ' + production + ' kWatts.');
        //  if (percentage !== 1) {
        //      var $consSpan = $('<div>');
        //      $consSpan.appendTo($target1).addClass('prodSpan').addClass('cons').text(day + ' taken from grid ' + taken + ' kWatts.');
        //  }
        //  if(percentage==1)
        //  {
        //       $consSpan = $('<div>');
        //      $consSpan.appendTo($target1).addClass('prodSpan').addClass('cons').text(day + ' consumption ' + consumption + ' kWatts.');
        //  }
    };

}

$(document).ready(function() {
    new Consumtion();
});
