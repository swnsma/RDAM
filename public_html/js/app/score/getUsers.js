/**
 * Created by Таня on 20.11.2014.
 */
function getUsers(self) {
    var options = {
        url: 'http://rdam.zz.mu/ajax/users_info.php?from_id=' + 1  + '&fields=rating',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {

            loading.disable();
            console.log(current_user.getId());
            console.log(current_user.getName());
//            console.log(response.data[0].user)
            analyze(response,self);

        },
        error: function () {
        }
    };
    $.ajax(options);
};
function analyze(response,self){
    if (response && response.data && response.data.length) {
        var mappedTasks = [];
        for (var i = 0; i < response.data.length; i++){
            if(response.data[i].id!=self.current_user().id()) {
//                debugger;
//                debugger;
                var a = response.data[i];
                var j = i % masColor.length;
                var b = new Users(a.user, a.id, false, masColor[j],a.rating);

                mappedTasks.push(b);
            }
        }
        self.arrayUsers(mappedTasks);
    }
}

function get_first() {
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
                var mappedTasks = [];
                for (var i = 0; i < response.results.length; i++) {
                    var a = response.results[i];
                    mappedTasks.push(a);
                }
                //debugger;
               users_data[0]=mappedTasks;
               render();
                /* console.log(mappedTasks);*/
            }
        },

        error: function () {

        }
    };
    $.ajax(options);
};