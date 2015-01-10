function getHash() {
    var id = window.location.hash.substring(1);
    return id;
}
function UsersModel() {
    var self=this;

    self.users = ko.observableArray([]);
    self.length=ko.observable(0);
    self.bool_edit=ko.observable(false);
    self.active_page = ko.observable(0);
    self.user = ko.observable({
        id: null,
        user_name: null,
        city: null,
        descr: null,
        photo: null
    });
    self.bd_type=ko.observable(0);
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
        },
        photo:{
            global:ko.observable('')
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
            before: function() {
                pp.css('display', 'block');
            },
            after: function() {
                pp.css('display', 'none');
            }
        });
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
    self.save_photo = function() {
        var pp = $('#photoProgress');
        ajax.load_image(
            new FormData(document.getElementById('formPhoto')),
            {
                success: function(data) {

                    self.curr_oper.photo.global('You are uploaded photo!');
                },
                error: function(error) {
                    alert(error);
                },
                before: function() {
                    pp.css('display', 'block');
                    self.curr_oper.photo.global('');
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
    self.save_info = function() {
        clear_curr_oper(self.curr_oper);
        self.valid.city(false);
        self.valid.description(false);
        self.valid.user_name(false);
        var c = self.user();
        if(!valid.descr(c.descr)){
            self.curr_oper.info.local.description('this description has more than 1000 letters');
            self.valid.description(true);
            return false;
        }
        if(!valid.user_name(c.user_name)){
            self.curr_oper.info.local.user_name('this name has less than 1 letters or more than 25 letters');
            self.valid.user_name(true);
            return false;
        }
        if(!valid.city(c.city)){
            self.curr_oper.info.local.city('field is not filled');
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
                self.curr_oper.info.global('You are update this information!');
            },
            error: function(error) {
                self.curr_oper.info(error);
                self.curr_oper.info.local.user_name('This name is not free!');
            }
        });
        return false;
    };
    function get_data(id) {
        if (id() == null) {
            alert('undefined user');
        } else {
            var id=id();
            if(id.slice(0,4)==='edit'){
                var id=id.slice(4);
                self.bool_edit(true);
            }

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


    self.to_edit=function(root){
        self.bool_edit(true);
        changePage('users','edit'+root.id);
    }

    get_data(getHash);

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
        var name =valueAccessor();
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
ko.bindingHandlers.upload_users = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        element = $(element);
        element.click(function() {
            var l = valueAccessor()().length;
            var id = 0;
            if (l != 0) {
                id = valueAccessor()()[l-1].id;
            }
            ajax.get_users(+id+1, {
                success: function(data) {
                    viewModel.length(data.length);
                    if (data.length == 0) {
                        element.remove();
                    } else {
                        for(var i in data) {
                            valueAccessor().push(new User(data[i]));
                        }

                        var id = getHash();
                        if(id.slice(0,4)==='edit'){
                            var id=id.slice(4);
                        }
                        if (id !== null) {
                            $(document.body).animate({
                                'scrollTop':   $('#scroll' + id).offset().top
                            }, 0);
                        }
                    }

                },
                error: function(message) {
                    alert(message);
                }
            });
        });
        element.click();

    }
};

ko.bindingHandlers.description = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var text = valueAccessor();
        element = $(element);
        if (text.length > 300) {
            var small_text = text.substr(0, 300) + '... ';
            var el = $('<span>');
            el.text(small_text);
            el.appendTo(element);
            var op = $('<a>').attr('href', '#').text('more').click(function() {
                element.text(text);
                return false;
            });
            op.appendTo(element);
        } else {
            element.text(text);
        }
    }
};


$(document).ready(function () {
    ko.applyBindings(new UsersModel());
});