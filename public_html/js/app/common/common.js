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
            loading.disable();
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

function day(a,b) {
    var c=+b;
    return a+" "+monthes[c-1].slice(0,3)+".";
}

function mont(a)
{
    var c=+a;
    return monthes[c-1].slice(0,3);
}

function click_change()
{
        var a=$(this);
        if(a.hasClass("master"))
        {   rend=$.jqplot.BarRenderer;
            line=0;
            changeGraph(this_graph);


        }
        else
        {   rend=$.jqplot.LineRenderer;
            line=1;
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
}

function CurrentUser() {
    var current_id = 1;
    this.getCurrentUserId = function() {
        return current_id;
    }
}

function includeJs(jsFilePath) {
    var js = document.createElement("script");

    js.type = "text/javascript";
    js.src = jsFilePath;

    document.body.appendChild(js);
}
var loading = new LoadingManager();