function Desing() {
    var self = this;
    self.templates = ko.observableArray([]);

    ajax.list_skins({
        success: function(data) {
            console.log(data);
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
    this.name = data.name;
    this.author = data.author;
    this.version = data.version;
    this.comment = data.comment;
    this.active = data.active == 1? true : false;

}

$(document).ready(function() {
    ko.applyBindings(new Desing());
});
