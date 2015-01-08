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

function getUserDefined() {
    var id = window.location.hash.substring(1);
    if (id == parseInt(id)) {
        return id;
    } else {
        return null;
    }
}

function changePage(page, id) {
    var w = window.location;
    w.replace(w.protocol + '//' + w.hostname + ':' + w.port + '/admin/' + page + '.html#' + id);
}

$(window).bind('hashchange', function() {
    location.reload();
});