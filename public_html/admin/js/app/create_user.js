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

    var self = this;
    this.create = function() {
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
                                
                                ajax.create_user({
                                        user_name: user_name,
                                        city: city,
                                        descr: descr
                                    }, {
                                        before: function() {
                                            self.curr_operation('the process of creating user');
                                        },
                                        success: function(data) {

                                        },
                                        error: function(error) {
                                            self.curr_operation(error);
                                            self.user_name.invalid(true);
                                        }
                                    });
                            } else {
                                self.curr_operation('this city isn\'t supported');
                            }
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
    };

    this.curr_operation = ko.observable('');
}

$(document).ready(function() {
    ko.applyBindings(new CreateUser());
});