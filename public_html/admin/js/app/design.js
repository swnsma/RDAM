function Desing() {
    var self = this;
    self.templates = ko.observableArray([]);

    self.upload_template = function() {
        ajax.load_skin(new FormData(document.getElementById('uploadTemplate')), {
            success: function(data) {
                self.templates.push(new Template(data));
            },
            error: function(message) {
                alert('неудалось загрузить шаблон причина: ' + message);
            },
            after: function() {

            },
            before: function() {

            }
        })
    };

    self.delete_template = function(data) {
        if (data.id !== 1 && !data.active()) {
            ajax.del_skin(data.id, {
                success: function(data) {
                    var id = data.id;
                    self.templates(self.templates().filter(function(val) {
                        return val.id !== id;
                    }));
                },
                error: function(message) {
                    alert('неудалось удалить шаблон причина: ' + message);
                },
                after: function() {

                },
                before: function() {

                }
            })
        }
        return false;
    };

    self.select_design = function(data) {
        if (!data.active()) {
            ajax.select_skin(data.id, {
                    success: function(data) {
                        var id = data.id;
                        var t = self.templates();
                        for(var i in t) {
                            if (t[i].active()) t[i].active(false);
                            if (t[i].id == id) t[i].active(true);
                        }
                    },
                    error: function(message) {
                        alert('неудалось обновить дизайн. причина: ' + message);
                    },
                    after: function() {

                    },
                    before: function() {

                    }
                }
            )
        }
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
    this.active = ko.observable(data.active == 1 ? true : false);
    this.file = 'http://rdam.tk/storage/skins/' + data.filename;
}

$(document).ready(function() {
    ko.applyBindings(new Desing());
});