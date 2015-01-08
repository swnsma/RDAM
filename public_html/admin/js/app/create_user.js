function CreateUser() {
    function genField() {
        return {
            text: ko.observable(''),
            invalid: ko.observable(false)
        };
    }

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

    }
    var self = this;
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
                                            self.curr_operation.global('You Create new User!');
                                            var w = window.location;
                                            w.replace(w.protocol + '//' + w.hostname + ':' + w.port + '/admin/edit.html#' + data.id);
                                        },
                                        error: function(error) {
                                            self.curr_operation.local.user_name('this name is not free');
                                            self.user_name.invalid(true);
                                            self.curr_operation.global('Error');
                                        }
                                });
                            } else {
                                self.curr_operation.local.city('this city isn\'t supported');
                                self.curr_operation.global('Error');
                            }
                        },
                        error: function(error) {
                            self.curr_operation.global('can\'t get the data. try again later');
                            self.curr_operation.global('Error');
                        }
                    });

                } else {
                    self.curr_operation.local.city('this is not val');
                    self.city.invalid(true);
                }
            } else {
                self.curr_operation.local.description('this is not val');
                self.descr.invalid(true);
            }
        } else {
            self.curr_operation.local.user_name('this is not val');
            self.user_name.invalid(true);
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
}

$(document).ready(function() {
    ko.applyBindings(new CreateUser());
});