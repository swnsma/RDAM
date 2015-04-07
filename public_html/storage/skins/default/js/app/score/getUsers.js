function getUsers(self,success) {
    var options = {
        url: 'http://rdam.tk/ajax/users_info.php?from_id=' + 1+'&&fields=city,photo,descr',

//        url: 'http://rdam/public_html/ajax/users_info.php?from_id=' + 1+'&&fields=city,photo,descr',

        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            loading.disable();
            success(response,self);

        },
        error: function () {
        }
    };
    $.ajax(options);
}

function getUsers2(from_id, self) {
    $.ajax({
        url: 'http://rdam.tk/ajax/users_info.php',
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        data: {
            from_id: from_id,
            fields: 'city,photo,descr'
        },
        success: function(response) {
            analyze(response, self);
        }
    });
}

function analyze(response,self){
    if (response && response.data && response.data.length) {
        var mappedTasks = [];
        for (var i = 0; i < response.data.length; i++){
            if(response.data[i].id!=self.current_user().id()) {
                var a = response.data[i];
                var j = i % masColor.length;
                var b = new Users(a.user, a.id, false, masColor[j]);

                mappedTasks.push(b);
            }
        }
        self.arrayUsers(mappedTasks);
    }
}
