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
        var pp = $('#photoProgress');
        ajax.load_image(
            new FormData(document.getElementById('formPhoto')),
            {
                success: function(data) {
                    alert('image updated')
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
    };

    self.update_data = function() {
        var pd = $('#photoData');
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
                    pd.css('display', 'block');
                },
                after: function() {
                    pd.css('display', 'none');
                }
            },
            function(e) {
                if(e.lengthComputable){
                    $('#dataProgress').attr({
                        value: e.loaded,
                        max: e.total
                    });
                }
            }
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
    this.id = ko.observable(user.id);
    this.user_name = ko.observable(user.user_name);
    this.city = ko.observable(user.city);
    this.photo = ko.observable(user.photo);
    this.descr = ko.observable(user.descr);
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

    self.update_user = ko.observable(new UpdateUser(undefined_user, self));

    self.edit = function(user) {
        self.update_user(new UpdateUser(user, self));
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
        element.innerHTML = '<div class="table st">' +
            '<div class="table-row"><div class="table-cell cts">' +
            '<input type="text" id="textSearch" />' +
            '</div><div class="table-cell cbs"><button type="button" id="buttonSearch"/>search</button></div></div>' +
            '<div id="searchInfo"></div>';
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
                var si = $('#searchInfo');
                ajax.search(user_name, {
                    before: function() {
                        si.text('please. wait...');
                    },
                    success: function(data) {
                        if (data.length == 0) {
                            si.text('on the search didn\'t match');
                        } else {
                            for(var i in data) {
                                valueAccessor().push(new User(data[i]));
                            }
                        }
                    },
                    error: function(message) {
                        si.text('error: ' + message);
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
    $('body').css('display', 'block');
});

