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


$(document).ready(function () {
    ko.applyBindings(new UsersModel());
});