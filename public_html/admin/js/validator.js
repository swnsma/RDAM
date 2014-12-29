function Validator() {}

Validator.prototype.user_name = function(name) {
    return /^[\w \.\'\-]{8,25}$/.test(name);
};

Validator.prototype.city = function(city) {
    return /^[\w \-]{8,25}$/.test(city);
};

Validator.prototype.descr = function(descr) {
    return /^[\w \n\(\)\'\"\d\-]{30,300}$/.test(descr);
};

var valid = new Validator;

console.log(valid.user_name('auseCrddfdfdfd'));
