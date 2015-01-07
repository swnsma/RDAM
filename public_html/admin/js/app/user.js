function AppViewModel() {
    var undefined_user = {
        id: ko.observable(),
        user_name: ko.observable(),
        city: ko.observable(),
        descr: ko.observable(),
        photo: ko.observable()
    };

    var self = this;
    self.current_user = ko.observable(undefined_user);
    self.active_page = ko.observable(0);
    self.users = ko.observableArray([]);
    self.bd_type=ko.observable(0);

    self.curr_oper = {
        info: ko.observable('')
    };

    function find(id) {
        var c = self.users();
        for(var i in c) {
            if (c[i].id() === id) return c[i];
        }
        return null;
    }

    self.save_data = function() {
        ajax.load_data(
            new FormData(document.getElementById('formData')),
            {
                success: function(data) {
                    alert('data updated. Inserted ' + data.insert_rows + ' new records')
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
                    alert('image updated' + data)
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
        var c = self.current_user();
        ajax.update_user_info({
            id: c.id(),
            user_name: c.user_name(),
            city: c.city(),
            descr: self.current_user().descr()
        }, {
            before: function() {
                self.curr_oper.info('the process of updating user');
            },
            after: function() {
                self.curr_oper.info('');
            },
            success: function(data) {
                console.log(data);
                var cc = find(data.id);
                if (cc !== null) {
                    cc.city(data.city);
                    cc.user_name(data.user);
                    cc.descr(data.descr);
                    self.current_user(cc);
                    alert(132);
                }
            },
            error: function(error) {
                self.curr_oper.info(error);
            }
        });
        self.curr_oper.info('');
        return false;
    }

}

function User(user){
    this.id = ko.observable(user.id);
    this.user_name = ko.observable(user.user);
    this.city = ko.observable(user.city);
    if (user.photo) {
        this.photo = ko.observable('../cdn/users/' + user.photo);
    } else {
        this.photo = ko.observable('../cdn/general/default_avatar.jpg');
    }
    this.descr = ko.observable(user.descr);
}

ko.bindingHandlers.upload_users = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        element = $(element);
        element.click(function() {
            var l = valueAccessor()().length;
            var id = 0;
            if (l != 0) {
                id = valueAccessor()()[l-1].id;
            }
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