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
//    this.name_table='user_'+id;
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
ko.bindingHandlers.add_data={
    init:function(element, valueAccessor){
        var value=valueAccessor();
        console.log(value.data_user()[1]());
        get_date_user(current_user.getId(),'day',value.data_user()[0]());
        get_date_user(current_user.getId(),'week',value.data_user()[1]());
        get_date_user(current_user.getId(),'month',value.data_user()[2]());


    },
    update: function(element, valueAccessor){
        debugger;
        var value=valueAccessor();
        var value_active_user=valueAccessor().active_user;
        var value_data_user=valueAccessor().data_user;
        if(value_active_user.length>=value_data_user.week().length) {
            for (var i = 0; i < value_active_user.length; ++i) {
                for (var j = 0; j < value_data_user.week().length; ++j) {
                    if (value_active_user[i].id() === value_data_user.week()[j].id) {
//                        j = value_data_user.week().length;
                        break;
                    }
                    else if (value_active_user[i].id != value_data_user.week()[j].id && j === value_data_user.week().length - 1) {

                        get_date_user(value_active_user[i].id(), 'day', value.data_user()[0]());
                        get_date_user(value_active_user[i].id(), 'week', value.data_user()[1]());
                        get_date_user(value_active_user[i].id(), 'month', value.data_user()[2]());
                        debugger;
                        j =value_data_user.week().length;
                        i = value_active_user.length;
                    }
                }
            }
        }else{
            debugger;
            for (var j = 0; j < value_data_user.week().length; ++j){
                if(value_active_user.length===0){
                    value_data_user()[0]().splice(1,1);
                    value_data_user()[1]().splice(1,1);
                    value_data_user()[2]().splice(1,1);
                    debugger;
                    break;
                }
                for (var i = 0; i < value_active_user.length; ++i){
                    if(value_active_user[i].id() === value_data_user.week()[j].id){
                        break;
                    }
                    else
                    if(value_data_user.week()[j].id!=current_user.getId()
                        &&value_active_user[i].id!= value_data_user.week()[j].id
                        &&i===value_active_user.length-1){
//                        debugger;
                        value_data_user()[0]().splice(j,1);
                        value_data_user()[1]().splice(j,1);
                        value_data_user()[2]().splice(j,1);
                        j =value_data_user.week().length;
                        i = value_active_user.length;
//                        debugger;
                    }
                }
            }
        }
        var masTik=[];
        var masDat=[];
        var array=[];
        debugger;
        if(value_data_user()[0]().length!=0) {
                for(var j=0;j<value_data_user()[0]()[0].data.length;++j){
                    masTik.push(value_data_user()[0]()[0].data[j].time);
                }
//                debugger;

            for(var j=0;j<value_data_user.day().length;++j ){
                array=[];
                for(var i=0;i<value_data_user.day()[j].data.length;++i){
                    array.push(+value_data_user.day()[j].data[i].consumption);
                }
                masDat.push(array);
            }
            debugger;
            changeGraph(masTik, masDat, 'asd');
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
    self.data_user=ko.observableArray([ko.observableArray([]),ko.observableArray([]),ko.observableArray([])]);
//    self.data_user={
//        day: ko.observableArray([]),
//        week:ko.observableArray([]),
//        month:ko.observableArray([])
//    }
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
            debugger;
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
            changeGraph(n);}
        /*}*/)
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
//var rend_mas=[$.jqplot.BarRenderer,$.jqplot.LineRenderer];

manager.add(Score);

