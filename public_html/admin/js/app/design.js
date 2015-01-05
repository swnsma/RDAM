function Desing() {
    var self = this;
    self.templates = ko.observableArray([]);

    self.upload_template = function() {
        ajax.load_skin(new FormData(document.getElementById('uploadTemplate')), {
            success: function() {

            },
            error: function() {

            },
            after: function() {

            },
            before: function() {

            }
        })
    };

    self.delete_template = function(data) {

        //...

        return false;
    };

    self.select_design = function(data) {
        if (!data.active) return false;

        //....

        return true;
    };

    ajax.list_skins({
        success: function(data) {
            for(var i in data) {
                self.templates.push(new Template(data[i]));
            }
        },
        error: function(message) {

        },
        before: function() {

        },
        after: function() {

        }
    })
}

function Template(data) {
    this.id = data.id;
    this.name = data.name;
    this.author = data.author;
    this.version = data.version;
    this.comment = data.comment;
    this.active = data.active == 1 ? true : false;
}

$(document).ready(function() {
    ko.applyBindings(new Desing());
});
