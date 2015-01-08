function EditModel() {
    var self = this;

    self.user = ko.observable({
        id: null,
        user_name: null,
        city: null,
        descr: null,
        photo: null
    });

    self.bd_type=ko.observable(0);

    function getUserDefined() {
        var id = window.location.hash.substring(1);
        if (id == parseInt(id)) {
            return id;
        } else {
            return null;
        }
    }

    function genField() {
        return {
            text: ko.observable(''),
            invalid: ko.observable(false)
        };
    }

    self.valid={
        user_name:ko.observable(false),
        description:ko.observable(false),
        city:ko.observable(false)
    };
    self.curr_oper = {
        info:{
            global:ko.observable(),
            local: {
                user_name: ko.observable(''),
                description:ko.observable(''),
                city:ko.observable('')
            }
        }
    };
    function clear_curr_oper(curr_oper){
        curr_oper.info.global('');
        curr_oper.info.local.user_name('');
        curr_oper.info.local.description('');
        curr_oper.info.local.city('');
    }

    self.custom_db = ko.observable(new Db({
        id: null,
        db_port: null,
        db_server: null,
        db_user: null,
        db_name: null,
        db_pass: null
    }));

    self.set_auth = function() {
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
            after: function() {

            },
            before: function() {

            }
        });
    };

    self.save_data = function() {
        ajax.load_data(
            new FormData(document.getElementById('formData')),
            {
                success: function(data) {
                    console.log(data);
                },
                error: function(error) {
                    alert(error);
                },
                before: function() {

                },
                after: function() {

                }
            },
            function(e) {}
        );
        return false;
    };

    self.save_photo = function() {
        ajax.load_image(
            new FormData(document.getElementById('formPhoto')),
            {
                success: function(data) {
                    console.log(data);
                },
                error: function(error) {
                    alert(error);
                },
                before: function() {

                },
                after: function() {

                }
            },
            function(e) {}
        );
        return false;
    };

    self.save_info = function() {
        clear_curr_oper(self.curr_oper);
        self.valid.city(false);
        self.valid.description(false);
        self.valid.user_name(false);
        var c = self.user();
        if(!valid.descr(c.descr)){
            self.curr_oper.info.global('Error');
            self.curr_oper.info.local.description('this is not vas');
            self.valid.description(true);
            return false;
        }
        if(!valid.user_name(c.user_name)){
            self.curr_oper.info.global('Error');
            self.curr_oper.info.local.user_name('this is not vas');
            self.valid.user_name(true);
            return false;
        }
        if(!valid.city(c.city)){
            self.curr_oper.info.global('Error');
            self.curr_oper.info.local.city('this is not vas');
            self.valid.city(true);
            return false;
        }
        ajax.update_user_info({
            id: c.id,
            user_name: c.user_name,
            city: c.city,
            descr: c.descr
        }, {
            before: function() {
                self.curr_oper.info.global('the process of updating user');
            },
            after: function() {

            },
            success: function(data) {
                self.user(new User(data));
                self.curr_oper.info.global('You are updates this information!');
            },
            error: function(error) {
                self.curr_oper.info(error);
                self.curr_oper.info.local.user_name('This name is not free!');
            }
        });
        return false;
    };



    function get_data(id) {
        if (id == null) {
            alert('undefined user');
        } else {
            ajax.get_user_info(id, {
                success: function(data) {
                    self.user(new User(data[0]));
                },
                error: function(message) {

                },
                after: function() {

                },
                before: function() {

                }
            });
            ajax.get_auth_db(id, {
                success: function(data) {
                    console.log(data[0]);
                    self.custom_db(new Db(data[0]));
                },
                error: function(message) {

                },
                after: function() {

                },
                before: function() {

                }
            });
        }
    }

    get_data(getUserDefined);
}

function User(user){
    this.id = user.id;
    this.user_name = user.user;
    this.city = user.city;
    if (user.photo) {
        this.photo = '../cdn/users/' + user.photo;
    } else {
        this.photo = '../cdn/general/default_avatar.jpg';
    }
    this.descr = user.descr;
}

function Db(data) {
    this.id = data.id;
    this.port = data.db_port;
    this.server = data.db_server;
    this.user = data.db_user;
    this.name = data.db_name;
    this.pass = data.db_password;
}

ko.bindingHandlers.animation={
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext){
        var name =element.id.substr(0,element.id.length-6);
        $(element)
            .on('click',function(){
                if($('#'+name).css('display')==='none'){
                    $('#'+name)
                        .slideDown();
                }
                else{
                    $('#'+name)
                        .slideUp();
                }
            })
    }
};

$(document).ready(function () {
    ko.applyBindings(new EditModel());
    $('body').css('display', 'block');
});
