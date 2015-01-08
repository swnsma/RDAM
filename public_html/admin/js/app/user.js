function AppViewModel() {
    var undefined_user = {
        id: null,
        user_name: null,
        city: null,
        descr: null,
        photo: null
    };

    var self = this;
    self.current_user = ko.observable(undefined_user);
    self.active_page = ko.observable(0);
    self.users = ko.observableArray([]);
    self.bd_type=ko.observable(0);

    function genField() {
        return {
            text: ko.observable(''),
            invalid: ko.observable(false)
        };
    };

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
    function find(id) {
        var c = self.users();
        for(var i in c) {
            if (c[i].id === id) return c[i];
        }
        return null;
    };

    self.custom_db = ko.observable({
        port: null,
        server: null,
        user: null,
        name: null,
        pass: null
    });

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
        var c = self.current_user();
        if(!valid.user_name(c.descr)){
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
                self.current_user(new User(data));
                self.curr_oper.info.global('You are updates this information!');
            },
            error: function(error) {
                self.curr_oper.info(error);
                self.curr_oper.info.local.user_name('This name is not free!');
            }
        });
        return false;
    }

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

ko.bindingHandlers.upload_users = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        element = $(element);
        element.click(function() {
            var l = valueAccessor()().length;
            var id = 0;
            if (l != 0) {
                id = valueAccessor()()[l-1].id;
                debugger;
            }
            debugger;
            ajax.get_users(id+1, {
                success: function(data) {
                    if (data.length == 0) {
                        element.remove();
                    } else {
                        for(var i in data) {
                            valueAccessor().push(new User(data[i]));
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
    ko.applyBindings(new AppViewModel());
    $('body').css('display', 'block');
});