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
    init:function(element, valueAccessor, allBindings, viewModel){
        var value=valueAccessor();
        var value_data_user=valueAccessor().data_user;
        console.log(value.data_user()[1]());
        var rend = viewModel.rend();
        get_date_user(current_user.getId(),'day',value.data_user()[0](),value_data_user(),viewModel);
        get_date_user(current_user.getId(),'week',value.data_user()[1](),value_data_user(),viewModel);
        get_date_user(current_user.getId(),'month',value.data_user()[2](),value_data_user(),viewModel);


    },
    update: function(element, valueAccessor, allBindings, viewModel){

        var value=valueAccessor();
        var value_active_user=valueAccessor().active_user;
        var value_data_user=valueAccessor().data_user;
        var a = viewModel.thisGraph();
        var rend=viewModel.rend();
        if(value_active_user.length>=value_data_user()[1]().length) {
            for (var i = 0; i < value_active_user.length; ++i) {
                for (var j = 0; j < value_data_user()[1]().length; ++j) {
                    if (value_active_user[i].id() === value_data_user()[1]()[j].id) {
//                        j = value_data_user.week().length;
                        break;
                    }
                    else if (value_active_user[i].id != value_data_user()[1]()[j].id && j === value_data_user()[1]().length - 1) {

                        get_date_user(value_active_user[i].id(), 'day', value.data_user()[0](),value_data_user(),viewModel);
                        get_date_user(value_active_user[i].id(), 'week', value.data_user()[1](),value_data_user(),viewModel);
                        get_date_user(value_active_user[i].id(), 'month', value.data_user()[2](),value_data_user(),viewModel);

                        j =value_data_user()[1]().length;
                        i = value_active_user.length;
                    }
                }
            }
        }else{
            for (var j = 0; j < value_data_user()[1]().length; ++j){
                if(value_active_user.length===0){
                    value_data_user()[0]().splice(1,1);
                    value_data_user()[1]().splice(1,1);
                    value_data_user()[2]().splice(1,1);
                    break;
                }
                for (var i = 0; i < value_active_user.length; ++i){
                    if(value_active_user[i].id() === value_data_user()[1]()[j].id){
                        break;
                    }
                    else
                    if(value_data_user()[1]()[j].id!=current_user.getId()
                        &&value_active_user[i].id!= value_data_user()[1]()[j].id
                        &&i===value_active_user.length-1){
                        value_data_user()[0]().splice(j,1);
                        value_data_user()[1]().splice(j,1);
                        value_data_user()[2]().splice(j,1);
                        j =value_data_user()[1]().length;
                        i = value_active_user.length;
                    }
                }
            }


            //////////////////////////function
            var masTik=[];
            var masDat=[];
            var array=[];

            if(value_data_user()[a]().length!=0) {
                for(var j=0;j<value_data_user()[a]()[0].data.length;++j){
                    masTik.push(value_data_user()[a]()[0].data[j].time);
                }

                for(var j=0;j<value_data_user()[a]().length;++j ){
                    array=[];
                    for(var i=0;i<value_data_user()[a]()[j].data.length;++i){
                        array.push(+value_data_user()[a]()[j].data[i][viewModel.consProd()]);
                    }
                    masDat.push(array);
                }
                changeGraph(masTik, masDat, viewModel.title(),rend,viewModel.colors);
            }
            //////////////////////////////////////
        }
    }
}
function AppViewModel() {
    var self = this;
    self.search=ko.observable(false);
    self.search_text=ko.observable('');
    self.arrayUsers=ko.observableArray([]);
    self.isLine=ko.observable(0);
    self.consProd=ko.observable('production');
    self.title=ko.observable('Production');
    self.ticks=ko.observableArray([]);
    self.current_user=ko.observable(new Users(current_user.getName(),current_user.getId(),null,'#0f0'
        ,current_user.getRating()));
    self.data_user=ko.observableArray( [ko.observableArray([]),ko.observableArray([]),ko.observableArray([]) ] );
    self.thisGraph=ko.observable(0);
    self.rendMas=[$.jqplot.BarRenderer,$.jqplot.LineRenderer];
    self.rend=ko.observable(self.rendMas[0]);
    self.buttons=ko.observableArray(['Days','Weeks','Months']);
    self.colors=[];
    self.colors.push("#63AD1F");
    getUsers(self);
    self.return_active_user = ko.computed(function(){
        var result = [];
        self.colors=[];
        self.colors.push("#63AD1F");
        for(var i=0;(i<(self.arrayUsers().length));++i){

            if(self.arrayUsers()[i].active()===true){
                result.push(self.arrayUsers()[i]);
                self.colors.push(self.arrayUsers()[i].color)
            }
        }
        return result;
    });
    self.return_active_user_lower_current = ko.computed(function(){

        var result = [];
        for(var i=0;(i<(self.return_active_user().length));++i){
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

    self.change=function(){
        self.isLine(!self.isLine());
        if (self.isLine()) {
            self.rend($.jqplot.LineRenderer);
        }
        else {
            self.rend($.jqplot.BarRenderer);
        }
    };

    self.changeData=function(data)
    {
        if (self.isLine()) {
            self.rend($.jqplot.LineRenderer);
        }
        else {
            self.rend($.jqplot.BarRenderer);
        }
        var index=self.buttons().indexOf(data);
        self.thisGraph(index);
        if(index===2)
        {
            self.rend(self.rendMas[1]);
        }
    }
    self.changeConsProd=function()
    {
        if (self.isLine()) {
            self.rend($.jqplot.LineRenderer);
        }
        else {
            self.rend($.jqplot.BarRenderer);
        }
        if (self.consProd()==='production') {
            self.consProd('consumption');
            self.title('Consumption');
        }
        else {
            self.consProd('production');
            self.title('Production');
        }
    }
}

// Activates knockout.js
function Score() {
    ko.applyBindings(new AppViewModel());
    button_constr(".time1");
}
manager.add(Score);

