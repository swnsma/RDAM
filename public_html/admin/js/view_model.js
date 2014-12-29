/**
 * Created by Таня on 28.12.2014.
 */

function CreateUser() {
    var self = this;

    function genField() {
        return {
            text: ko.observable(''),
            invalid: ko.observable(false)
        };
    }

    self.user_name = genField();
    self.city = genField();
    self.descr = genField();

    self.curr_operation = ko.observable('');

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

    self.current_user=ko.observable();

    self.create_user = ko.observable(new CreateUser);
}

$(document).ready(function () {
    var appVievM = new AppViewModel();
    ko.applyBindings(appVievM);
    getUsers(appVievM.users, analyze_function);
});

function User_class(id,name,color,city,photo,desc){
    this.id=id;
    this.name=name;
    this.color=color;
    this.city=city;
    this.photo=photo;
    this.desc=desc;
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

