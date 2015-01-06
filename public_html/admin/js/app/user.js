function AppViewModel() {
    var undefined_user = {
        id: null,
        user_name: null,
        city: null,
        descr: null,
        photo: null
    };

    var self = this;
    self.current_user=ko.observable(undefined_user);
    self.active_page = ko.observable(0);
    self.users = ko.observableArray([]);
    self.bd_type=ko.observable(0);

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

ko.bindingHandlers.animation={
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext){
        var name =element.id.substr(0,element.id.length-6);
        $('#edit1').css({
            'display':'none'
        });
        $('#edit2').css({
            'display':'none'
        });
        $('#edit3').css({
            'display':'none'
        });
        $('#edit4').css({
            'display':'none'
        });
        $(element)
            .on('click',function(){
                if($('#'+name).css('display')==='none'){
                    $('#'+name)
                        .slideDown();
                }
                else{
                    $('#'+name)
                        .slideUp();
                }
            })
    }
};

$(document).ready(function () {
    ko.applyBindings(new AppViewModel());
    $('body').css('display', 'block');
});