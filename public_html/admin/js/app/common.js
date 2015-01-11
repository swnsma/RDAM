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
    this.type_db = user.type_db == 0 ? false : true;
}

function getUserDefined() {
    var id = window.location.hash.substring(1);
    if (id == parseInt(id)) {
        return id;
    } else {
        return null;
    }
}


ko.bindingHandlers.newtooltip = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        element = $(element);
        var message = $('<div>').html(valueAccessor()).addClass('newtooltip').insertBefore(element);
        var flag = true;
        message.mouseover(function() {
            flag = false;
        }).mouseout(function() {
            if (flag) {
                message.css('display', 'none');
            } else {
                flag = true;
            }
        });
        message.click(function() {
            flag = true;
        });
        element.focusin(function() {
            message.css('display', 'block');
        }).focusout(function() {
            if (flag) {
                message.css('display', 'none');
            }
        });
    }
};

function changePage(page, id) {
    var w = window.location;
    w.replace(w.protocol + '//' + w.hostname + ':' + w.port + '/admin/' + page + '.html#' + id);
}

$(window).bind('hashchange', function() {
    location.reload();
});