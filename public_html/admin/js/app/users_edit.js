/**
 * Created by Таня on 09.01.2015.
 */
function UsersModel() {
    var self=this;

    self.users = ko.observableArray([]);
    self.length=ko.observable(0);
    self.bool_edit = ko.observable(false);
    self.current_user = ko.observable( new User());
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

            ajax.get_users(+id+1, {
                success: function(data) {
                    if (data.length == 0) {
                        element.remove();
                    } else {
                        for(var i in data) {
                            valueAccessor().push(new User(data[i]));
                        }
                        var id = getUserDefined();
                        if (id !== null) {
                            $(document.body).animate({
                                'scrollTop':   $('#scroll' + id).offset().top
                            }, 2000);
                        }
                    }
                    viewModel.length(valueAccessor()().length);
                },
                error: function(message) {
                    alert(message);
                }
            });
        });
        element.click();

    }
};

ko.bindingHandlers.description = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var text = valueAccessor();
        element = $(element);
        if (text.length > 300) {
            var small_text = text.substr(0, 300) + '... ';
            var el = $('<span>');
            el.text(small_text);
            el.appendTo(element);
            var op = $('<a>').attr('href', '#').text('more').click(function() {
                element.text(text);
                return false;
            });
            op.appendTo(element);
        } else {
            element.text(text);
        }
    }
};


$(document).ready(function () {
    ko.applyBindings(new UsersModel());
});