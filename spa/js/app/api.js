var api = {
    getData: getValues = function (id,successFunction, type) {
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
    },
    reqest: function(){
        return $.ajax({
            url: window.app.url+'/ajax/users_values.php?id=' + window.app.id +'&todt=last',
            type: 'GET',
            contentType: 'application/json'
        })
    }

}