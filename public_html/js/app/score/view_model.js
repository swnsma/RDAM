/**
 * Created by User on 25.11.2014.
 */
/**
 * Created by Таня on 20.11.2014.
 */

function compareRating(userA, userB) {
    return userB.rating - userA.rating;
}

function Users(name,id,active,color,rating){
    this.name=ko.observable(name);
    this.id=ko.observable(id);
    this.active=ko.observable(active);
    this.name_table='user_'+id;
    this.color=color;
    this.rating=rating;
}


ko.bindingHandlers.message={
    update: function(element, valueAccessor){
        $(element).css({
            'color':'black'
        });
        $(element).text('You can add ' + valueAccessor() +' users');
        if(valueAccessor()===0){
            $(element).css({
                'color':'red'
        });
        }
    }
}

function AppViewModel() {
    var self = this;
    self.search=ko.observable(false);
    self.search_text=ko.observable('');
    self.arrayUsers=ko.observableArray([]);

    self.current_user=ko.observable(new Users(current_user.getName(),current_user.getId(),null,'#0f0'
        ,current_user.getRating()));
    getUsers(self);

    self.return_active_user = ko.computed(function(){
//    debugger;
        var result = [];
        for(var i=0;(i<(self.arrayUsers().length));++i){

            if(self.arrayUsers()[i].active()===true){
                result.push(self.arrayUsers()[i]);
            }
        }
        /*console.log(result);*/
        return result;
    });
    self.return_active_user_lower_current = ko.computed(function(){

        var result = [];
        for(var i=0;(i<(self.return_active_user().length));++i){

//            debugger;
            if(self.return_active_user()[i].rating<=self.current_user().rating){
                result.push(self.return_active_user()[i]);
            }
        }
        /*console.log(result);*/

        result.sort(compareRating);
        return result;
    });
    self.return_active_user_higher_current = ko.computed(function(){

        var result = [];
        for(var i=0;(i<(self.return_active_user().length));++i){

//            debugger;
            if(self.return_active_user()[i].rating>self.current_user().rating){
                result.push(self.return_active_user()[i]);
            }
        }
        /*console.log(result);*/
        result.sort(compareRating);
        return result;
    });
    self.set_active = function(seat){
        if(self.return_active_user().length>3&&seat.active()===false){
        }
        else{
            seat.active(!seat.active());
            return true;
        }
//        return seat.active();
    }
    self.return_active_search = ko.computed(function(){
        var result = [];
        for(var i=0;i<self.arrayUsers().length;++i){
//            console.log(self.search_text());
            if(self.arrayUsers()[i].active()===true){
                    result.push(self.arrayUsers()[i]);

            }
        }
        return result;

    });
    self.return_no_active_search = ko.computed(function(){
        var result = [];
        for(var i=0;i<self.arrayUsers().length;++i){
//            console.log(self.search_text());
            if(self.arrayUsers()[i].active()===false){
                var word = self.arrayUsers()[i].name().toUpperCase();
                var subword = self.search_text().toUpperCase();
                if (word.indexOf(subword) > -1) {
                    result.push(self.arrayUsers()[i]);
                }
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

// Activates knockout.js
function Score() {
    ko.applyBindings(new AppViewModel());
    var $target = $('.graphContainer');
    var  $bt = $('<div>').addClass('button-center');
    $bt.appendTo($target);
    var $dayButton = $('<div>').addClass("is_active");
    var $weekButton = $('<div>');
    var $monthButton = $('<div>');
    button_constr($dayButton, $bt, 1,'Days');
    button_constr($weekButton, $bt, 2,'Weeks');
    button_constr($monthButton, $bt, 3,'Months');
//    $('.change_view').click(clickChange);
}

manager.add(Score);

/*$(document).ready(function() {
    new Score();
});*/



//function button_constr(el,p,text)
//{
//    el.appendTo(p)
//        .addClass('time1')
//        .text(text)
//        .click(function () {
//            $(this).addClass("is_active");
//            $(this).siblings().removeClass("is_active");
//        })
//        .mouseenter(function () {
//            $(this).addClass("on_button")
//        })
//        .mouseleave(function () {
//            $(this).removeClass("on_button")
//        });
//}