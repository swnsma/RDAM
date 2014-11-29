function ScriptManager() {
    var arr_objs = [];

    this.add = function(name) {
        if (typeof name === 'function')
            arr_objs.push(name);
    };

    this.run = function() {
        try {
            for(var i in arr_objs)
                new arr_objs[i];
        } catch(e) {
            document.body.innerHTML = 'Error processing javascript when the page loads.<br />Exception: ' + e.message;
        } finally {
            arr_objs = [];
        }
    }
}

var manager = new ScriptManager();

$(document).ready(manager.run);