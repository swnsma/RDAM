
function button_constr(el,p,n,text)
{
    el.appendTo(p)
        .addClass('time1')
        .text(text)
        .click(function () {
            $(this).addClass("is_active");
            $(this).siblings().removeClass("is_active");
            this_graph=n;
            changeGraph(n);})
        .mouseenter(function () {
            $(this).addClass("on_button")
        })
        .mouseleave(function () {
            $(this).removeClass("on_button")
        });
}
function click_change()
{
        var a=$(this);
        if(a.hasClass("master"))
        {rend=$.jqplot.BarRenderer;
            changeGraph(this_graph);
        }
        else
        {rend=$.jqplot.LineRenderer;
            changeGraph(this_graph);
        }
        a.toggleClass("master");
}

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