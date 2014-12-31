/**
 * Created by Таня on 28.12.2014.
 */

function InfoUser() {
    var self = this;

    function genField() {
        return {
            text: ko.observable(''),
            invalid: ko.observable(false)
        };
    }

    self._form_validation = function(func) {
        var user_name = self.user_name.text();
        var city = self.city.text();
        var descr = self.descr.text();
        if (valid.user_name(user_name)) {
            self.user_name.invalid(false);
            if (valid.descr(descr)) {
                self.descr.invalid(false);
                if (valid.city(city)) {
                    self.city.invalid(false);
                    ajax.check_exists_city(city, {
                        before: function() {
                            self.curr_operation('check the relevance of the city');
                        },
                        success: function(status) {
                            if (status) {
                                var d = {
                                    user_name: user_name,
                                    city: city,
                                    descr: descr
                                };
                                func(d);
                            } else {
                                self.curr_operation('this city isn\'t supported');
                            }
                        },
                        after: function() {

                        },
                        error: function(error) {
                            self.curr_operation('can\'t get the data. try again later');
                        }
                    });
                } else {
                    self.city.invalid(true);
                }
            } else {
                self.descr.invalid(true);
            }
        } else {
            self.user_name.invalid(true);
        }
    };

    self.user_name = genField();
    self.city = genField();
    self.descr = genField();
    self.curr_operation = ko.observable('');
}

function UpdateUser(user) {
    var self = this;

    InfoUser.call(self);

    self.id = ko.observable(user.id);
    self.user_name.text(user.user_name);
    self.city.text(user.city);
    self.descr.text(user.descr);

    self.update_image = function() {
        ajax.load_image(
            new FormData(document.getElementById('formPhoto')),
            {
                success: function(data) { console.log(data); },
                error: function(error) { console.log(error); },
                before: function() { console.log('before'); },
                after: function() { console.log('after'); }
            },
            function () {}
        );
    };

    self.update_data = function() {
        ajax.load_data(
            new FormData(document.getElementById('formData')),
            {
                success: function(data) { console.log(data); },
                error: function(error) { console.log(error); },
                before: function() { console.log('before'); },
                after: function() { console.log('after'); }
            },
            function () {}
        );
    };

    self.update_info = function() {
        self._form_validation(function(d) {
            d.id = self.id();
            ajax.update_user_info(d, {
                before: function() {
                    self.curr_operation('the process of creating user');
                },
                after: function() {

                },
                success: function(data) {
                    alert('user update ' + JSON.stringify(data));
                },
                error: function(error) {
                    self.curr_operation(error);
                }
            });
        });

        return false;
    }
}

function CurrentUser(user) {
    this.id = user.id;
    this.user_name = user.user_name;
    this.city = user.city;
    this.photo = user.photo;
    this.descr = user.descr;
}

function CreateUser(func) {
    var self = this;

    InfoUser.call(self);

    self.send = function() {
        self._form_validation(function(d) {
            ajax.create_user(d, {
                before: function() {
                    self.curr_operation('the process of creating user');
                },
                after: function() {

                },
                success: function(data) {
                    d.id = data.id;
                    d.photo = null;
                    func(d);
                },
                error: function(error) {
                    self.curr_operation(error);
                }
            });
        });

        return false;
    }
}

function AppViewModel() {
    var undefined_user = {
        id: null,
        user_name: null,
        city: null,
        descr: null,
        photo: null
    };

    var self = this;

    self.active_page = ko.observable(0);

    self.users = ko.observableArray([]);
    self.search_users = ko.observableArray([]);

    self.search_active = ko.observable(false);
    self.search_disable = function() {
        self.search_users([]);
        self.search_active(false);
        self.current_user(new CurrentUser(undefined_user));
        self.active_page(0);
    };

    self.current_user=ko.observable(new CurrentUser(undefined_user));

    self.create_user = ko.observable(new CreateUser(function(user) {
        self.users.push(user);
        self.current_user(new CurrentUser(user));
        self.active_page(2);
    }));

    self.update_user = ko.observable(new UpdateUser(undefined_user));

    self.edit = function(user) {
        self.update_user(new UpdateUser(user));
        self.active_page(3);
    };
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

ko.bindingHandlers.search = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        element.innerHTML = '<input type="text" id="textSearch" /> ' +
            '<button type="button" id="buttonSearch"/>search</button>';
        var ts = $('#textSearch');
        var bs = $('#buttonSearch');
        ts.keypress(function(e){
            viewModel.search_active(true);
            if(e.keyCode == 13) {
                bs.click();
            }
        });
        bs.click(function() {
            viewModel.search_active(true);
            var user_name = ts.val();
            if (valid.user_name(user_name)) {
                ts.removeAttr('invalid');
                ajax.search(user_name, {
                    success: function(data) {
                        for(var i in data) {
                            valueAccessor().push(new User(data[i]));
                        }
                    },
                    error: function(message) {
                        alert(message);
                    }
                });
            } else {
                ts.attr('invalid', 'true');
            }
        });
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

$(document).ready(function () {
    ko.applyBindings(new AppViewModel());
});

