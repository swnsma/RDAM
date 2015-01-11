function Validator() {}

Validator.prototype.user_name = function(name) {
//    return /^[\w\d \.\'\-]{1,25}$/.test(name);
    return name.length <= 25 && name.length >= 1;
//    return /^[\w \n\(\)\'\"\d\-]{1,25}$/.test(name);
};

Validator.prototype.city = function(city) {
    return city.length <= 25 && city.length >= 1;
//    return /^[\w \-]{2,25}$/.test(city);
};

Validator.prototype.descr = function(descr) {
    return descr.length <= 1000 && descr.length >= 0;
//    return /^[\w \n\(\)\'\"\d\-]{0,1000}$/.test(descr);
};

Validator.prototype.server = function(server) {
    return /^[a-z\d_\-]{7,30}$/.test(server);
};

Validator.prototype.port = function(port) {
    return port % 1 === 0 && port > 0 && port < 65535;
};

Validator.prototype.password = function(pass) {
    return pass.length >= 4 && pass.length <= 30;
};

Validator.prototype.user = function(user) {
    return /^[a-z\d_]{4,30}$/.test(user);
};

Validator.prototype.name = function(name) {
    return /^[a-z\d_]{4,30}$/.test(name);
};

var valid = new Validator;
