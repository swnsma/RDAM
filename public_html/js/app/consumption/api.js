var api = {
    getData: function(successFunction){
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
    }
}
