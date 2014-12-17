/**
 * Created by Таня on 20.11.2014.
 */
function getUsers(self) {
    var options = {
        url: 'http://rdam.tk/ajax2/users_info.php?from_id=' + 1  + '&fields=rating',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {

            loading.disable();
//            console.log(current_user.getId());
//            console.log(current_user.getName());
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
                var a = response.data[i];
                var j = i % masColor.length;
                var b = new Users(a.user, a.id, false, masColor[j],a.rating);

                mappedTasks.push(b);
            }
        }
        self.arrayUsers(mappedTasks);
    }
}
