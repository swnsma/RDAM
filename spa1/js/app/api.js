window.app.api={
    getInfoByUser: function(id, funcSuccess, funcError){
        $.ajax({
            url: 'http://195.69.221.236/ajax/user_info.php?id=' + id  + '&fields=city,photo,descr',
            type: 'GET',
            contentType: 'application/json',
            async: false,
            success: function (response) {
                console.log(response);
                if (response) {
                    debugger;
                    window.app.dataApp.current_user = response.data[0];
                    //funcSuccess(response);
                } else {
                    //funcError();
                }
            }
            //error: funcError
        });
    },
    getData: function (id,successFunction, type) {
        $.ajax({
            url: 'http://195.69.221.236/ajax/users_values.php?id=' + id + '&todt=last' + type,
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                successFunction(response);
            },
            error: function (xhr, status, error) {
                var err = JSON.parse(xhr.responseText);

            }});
    }
}
