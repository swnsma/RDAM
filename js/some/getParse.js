
function getDate(d) {
    var pos;
    var pos2 = 0;
    function getParam(delim) {
        pos = d.indexOf(delim);
        if (pos == -1) throw "invalid date";
        var a = parseInt(d.substring(pos2, pos));
        pos2 = ++pos;
        return a;
    }

    var obj = {
        year: getParam('-'),
        month: getParam('-'),
        day: getParam('T'),
        hour: getParam(':'),
        minute: getParam('.')
    };

    return obj;
}


function getData() {
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
                console.log(allData);

                allData = allData.sort(function(a, b) {
                    a = new Date(a.createdAt.replace(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)/, '$2/$3/$1 $4:$5:$6'));
                    b = new Date(b.createdAt.replace(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)/, '$2/$3/$1 $4:$5:$6'));
                    return a - b;
                });

                console.log(allData);
                render(allData);
            }
             },

        error: function () {

        }
    };
    $.ajax(options);
};

