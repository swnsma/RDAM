/**
 * Created by User on 25.11.2014.
 */
/**
 * Created by Таня on 20.11.2014.
 */


function compareRatingLess(userA, userB) {
    return userA.rating - userB.rating;
}
function compareRatingMore(userA, userB) {
    return userB.rating - userA.rating;
}

function Users(name,id,active,color,rating){
    this.name=ko.observable(name);
    this.id=ko.observable(id);
    this.active=ko.observable(active);
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

    },
    update: function(element, valueAccessor, allBindings, viewModel){
        var value=valueAccessor().active_user;
        var masId=[];

        for(var i in value){
            masId.push(value[i].id());
        }

        var type='day';
        var typeg=viewModel.thisGraph();
        if(typeg===1){
            type='week'
        }
        if(typeg===2){
            type='month'
        }

        if(viewModel.consProd()==='consumption'){

        }
        masId.push(current_user.getId());
        debugger;
        viewModel.big_progress_bar(true);
        values.getValues(masId, function(masid) {
            var dd = values.getDate(type,masId);
            viewModel.diapason(dd[0] + ' - ' + dd[dd.length-1]);
            if(viewModel.consProd()==='consumption'){
                changeGraph(dd,
                    values.getConsumption(type,masId), 'Consumption',viewModel.rend(),viewModel.colors);
            }
            else{
                changeGraph(dd,
                    values.getProduction(type,masId), 'Production',viewModel.rend(),viewModel.colors);
            }
            viewModel.big_progress_bar(false);
        }, function(e){
            alert("Error" + e);
        });

    }
}
function AppViewModel() {
    var self = this;
    self.big_progress_bar = ko.observable(false);
    self.diapason = ko.observable('');
    self.flag=ko.observable(false);
    self.search_text=ko.observable('');
    self.arrayUsers=ko.observableArray([]);
    self.isLine=ko.observable(0);
    self.consProd=ko.observable('consumption');
    self.title=ko.observable('Consumption');
    self.ticks=ko.observableArray([]);
    self.current_user=ko.observable(new Users(current_user.getName(),current_user.getId(),null,'#0f0'
        ,current_user.getRating()));
    self.thisGraph=ko.observable(0);
    self.rendMas=[$.jqplot.BarRenderer,$.jqplot.LineRenderer];
    self.rend=ko.observable(self.rendMas[0]);
    self.buttons=ko.observableArray(['Days','Weeks','Months']);
    self.lowestCons=ko.observable(0);
    self.highestProd=ko.observable(0);
    self.colors=ko.observableArray([]);
    self.isClicked=ko.observable(1);

    self.set_active = function(seat){
        if(self.return_active_user().length>3&&seat.active()===false){
        }
        else{
            seat.active(!seat.active());
            return true;
        }
    }
    self.return_active_user = ko.computed(function(){
        self.colors=[];

        var result = [];

        for(var i=0;(i<(self.arrayUsers().length));++i) {

            if (self.arrayUsers()[i].active() === true) {
                result.push(self.arrayUsers()[i]);
                self.colors.push(self.arrayUsers()[i].color);
            }

        }
        self.colors.push("#63AD1F");
        return result;
    });

    self.return_active_user_lower_current = ko.computed(function(){
        var result=[];
        if(self.return_active_user!=undefined) {
            for (var i in self.return_active_user()) {
                result.push(self.return_active_user()[i]);
            }
        }
        return result;
    });
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
    var appVievM=  new AppViewModel();
    ko.applyBindings(appVievM);
    getUsers(appVievM);
    button_constr(".time1");


}
manager.add(Score);

