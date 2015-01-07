function Validator() {}

Validator.prototype.user_name = function(name) {
//    return /^[\w\d \.\'\-]{1,25}$/.test(name);
    return name.length <= 25 && name.length >= 1;
//    return /^[\w \n\(\)\'\"\d\-]{1,25}$/.test(name);
};

Validator.prototype.city = function(city) {
    return city.length <= 25 && city.length >= 2;
//    return /^[\w \-]{2,25}$/.test(city);
};

Validator.prototype.descr = function(descr) {
    return descr.length <= 1000 && descr.length >= 0;
//    return /^[\w \n\(\)\'\"\d\-]{0,1000}$/.test(descr);
};

var valid = new Validator;
