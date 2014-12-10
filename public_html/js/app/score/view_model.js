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
        var value=valueAccessor();
        var value_data_user=valueAccessor().data_user;
        var rend = viewModel.rend();
        get_date_user(current_user.getId(),'day',value.data_user()[0](),value_data_user(),viewModel);
        get_date_user(current_user.getId(),'week',value.data_user()[1](),value_data_user(),viewModel);
        get_date_user(current_user.getId(),'month',value.data_user()[2](),value_data_user(),viewModel);
        viewModel.isClicked(!viewModel.isClicked());
    },
    update: function(element, valueAccessor, allBindings, viewModel){

        function Users_rating(id,rating){
            this.id=id;
            this.rating=rating;
        }
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

            var self = viewModel;
//            var sum = [];
//            sum[0] = sum[1] = 0;
//            var mass = [];
//            mass[0] = mass[1] = [];
//            debugger;
//            if (self.data_user()[self.thisGraph()]().length > 0) {
//                sum[0] = sum[1] = 0;
//                for (var i = 0; i < self.data_user()[self.thisGraph()]().length; ++i){
//                    for (var j = 0; j < self.data_user()[self.thisGraph()]()[i].data.length; ++j) {
////                        debugger;
//                        sum[0] += +self.data_user()[self.thisGraph()]()[i].data[j].production;
//                        sum[1] += +self.data_user()[self.thisGraph()]()[i].data[j].consumption;
//                    }
//                    mass[0].push(new Users_rating(self.data_user()[self.thisGraph()]()[i].id, sum[0]));
//                    mass[1].push(new Users_rating(self.data_user()[self.thisGraph()]()[i].id, sum[1]));
//                }
//
//            }
//            debugger;
//            self.highestProd(mass[0][0].rating);
//            self.lowestCons(mass[1][0].rating);
//            for (var i = 1; i < mass[0].length; i++) {
//                if (mass[0][i].rating > self.highestProd()) {
//                    self.highestProd(mass[0][i].rating);
//                }
//                if (mass[1][i].rating < self.lowestCons()) {
//                    self.lowestCons(mass[1][i].rating);
//                }
//            }
//            console.log("prod --- "+self.lowestCons()+" "+self.highestProd());
            //////////////////////////function
            var masTik=[];
            var masDat=[];
            var array=[];

            if(value_data_user()[a]().length!=0) {
                for (var j = 0; j < value_data_user()[a]()[0].data.length; ++j) {
                    masTik.push(value_data_user()[a]()[0].data[j].time);
                }
                if (a < 2) {
                    for (var j = 0; j < masTik.length; ++j) {
                        masTik[j] = day(masTik[j].slice(8, 10), masTik[j].slice(5, 7));
                    }
                }
                else {
                    for (var j = 0; j < masTik.length; ++j) {
                        masTik[j] = mont(masTik[j].slice(5, 7));
                    }
                }

                for(var j=0;j<value_data_user()[a]().length;++j ){
                    array=[];
                    for(var i=0;i<value_data_user()[a]()[j].data.length;++i){
                        array.push(+value_data_user()[a]()[j].data[i][viewModel.consProd()]);
                    }
                    masDat.push(array);
                }
//                masTik.reverse();
//                masDat.reverse();
                changeGraph(masTik, masDat, viewModel.title(),rend,viewModel.colors);
            }
            //////////////////////////////////////
        }
    }
}
function AppViewModel() {
    var self = this;
    self.flag=ko.observable(false);
    self.search=ko.observable(false);
    self.search_text=ko.observable('');
    self.arrayUsers=ko.observableArray([]);
    self.isLine=ko.observable(0);
    self.consProd=ko.observable('consumption');
    self.title=ko.observable('Consumption');
    self.ticks=ko.observableArray([]);
    self.current_user=ko.observable(new Users(current_user.getName(),current_user.getId(),null,'#0f0'
        ,current_user.getRating()));
    self.data_user=ko.observableArray([ ko.observableArray([]),ko.observableArray([]),ko.observableArray([]) ] );
    self.thisGraph=ko.observable(0);
    self.rendMas=[$.jqplot.BarRenderer,$.jqplot.LineRenderer];
    self.rend=ko.observable(self.rendMas[0]);
    self.buttons=ko.observableArray(['Days','Weeks','Months']);
    self.lowestCons=ko.observable(0);
    self.highestProd=ko.observable(0);
    self.colors=[];
    self.isClicked=ko.observable(1);
    self.colors.push("#63AD1F");
    getUsers(self);
    self.return_active_user = ko.computed(function(){
        function Users_rating(id,rating){
            this.id=id;
            this.rating=rating;
        }
        var result = [];
        self.colors=[];
        self.colors.push("#63AD1F");

        for(var i=0;(i<(self.arrayUsers().length));++i) {

            if (self.arrayUsers()[i].active() === true) {
                result.push(self.arrayUsers()[i]);
                self.colors.push(self.arrayUsers()[i].color);
            }

        }
        return result;
    });

    self.setConsProd = ko.computed(function(){
        function Users_rating(id,rating){
            this.id=id;
            this.rating=rating;
        }
        var sum = [];
        sum[0] = sum[1] = 0;
        var mass = [];
        mass[0] = mass[1] = [];
        var result;
        self.consProd();
        self.isClicked();
        if (self.data_user()[self.thisGraph()]().length > 0) {
            sum[0] = sum[1] = 0;
            for (var i = 0; i < self.data_user()[self.thisGraph()]().length; ++i) {
                for (var j = 0; j < self.data_user()[self.thisGraph()]()[i].data.length; ++j) {
                    sum[0] += +self.data_user()[self.thisGraph()]()[i].data[j].production;
                    sum[1] += +self.data_user()[self.thisGraph()]()[i].data[j].consumption;
                }
                mass[0].push(new Users_rating(self.data_user()[self.thisGraph()]()[i].id, sum[0]));
                mass[1].push(new Users_rating(self.data_user()[self.thisGraph()]()[i].id, sum[1]));
            }
            debugger;
            self.highestProd(mass[0][0].rating.toFixed(3));
            self.lowestCons(mass[1][0].rating.toFixed(3));
            for (var i = 1; i < mass[0].length; i++) {
                if (mass[0][i].rating > self.highestProd()) {
                    self.highestProd(mass[0][i].rating.toFixed(3));
                }
                if (mass[1][i].rating < self.lowestCons()) {
                    self.lowestCons(mass[1][i].rating.toFixed(3));
                }
            }
            console.log("prod --- " + self.lowestCons() + " " + self.highestProd());
        }
        else
        {

        }
        return result;
    });
    self.setConsProd.extend({ rateLimit: 1500 });
    self.return_active_user_lower_current = ko.computed(function(){
        function Users_rating(id,rating){
            this.id=id;
            this.rating=rating;
        }
        var result = [];
//        if(self.consProd()==='production')
//        self.thisGraph()
        var s=self.return_active_user();
        var mat =[];
        var sum=0;
        var comp=0;
        var a=self.flag();
        if(self.data_user()[self.thisGraph()]().length>0) {
            for (var i = 0; i < self.data_user()[self.thisGraph()]().length; ++i) {
                sum = 0;
                for (var j = 0; j < self.data_user()[self.thisGraph()]()[i].data.length; ++j) {
//                    debugger;
                    if (self.consProd() === 'production') {
                        sum += +self.data_user()[self.thisGraph()]()[i].data[j].production;
                        break;
                    } else {
                        sum += +self.data_user()[self.thisGraph()]()[i].data[j].consumption;
//                        var asd=self.data_user();
                        break;
                    }
                }
                if(i===0){
                    comp=sum;
//                    console.log(comp);
                }
                else
                if (self.consProd() === 'production'&&comp>sum) {
                    mat.push(new Users_rating(self.data_user()[self.thisGraph()]()[i].id,sum))
                }
                else
                if (self.consProd() === 'consumption'&&comp<=sum) {
                    mat.push(new Users_rating(self.data_user()[self.thisGraph()]()[i].id,sum));
                }
            }
        }
       var asd=self.data_user();
//        console.log(',kf,kf,kf');

        if (self.consProd() === 'production') {
            mat.sort(compareRatingMore);
        }
        else{
            mat.sort(compareRatingLess);
        }
//        console.log(mat);
        for(var i=0;i<mat.length;++i){
            for(var j=0;j<self.return_active_user().length;++j){

                if(mat[i].id===self.return_active_user()[j].id()){
                    result.push(self.return_active_user()[j]);
                }
            }
        }
        return result;
    });
    self.return_active_user_higher_current = ko.computed(function(){

        function Users_rating(id,rating){
            this.id=id;
            this.rating=rating;
        }
        var a=self.flag();
        var result = [];
//        if(self.consProd()==='production')
//        self.thisGraph()
        var s=self.return_active_user();
        var mat =[];
        var sum=0;
        var comp=0;
        if(self.data_user()[self.thisGraph()]().length>0) {
            for (var i = 0; i < self.data_user()[self.thisGraph()]().length; ++i) {
                sum = 0;
                for (var j = 0; j < self.data_user()[self.thisGraph()]()[i].data.length; ++j) {
                    if (self.consProd() === 'production') {
                        sum += +self.data_user()[self.thisGraph()]()[i].data[j].production;
                        break;
                    } else {
                        sum += +self.data_user()[self.thisGraph()]()[i].data[j].consumption;
                        break;
                    }
                }
                if(i===0){
                    comp=sum;
                    console.log(comp);
                }
                else
                if (self.consProd() === 'production'&&comp<=sum) {
                    mat.push(new Users_rating(self.data_user()[self.thisGraph()]()[i].id,sum));
                }
                else
                if (self.consProd() === 'consumption'&&comp>sum) {
                    mat.push(new Users_rating(self.data_user()[self.thisGraph()]()[i].id,sum));
                }

            }
        }
        var asd=self.data_user();
//        console.log(',kf,kf,kf');
        if (self.consProd() === 'production') {
            mat.sort(compareRatingMore);
        }
        else{
            mat.sort(compareRatingLess);
        }
//        console.log(mat);
        for(var i=0;i<mat.length;++i){
            for(var j=0;j<self.return_active_user().length;++j){

                if(mat[i].id===self.return_active_user()[j].id()){
                    result.push(self.return_active_user()[j]);
                }
            }
        }
        return result;
    });
    self.set_active = function(seat){
        if(self.return_active_user().length>3&&seat.active()===false){
        }
        else{
            seat.active(!seat.active());
            self.isClicked(!self.isClicked());
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

