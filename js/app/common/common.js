function getData(func) {
    var options = {
        url: 'https://api.parse.com/1/classes/date/',
        type: 'GET',
        contentType: 'application/json',
        beforeSend: function (request) {
            request.setRequestHeader('X-Parse-Application-Id', 'dEruvPYiXg1FAzhn4u47ZP8Yjd7B2Ss6Gqjqi7h3');
            request.setRequestHeader('X-Parse-REST-API-Key', 'a6npew12pgZaQJSTeCtPru3cVGS9VmZzG1op4mK8');
        },
        success: function (response) {
            if (response && response.results && response.results.length) {
                var allData=[];
                for (var i = 0; i < response.results.length; i++) {
                    var a = response.results[i];
                    allData.push(a);
                }
                func(allData);
            }
        },

        error: function () {

        }
    };
    $.ajax(options);
};
var monthes=['January','February', 'March','April','May','June','July','August','September','October','November','December'];
function button_constr(el,p,n,text, func)
{
    el.appendTo(p)
        .addClass('time1')
        .text(text)
        .click(function () {
            $(this).addClass("is_active");
            $(this).siblings().removeClass("is_active");
            func();
            this_graph=n;
            changeGraph(n);})
        .mouseenter(function () {
            $(this).addClass("on_button")
        })
        .mouseleave(function () {
            $(this).removeClass("on_button")
        });
}
function click_change()
{
        var a=$(this);
        if(a.hasClass("master"))
        {rend=$.jqplot.BarRenderer;
            changeGraph(this_graph);
        }
        else
        {rend=$.jqplot.LineRenderer;
            changeGraph(this_graph);
        }
        a.toggleClass("master");
}

function LoadingManager() {

    this.enable = function() {
        $('#loading').css('display', 'block');
        $('#data').css('display', 'none');
    };

    this.disable = function() {
        $('#loading').css('display', 'none');
        $('#data').css('display', 'block');
    };

    var self = this;

    function ajaxSetting() {
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                self.enable();
            },
            complete: function(xhr, settings) {
                self.disable();
            }
        });
    }

    (function() {
        ajaxSetting();
    })();
}

var loading = new LoadingManager();