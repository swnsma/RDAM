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
        id: null,
        db_port: null,
        db_server: null,
        db_user: null,
        db_name: null,
        db_pass: null
    }));

    self.save_photo = function() {
        var pp = $('#photoProgress');
        ajax.load_image(
            new FormData(document.getElementById('formPhoto')),
            {
                success: function(data) {
//                    alert('good');
                    self.active_page.active(2);
                    self.active_page.max_active(2);
//                    self.curr_oper.photo.global('You are uploaded photo!');
                },
                error: function(error) {
                    alert(error);
                },
                before: function() {
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
    this.city = genField();
    this.descr = genField();
    function clear(some_t){
        some_t.text('');
        some_t.invalid(false);
    }
    this.clear = function(){
        clear(self.user_name);
        clear(self.city);
        clear(self.descr);
        clear_operation(self.curr_operation);
        return false;

    };
    self.user = ko.observable({
        id: null,
        user_name: null,
        city: null,
        descr: null,
        photo: null,
        type_bd:false
    });
    this.create = function() {
        var user_name = self.user_name.text();
        var city = self.city.text();
        var descr = self.descr.text();
        clear_operation(self.curr_operation);
        if (valid.user_name(user_name)) {
            self.user_name.invalid(false);
            if (valid.descr(descr)) {
                self.descr.invalid(false);
                if (valid.city(city)) {
                    self.city.invalid(false);

                    ajax.check_exists_city(city, {
                        before: function() {
                            self.curr_operation.global('check the relevance of the city');
                        },
                        success: function(status) {
                            if (status) {
                                ajax.create_user({
                                    user_name: user_name,
                                    city: city,
                                    descr: descr
                                }, {
                                    before: function() {
                                        self.curr_operation.global('the process of creating user');
                                    },
                                    success: function(data) {
                                        debugger;
                                        self.user().id=data.id;
                                        self.curr_operation.global('You Create new User!');
                                        self.active_page.active(1);
                                        self.active_page.max_active(1);

                                    },
                                    error: function(error) {
                                        self.curr_operation.local.user_name('this name is not free. But if you believe that this name is free, then reload the page');
                                        self.user_name.invalid(true);
                                        self.curr_operation.global('');
                                    }
                                });
                            } else {
                                self.curr_operation.local.city('this city isn\'t supported');
                                self.curr_operation.global('');
                            }
                        },
                        error: function(error) {
                            self.curr_operation.local.city('can\'t get the data. try again later');

                        }
                    });

                } else {
                    self.curr_operation.local.city('field is not filled!');
                    self.city.invalid(true);
                    self.curr_operation.global('');
                }
            } else {
                self.curr_operation.local.description('this description has more than 1000 letters');
                self.descr.invalid(true);
                self.curr_operation.global('');
            }
        } else {
            self.curr_operation.local.user_name('this name has less than 1 letters or more than 25 letters');
            self.user_name.invalid(true);
            self.curr_operation.global('');
        }
        return false;
    };
    this.curr_operation = {
        global:ko.observable(''),
        local: {
            user_name: ko.observable(''),
            city: ko.observable(''),
            description: ko.observable('')
        }
    };
    function clear_operation(some_op){
        some_op.global('');
        some_op.local.user_name('');
        some_op.local.city('');
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
        this.port = data.db_port;
        this.server = data.db_server;
        this.user = data.db_user;
        this.name = data.db_name;
        this.pass = data.db_password;
    }
//    function get_data(id) {
//        if (id == null) {
//            alert('undefined user');
//        } else {
//
//            ajax.get_user_info(id, {
//                success: function(data) {
//                    self.user(new User(data[0]));
//                },
//                error: function(message) {
//
//                },
//                after: function() {
//
//                },
//                before: function() {
//
//                }
//            });
//            ajax.get_auth_db(id, {
//                success: function(data) {
//                    console.log(data[0]);
//                    self.custom_db(new Db(data[0]));
//                },
//                error: function(message) {
//
//                },
//                after: function() {
//
//                },
//                before: function() {
//
//                }
//            });
//        }
//    }
//    get_data(self.user().id);

    self.valid_custom_db = {
        port: ko.observable(false),
        server: ko.observable(false),
        user: ko.observable(false),
        name: ko.observable(false),
        pass: ko.observable(false)
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
