function UsersModel() {
    self.users = ko.observableArray([]);
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
            var small_text = text.substr(0, 300);
            var el = $('<p>');
            el.text(small_text);
            el.appendTo(element);
            var op = $('<a>').attr('href', '#').text('more').click(function() {
                element.text(text);
                return false;
            });
            op.appendTo(element);
        }
    }
};


$(document).ready(function () {
    ko.applyBindings(new UsersModel());
});