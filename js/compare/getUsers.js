/**
 * Created by Таня on 20.11.2014.
 */
function getUsers(self) {
    var options = {
        url: 'https://api.parse.com/1/classes/users/',
        type: 'GET',
        contentType: 'application/json',
        beforeSend: function (request) {
            request.setRequestHeader('X-Parse-Application-Id', 'dEruvPYiXg1FAzhn4u47ZP8Yjd7B2Ss6Gqjqi7h3');
            request.setRequestHeader('X-Parse-REST-API-Key', 'a6npew12pgZaQJSTeCtPru3cVGS9VmZzG1op4mK8');
        },
        success: function (response) {


            if (response && response.results && response.results.length) {


                var mappedTasks = [];
                for (var i = 0; i < response.results.length; i++) {
                    var a = response.results[i];
                    var b = new Users(a.name, a.objectId,false,masColor[i]);
                    mappedTasks.push(b);
                }

                self.arrayUsers(mappedTasks);
               /* console.log(mappedTasks);*/
            }
        },

        error: function () {

        }
    };
    $.ajax(options);
};