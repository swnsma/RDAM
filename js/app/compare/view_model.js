/**
 * Created by User on 25.11.2014.
 */
/**
 * Created by Таня on 20.11.2014.
 */
function AppViewModel() {
    var self = this;
    self.search=ko.observable(false);
    self.search_text=ko.observable('');
    self.arrayUsers=ko.observableArray([]);
    getUsers(self);
    self.set_active = function(seat){
        if(self.return_active_user().length>3&&seat.active()===false){
        }
        else{
            seat.active(!seat.active());
            return true;
        }
    }
    self.return_active_user = ko.computed(function(){

        var result = [];
        for(var i=0;(i<(self.arrayUsers().length));++i){

            if(self.arrayUsers()[i].active()===true){
                result.push(self.arrayUsers()[i]);
            }
        }
        /*console.log(result);*/
        return result;
    });
    self.return_no_active_user = ko.computed(function(){

        var result = [];
        for(var i=0;(i<(self.arrayUsers().length));++i){

            if(self.arrayUsers()[i].active()===false){
                result.push(self.arrayUsers()[i]);
            }
        }
        /*console.log(result);*/
        return result;
    });
    self.return_active_search = ko.computed(function(){
        var result = [];
        for(var i=0;i<self.return_active_user().length;++i){
            debugger;
            console.log(self.search_text());
            var word = self.return_active_user()[i].name().toUpperCase();
            var subword = self.search_text().toUpperCase()
            if (word.indexOf(subword) > -1) {
                result.push(self.return_active_user()[i]);
            }
        }
        return result;

    });
    self.return_no_active_search = ko.computed(function(){
        var result = [];
        for(var i=0;i<self.return_no_active_user().length;++i){

            var word = self.return_no_active_user()[i].name().toUpperCase();
            debugger;
            console.log(self.search_text());
            var subword = self.search_text().toUpperCase()
            if (word.indexOf(subword) > -1) {
                result.push(self.return_no_active_user()[i]);
            }

        }
        return result;
    });
    self.return_checked =ko.computed( function(){
        var result = [];
        for(var i=0;i<self.arrayUsers().length;++i){

            if(self.arrayUsers()[i].active()===true){
                result.push(self.arrayUsers()[i].name());
            }
        }
        return result;
    })
}


// Activates knockout.js
$(document).ready(function () {

    ko.applyBindings(new AppViewModel());

    var $target = $('.graphContainer');
    var $dayButton = $('<div>');
    $dayButton.appendTo($target)
        .appendTo($target)
        .addClass('time1')
        .addClass("first")
        .text('Days')
        .click(function () {
            $(this).addClass("is_active");
            $(this).siblings().removeClass("is_active");
            this_graph(1);
            changeGraph(1);
        })
        .mouseenter(function () {
            $(this).addClass("on_button")
        })
        .mouseleave(function () {
            $(this).removeClass("on_button")
        })
        .addClass("is_active");
    var $weekButton = $('<div>');
    $weekButton
        .appendTo($target)
        .addClass('time1')
        .text('Weeks')
        .click(function () {
            $(this).addClass("is_active");
            $(this).siblings().removeClass("is_active");
            this_graph (2);
            changeGraph(2);
        })
        .mouseenter(function () {
            $(this).addClass("on_button")
        })
        .mouseleave(function () {
            $(this).removeClass("on_button")
        });
    var $monthButton = $('<div>');
    $monthButton
        .appendTo($target)
        .addClass('time1')
        .text('Months')
        .click(function () {
            $(this).addClass("is_active");
            $(this).siblings().removeClass("is_active");
            this_graph(3);
            changeGraph(3);
        })
        .mouseenter(function () {
            $(this).addClass("on_button")
        })
        .mouseleave(function () {
            $(this).removeClass("on_button")
        });


    $('.change_view')
        .click(change_view);

});