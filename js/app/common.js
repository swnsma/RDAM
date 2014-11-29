
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

function LoadingManager() {

    this.enable = function() {
        $('#loading').css('display', 'block');
        $('#data').css('display', 'none');
    };

    this.disable = function() {
        $('#loading').css('display', 'none');
        $('#data').css('display', 'block');
    };

    var self = this;

    function ajaxSetting() {
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                self.enable();
            },
            complete: function(xhr, settings) {
                self.disable();
            }
        });
    }

    (function() {
        ajaxSetting();
    })();
}

var loading = new LoadingManager();