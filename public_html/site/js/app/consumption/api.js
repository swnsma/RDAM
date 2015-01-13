var api = {
    getData: getValues = function (id,successFunction, type) {
            $.ajax({
                url: 'http://195.69.221.236/ajax/users_values.php?id=' + id + '&todt=last' + type,
                type: 'GET',
                contentType: 'application/json',

                success: function (response) {
                    if (response) {
                        successFunction(response);
                        loading.disable()
                     }
                    else {
                      alert('2')
                    }
                },
                error: function (xhr, status, error) {
                    var err = JSON.parse(xhr.responseText);

            }});
        }

}