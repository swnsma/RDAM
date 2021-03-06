//var url = 'http://rdam.loc:83/';
//var url = 'http://rdam:10000/public_html/';
//var url = 'http://195.69.221.236/';
var url = 'http://195.69.221.236/';

function Ajax() {}

Ajax.prototype._gen_func = function(func) {
    var result_func = {};

    if (func.success) {
        result_func.success = function(data) {
            console.log(data);
            console.log(data.status);
            if (data.status == 'success') {
                func.success(data.data);
            } else if (func.error) {
                func.error('status is not success');
            }
        };
    } else {
        result_func.success = function() {};
    }

    if (func.error) {
        result_func.error = function(xhr, status, error) {
            var err = JSON.parse(xhr.responseText);
            console.log(error);
            if (err.error_message) {
                func.error(err.error_message);
            } else {
                func.error('unknown error');
            }
        };
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

Ajax.prototype._custom_xhr = function(func) {
    var myXhr = $.ajaxSettings.xhr();
    if(myXhr.upload) {
        myXhr.upload.addEventListener('progress', func, false);
    }
    return myXhr;
};
Ajax.prototype.create_user = function(data, func) {
    func = this._gen_func(func);
    $.ajax({
        url: url + 'admin/ajax/add_user.php',
        type: 'POST',
        dataType: 'json',
        data: data,
        beforeSend: func.before,
        complete: func.after,
        success: func.success,
        error: func.error
    });
};
Ajax.prototype.deleteUser = function (data, func){
    func = this._gen_func(func);
    $.ajax({
        url: url+'admin/ajax/delUser.php',
        type: 'POST',
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
        url: url + 'admin/ajax/update_user.php',
        type: 'POST',
        dataType: 'json',
        data: data,
        beforeSend: func.before,
        complete: func.after,
        success: func.success,
        error: func.error
    });
};

Ajax.prototype.load_image = function(data, func, progress) {
    func = this._gen_func(func);
    var self = this;
    $.ajax({
        url: url + 'admin/ajax/upload_image.php',
        type: 'POST',
        xhr: function() { return self._custom_xhr(progress) },
        beforeSend: func.before,
        success: func.success,
        error: func.error,
        data: data,
        cache: false,
        contentType: false,
        processData: false
    });
};

Ajax.prototype.load_data = function(data, func, progress) {
    func = this._gen_func(func);
    var self = this;
    $.ajax({
        url: url + 'admin/ajax/upload_data.php',
        type: 'POST',
        xhr: function() { return self._custom_xhr(progress) },
        beforeSend: func.before,
        success: func.success,
        error: func.error,
        data: data,
        cache: false,
        contentType: false,
        processData: false
    });
};

Ajax.prototype.get_users = function(from_id, func) {
    func = this._gen_func(func);
    $.ajax({
        url: url + 'ajax/users_info.php',
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        data: {
            from_id: from_id,
            fields: 'photo,descr'
        },
        beforeSend: func.before,
        complete: func.after,
        success: func.success,
        error: func.error
    });
};

Ajax.prototype.search = function(user_name, func) {
    func = this._gen_func(func);
    $.ajax({
        url: url + 'ajax/search.php',
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        data: {
            user_name: user_name,
            fields: 'photo,descr,type_db'
        },
        beforeSend: func.before,
        complete: func.after,
        success: func.success,
        error: func.error
    });
};

Ajax.prototype.load_skin = function(data, func, progress) {
    func = this._gen_func(func);
    var self = this;
    $.ajax({
        url: url + 'admin/ajax/upload_skin.php',
        type: 'POST',
        xhr: function() { return self._custom_xhr(progress) },
        beforeSend: func.before,
        success: func.success,
        error: func.error,
        data: data,
        cache: false,
        contentType: false,
        processData: false
    });
};

Ajax.prototype.list_skins = function(func) {
    func = this._gen_func(func);
    $.ajax({
        url: url + 'admin/ajax/list_skins.php',
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        beforeSend: func.before,
        complete: func.after,
        success: func.success,
        error: func.error
    });
};

Ajax.prototype.test_conn = function(data, func) {
    func = this._gen_func(func);
    $.ajax({
        url: url + 'admin/ajax/test_conn.php',
        type: 'POST',
        dataType: 'json',
        data: data,
        beforeSend: func.before,
        complete: func.after,
        success: func.success,
        error: func.error
    });
};

Ajax.prototype.set_auth_db = function(data, func) {
    func = this._gen_func(func);
    $.ajax({
        url: url + 'admin/ajax/set_auth_db.php',
        type: 'POST',
        dataType: 'json',
        data: data,
        beforeSend: func.before,
        complete: func.after,
        success: func.success,
        error: func.error
    });
};

Ajax.prototype.get_auth_db = function(id, func) {
    func = this._gen_func(func);
    $.ajax({
        url: url + 'admin/ajax/get_auth_db.php',
        type: 'GET',
        dataType: 'json',
        data: {
            id: id
        },
        beforeSend: func.before,
        complete: func.after,
        success: func.success,
        error: func.error
    });
};

Ajax.prototype.select_type_db = function(data, func) {
    func = this._gen_func(func);
    $.ajax({
        url: url + 'admin/ajax/select_type_db.php',
        type: 'POST',
        dataType: 'json',
        data: data,
        beforeSend: func.before,
        complete: func.after,
        success: func.success,
        error: func.error
    });
};

Ajax.prototype.del_skin = function(id, func) {
    func = this._gen_func(func);
    $.ajax({
        url: url + 'admin/ajax/del_skin.php',
        type: 'POST',
        dataType: 'json',
        data: {
            id: id
        },
        beforeSend: func.before,
        complete: func.after,
        success: func.success,
        error: func.error
    });
};

Ajax.prototype.select_skin = function(id, func) {
    func = this._gen_func(func);
    $.ajax({
        url: url + 'admin/ajax/select_skin.php',
        type: 'POST',
        dataType: 'json',
        data: {
            id: id
        },
        beforeSend: func.before,
        complete: func.after,
        success: func.success,
        error: func.error
    });
};

Ajax.prototype.get_user_info = function(id, func) {
    func = this._gen_func(func);
    $.ajax({
        url: url + 'ajax/user_info.php',
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        data: {
            id: id,
            fields: 'photo,descr,type_db'
        },
        beforeSend: func.before,
        complete: func.after,
        success: func.success,
        error: func.error
    });
};

var ajax = new Ajax();