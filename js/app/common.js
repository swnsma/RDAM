function ScriptManager() {
    var arr_objs = [];

    var self = this;

    this.add = function(name) {
        if (typeof name === 'function')
            arr_objs.push(name);
    };

    this.run = function() {
        try {
            for(var i in arr_objs)
                new arr_objs[i];
        } catch(e) {
            $('body').html('Error processing javascript when the page loads.<br />Exception: ' + e.message);
        } finally {
            arr_objs = [];
        }
    };

    this.loading = {
        enable: function() {
            $('#loading').css('display', 'block');
            $('#data').css('display', 'none');
        },
        disable: function() {
            $('#loading').css('display', 'none');
            $('#data').css('display', 'block');
        }
    };

    function ajaxSetting() {
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                self.loading.enable();
            },
            complete: function(xhr, settings) {
                self.loading.disable();
            }
        });
    }

    (function() {
        ajaxSetting();
    })();
}

var manager = new ScriptManager();

$(document).ready(manager.run);