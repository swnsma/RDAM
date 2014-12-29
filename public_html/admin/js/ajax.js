var url = 'http://rdam.loc:83/admin/ajax/';

function Ajax() {}

Ajax.prototype._gen_func = function(func) {
    var result_func = {};

    if (func.success) {
        result_func.success = function(data) {
            if (data.status == 'success') {
                func.success(data.data);
            } else if (func.error) {
                func.error('status is not success');
            }
        }
    } else {
        result_func.success = function() {};
    }

    if (func.error) {
        result_func.error = function(xhr, status, error) {
            var err = JSON.parse(xhr.responseText);
            if (err.error_message) {
                func.error(err.error_message);
            } else {
                func.error('unknown error');
            }
        }
    } else {
        result_func.error = function() {};
    }

    if (func.before) {
        result_func.before = func.before;
    } else {
        result_func.before = function() {};
    }

    if (func.after) {
        result_func.after = func.after;
    } else {
        result_func.after = function() {};
    }

    return result_func;
};

Ajax.prototype.check_exists_city = function(city, func) {
    var key = '5014b616aa426e0a5a01ccf7ebc3d';
    var success = func.success;
    func = this._gen_func(func);
    func.success = success;
    $.ajax({
        url: 'http://api.worldweatheronline.com/free/v2/weather.ashx?q=' + city + '&format=json&num_of_days=5&key=' + key,
        type: 'GET',
        contentType: 'application/json',
        beforeSend: func.before,
        complete: func.after,
        success: function(response) {
            console.log(response);
            if (response.data.weather) {
                func.success(true);
            } else {
                func.success(false);
            }
        },
        error: func.error
    });
};

Ajax.prototype.create_user = function(data, func) {
    func = this._gen_func(func);
    $.ajax({
        url: url + 'add_user.php',
        type: "POST",
        dataType: 'json',
        data: data,
        beforeSend: func.before,
        complete: func.after,
        success: func.success,
        error: func.error
    });
};

Ajax.prototype.update_user_info = function(data, func) {
    func = this._gen_func(func);
    $.ajax({
        url: url + 'update_user.php',
        type: "POST",
        dataType: 'json',
        data: data,
        beforeSend: func.before,
        complete: func.after,
        success: func.success,
        error: func.error
    });
};

var ajax = new Ajax();

$(document).ready(function() {
    /*ajax.check_exists_city('london', {
        success: function(status) { console.log(status); },
        error: function(err) { console.log('error'); },
        before: function() { console.log('before'); },
        after: function() { console.log('after'); }
    });*/

    /*ajax.create_user({
        user_name: 'auserddfdfdfd',
        city: 'citydfsdwerdfs',
        descr: 'descr3333333333333333333333333rfssf343fdsfdf43e34df'
    }, {
        success: function(data) { console.log(data); },
        error: function(error) { console.log(error); },
        before: function() { console.log('before'); },
        after: function() { console.log('after'); }
    })*/
    /*ajax.update_user_info({
        id: 44,
        user_name: 'erddfdfdfd',
        city: 'citydfsdwerdfs',
        descr: 'descr3333333333333333333333333rfssf343fdsfdf43e34df'
    }, {
        success: function(data) { console.log(data); },
        error: function(error) { console.log(error); },
        before: function() { console.log('before'); },
        after: function() { console.log('after'); }
    })*/
});

