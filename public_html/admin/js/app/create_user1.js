/**
 * Created by Таня on 11.01.2015.
 */
function CreateUser() {
    var self = this;
    self.active_page = {
        active:ko.observable(0),
        max_active:ko.observable(0)
    }
    function genField() {
        return {
            text: ko.observable(''),
            invalid: ko.observable(false)
        };
    }

    self.custom_db = ko.observable(new Db({
        id: '',
        db_port: '',
        db_server: '',
        db_user: '',
        db_name: '',
        db_pass: ''
    }));

    self.save_photo = function() {
        var pp = $('#photoProgress');
        ajax.load_image(
            new FormData(document.getElementById('formPhoto')),
            {
                success: function(data) {
//                    alert('good');
                    self.curr_operation.global('Photo was successfully uploaded');
                    self.active_page.active(2);
                    self.active_page.max_active(2);
                    clear_operation(self.curr_operation);
//                    self.curr_oper.photo.global('You are uploaded photo!');
                },
                error: function(error) {
                    alert(error);
                },
                before: function() {
                    self.curr_operation.global('User is being created');
                    pp.css('display', 'block');
//                    self.curr_oper.photo.global('');
                },
                after: function() {
                    pp.css('display', 'none');
                }
            },
            function(e) {
                if(e.lengthComputable){
                    pp.attr({
                        value: e.loaded,
                        max: e.total
                    });
                }
            }
        );
        return false;
    };


    this.user_name = genField();
    this.descr = genField();
    function clear(some_t){
        some_t.text('');
        some_t.invalid(false);
    }
    this.clear = function(){
        clear(self.user_name);
        clear(self.descr);
        clear_operation(self.curr_operation);
        return false;

    };
    self.user = ko.observable({
        id: null,
        user_name: null,
        descr: null,
        photo: null,
        type_bd:false
    });
    this.create = function() {
        var user_name = self.user_name.text();
        var descr = self.descr.text();
        clear_operation(self.curr_operation);
        if (valid.user_name(user_name)) {
            self.user_name.invalid(false);
            if (valid.descr(descr)) {
                self.descr.invalid(false);
                                ajax.create_user({
                                    user_name: user_name,
                                    descr: descr
                                }, {
                                    before: function() {
                                        self.curr_operation.global('User is being created');
                                    },
                                    success: function(data) {
                                        self.user().id=data.id;
                                        self.curr_operation.global('User was successfully created');
                                        self.active_page.active(1);
                                        self.active_page.max_active(1);
                                        clear_operation(self.curr_operation);
                                    },
                                    error: function(error) {
                                        if(error==='Username is already in use. Please try another one'){
                                            self.curr_operation.local.user_name(error);
                                        }else{
                                            debugger;
                                            alert(error);
                                        }
                                        self.user_name.invalid(true);
                                        self.curr_operation.global('');
                                    }
                                });

            } else {
                self.curr_operation.local.description('Description is too long. It should be 1000 characters or less');
                self.descr.invalid(true);
                self.curr_operation.global('');
            }
        } else {
            if(user_name.length>=25) {
                self.curr_operation.local.user_name('User name is too long. It should be 25 characters or less');
            }else{
                self.curr_operation.local.user_name('User name cannot be empty');
            }
            self.user_name.invalid(true);
            self.curr_operation.global('');
        }
        return false;
    };
    this.curr_operation = {
        global:ko.observable(''),
        local: {
            user_name: ko.observable(''),
            description: ko.observable('')
        }
    };
    function clear_operation(some_op){
        some_op.global('');
        some_op.local.user_name('');
        some_op.local.description('');
    }
    self.change_db_type = function(type) {
        ajax.select_type_db({
            id: self.user().id,
            type: type
        }, {
            success: function(data) {
                //alert('type changed')
            },
            error: function(message) {
                alert(message);
            },
            after: function() {

            },
            before: function() {

            }
        })
    };
    self.save_data = function() {
        var pp = $('#dataProgress');
        ajax.load_data(
            new FormData(document.getElementById('formData')),
            {
                success: function(data) {
                    changePage('users',self.user().id);
                },
                error: function(error) {
                    alert(error);
                },
                before: function() {
                    pp.css('display', 'block');
                },
                after: function() {
                    pp.css('display', 'none');
                }
            },
            function(e) {
                if(e.lengthComputable){
                    pp.attr({
                        value: e.loaded,
                        max: e.total
                    });
                }
            }
        );
        return false;
    };
    function Db(data) {
        this.id = data.id;
        this.port = data.db_port || 3306;
        this.server = data.db_server || '';
        this.user = data.db_user || '';
        this.name = data.db_name || '';
        this.pass = data.db_password || '';
    }

    self.valid_custom_db = {
        port: ko.observable('3306'),
        server: ko.observable(''),
        user: ko.observable(''),
        name: ko.observable(''),
        pass: ko.observable('')
    };

    function valid_custom_db_reset() {
        self.valid_custom_db.port(false);
        self.valid_custom_db.server(false);
        self.valid_custom_db.user(false);
        self.valid_custom_db.name(false);
        self.valid_custom_db.pass(false);
    }

    function check_valid_db_fields() {

        valid_custom_db_reset();
        debugger;
        var data = self.custom_db();
        if (!valid.server(data.server)) {
            self.valid_custom_db.server(true);
            return false;
        }
        if (!valid.port(data.port)) {
            self.valid_custom_db.port(true);
            return false;
        }
        if (!valid.name(data.name)) {
            self.valid_custom_db.name(true);
            return false;
        }
        if (!valid.user(data.user)) {
            self.valid_custom_db.user(true);
            return false;
        }
        if (!valid.password(data.pass)) {
            self.valid_custom_db.pass(true);
            return false;
        }
        return true;
    }

    self.set_auth = function() {
        if (!check_valid_db_fields()) return;
        ajax.set_auth_db(self.custom_db(), {
            success: function(data) {
                alert('updated');
                changePage('users',self.user().id);
            },
            error: function(message) {
                alert(message);
            },
            after: function() {

            },
            before: function() {

            }
        });
    };
    self.test_connection = function() {
        if (!check_valid_db_fields()) return;
        ajax.test_conn(self.custom_db(), {
            success: function(data) {
                if (data.status == 'success') {
                    alert('success');
                } else {
                    alert('failed');
                }
            },
            error: function(message) {
                alert(message);
            },
            before: function() {

            },
            after: function() {

            }
        });
    };

    self.bd_type=ko.observable(0);
    ko.bindingHandlers.typedb = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext){
            element = $(element);
            var type = valueAccessor();

            function create_input(name, type, select) {
                var label = $('<label>')
                var span = $('<span>').text(name);
                var input = $('<input type="radio">').attr({
                    name: 'tdb',
                    checked: select
                });

                label.append(input);
                label.append(span);
                element.append(label);
                input.click(function() {
                    viewModel.change_db_type(type);
                    $('#act_' + select).slideDown(); $('#act_' + !select).slideUp();
                });
            }

            /*create_input('Default database', 0, type);
             create_input('External database', 1, !type);
             $('#act_' + type).slideDown(); $('#act_' + !type).slideUp();*/

            create_input('Default database', 0, !type);
            create_input('External database', 1, type);
            $('#act_' + !type).slideDown(); $('#act_' + type).slideUp();
        }
    };
}

$(document).ready(function() {
    ko.applyBindings(new CreateUser());
});
