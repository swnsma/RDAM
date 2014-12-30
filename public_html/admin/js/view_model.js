/**
 * Created by Таня on 28.12.2014.
 */

function InfoUser() {
    function genField() {
        return {
            text: ko.observable(''),
            invalid: ko.observable(false)
        };
    }

    this.user_name = genField();
    this.city = genField();
    this.descr = genField();

    this.curr_operation = ko.observable('');
}

function UpdateUser(user) {
    var self = this;
    InfoUser.call(self);

    self.id = ko.observable(user.id);
    self.user_name.text(user.user_name);
    self.city.text(user.city);
    self.descr.text(user.descr);

    self.update_image = function() {
        var a =document.getElementById('formData');
        alert(a);

        debugger;
        ajax.load_image(
            new FormData(a),
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
        var a =document.getElementById('formData');
        alert(a);
        ajax.load_data(

            new FormData(a),
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
        if (valid.user_name(self.user_name.text())) {
            self.user_name.invalid(false);
            if (valid.descr(self.descr.text())) {
                self.descr.invalid(false);
                var city = self.city.text();
                if (valid.city(city)) {
                    self.city.invalid(false);
                    ajax.check_exists_city(city, {
                        before: function() {
                            self.curr_operation('check the relevance of the city');
                        },
                        success: function(status) {
                            if (status) {
                                ajax.update_user_info({
                                    id: self.id(),
                                    user_name: self.user_name.text(),
                                    city: self.city.text(),
                                    descr: self.descr.text()
                                }, {
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

function CreateUser() {
    var self = this;

    InfoUser.call(self);

    self.send = function() {
        if (valid.user_name(self.user_name.text())) {
            self.user_name.invalid(false);
            if (valid.descr(self.descr.text())) {
                self.descr.invalid(false);
                var city = self.city.text();
                if (valid.city(city)) {
                    self.city.invalid(false);
                    ajax.check_exists_city(city, {
                        before: function() {
                            self.curr_operation('check the relevance of the city');
                        },
                        success: function(status) {
                            if (status) {
                                ajax.create_user({
                                    user_name: self.user_name.text(),
                                    city: self.city.text(),
                                    descr: self.descr.text()
                                }, {
                                    before: function() {
                                        self.curr_operation('the process of creating user');
                                    },
                                    after: function() {

                                    },
                                    success: function(data) {
                                        alert('user created id = ' + data.id);
                                    },
                                    error: function(error) {
                                        self.curr_operation(error);
                                    }
                                });

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
        return false;
    }
}

function AppViewModel() {
    var self = this;

    self.active_page = ko.observable(0);

    self.users = ko.observableArray([]);

    this.current_user=ko.observable(new CurrentUser({
        id: null,
        user_name: null,
        city: null,
        descr: null,
        photo: null
    }));

    self.create_user = ko.observable(new CreateUser);
    self.update_user = ko.observable(new UpdateUser({
        id: null,
        user_name: null,
        city: null,
        descr: null,
        photo: null
    }));

    self.edit = function(user) {
        self.update_user(new UpdateUser(user));
        self.active_page(3);
    }
}

$(document).ready(function () {
    var appVievM = new AppViewModel();
    ko.applyBindings(appVievM);
    getUsers(appVievM.users, analyze_function);
});

function User_class(id, name, color, city, photo, descr){
    this.id = id;
    this.user_name = name;
    this.color = color;
    this.city = city;
    if (photo) {
        this.photo = '../cdn/users/' + photo;
    } else {
        this.photo = '../cdn/general/default_avatar.jpg';
    }
    this.descr = descr;
}

function analyze_function(response,self){
    if (response && response.data && response.data.length) {
        var mappedTasks = [];
        for (var i = 0; i < response.data.length; i++)
        {
            var a = response.data[i];
            var j = i % masColor.length;
            var b = new User_class(a.id,a.user,masColor[j],a.city, a.photo, a.descr);
            mappedTasks.push(b);
        }
        self(mappedTasks);
    }
}

