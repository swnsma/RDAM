function Validator() {}

Validator.prototype.user_name = function(name) {
    return /^[\w\d \.\'\-]{1,25}$/.test(name);
//    return /^[\w \n\(\)\'\"\d\-]{1,25}$/.test(name);
};

Validator.prototype.city = function(city) {
    return /^[\w \-]{2,25}$/.test(city);
};

Validator.prototype.descr = function(descr) {
    return /^[\w \n\(\)\'\"\d\-]{0,1000}$/.test(descr);
};

var valid = new Validator;
