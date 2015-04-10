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
    },
    compareAjax: function(ids, n) {
        return $.ajax({
            url: window.app.url + '/ajax/users_values.php?id=' + ids + '&todt=last&type=week&limit=' + n,
            type: 'GET',
            contentType: 'application/json'
        });
    },
    getUsers: function(){
        return $.ajax({
            url: window.app.url + '/ajax/users_info.php?from_id=' + 1 + '&&fields=city,photo,descr',
            type: 'GET',
            contentType: 'application/json'
        });
    }
}
