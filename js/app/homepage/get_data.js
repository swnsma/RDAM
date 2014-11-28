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

                console.log(allData);
                render(allData);
            }
             },

        error: function () {

        }
    };
    $.ajax(options);
};

