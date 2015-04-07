window.app.api={
    getInfoByUser: function(id){
        return $.ajax({
            url: window.app.url+'/ajax/user_info.php?id=' + id  + '&fields=city,photo,descr',
            type: 'GET',
            contentType: 'application/json'
        });
    },
    getData: function (id) {
        return $.ajax({
            url: window.app.url+'/ajax/users_values.php?id=' + id + '&todt=last',
            type: 'GET',
            contentType: 'application/json'
        })
    }
}
