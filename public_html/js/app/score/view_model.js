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
        //отримання даних з моделі
        var value=valueAccessor().active_user;
        var masId=[];
        //річ для того що б кнопки працювали
        viewModel.bool(!viewModel.bool());
        //проходимо по масиву активних ютерів  і беремо idішкі
        for(var i in value){
            masId.push(value[i].id());
        }
        //вибираємо тип
        var type='day';
        var typeg=viewModel.thisGraph();
        if(typeg===1){
            type='week'
        }
        if(typeg===2){
            type='month'
        }
        //в масив idшішок запикаємо id поточного користувача
        masId.push(current_user.getId());
        viewModel.big_progress_bar(true);
        //визивається функція яка буде отримувати дані
        //masId - масив idішок
        //function(masid) - функція яка визивається після респонса
        //function(e) - функція визивається, ящо помилка

        values.getValues(masId, function(masid) {
            var dd = values.getDate(type,masId);

            viewModel.diapason(dd[0] + ' - ' + dd[dd.length-1]);
            if(type=='week'){
                var d = new Date();
                var a =3600*24*1000*7;
                d.setTime(Date.parse(dd[0]) - a);
                viewModel.diapason( d.getDate()+ ' '+m_names[d.getMonth()]+' '+ d.getFullYear()+ ' - '+ dd[dd.length-1]);
                console.log(d.toLocaleString());
            }
            if(viewModel.consProd()==='consumption'){
                // якщо в нас вибране споживання то ми малюємо графік за даними по споживанню
                changeGraph(dd,
                    values.getConsumption(type,masId), 'Consumption',viewModel.rend(),viewModel.colors);
            }
            else{
                //якщо ж вибране виробництво то ми мал.ємо графік по даними вирибницта
                //values.getProduction - повертає масив в такому форматі,
                //який потрібний для графіка
                //передаються 2 параметри ... тип(день, тиждень, мысяць) та масив idiшок
                //ця функція знаходиться  в папці комон в файлі get_values
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
    self.bool=ko.observable(false);
    self.big_progress_bar = ko.observable(false);
    self.diapason = ko.observable('');
    self.flag=ko.observable(false);
    self.search_text=ko.observable('');
    self.arrayUsers=ko.observableArray([]);
    self.isLine=ko.observable(0);
    self.consProd=ko.observable('production');
    self.title=ko.observable('Production');
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
        self.bool(!self.bool());
    };

    //what range is selected 'day' 'week' 'month'
    self.currentRange = ko.observable('day');
    self.changeData=function(data)
    {
        switch  (data){
            case "Days":
                self.currentRange('day');
                break;
            case "Weeks":
                self.currentRange('week');
                break;
            case "Months":
                self.currentRange('month');
                break;
        }

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
        self.bool(!self.bool());
    }

    self.addInfo = ko.observableArray();
    self.sortedByConsumption = ko.observable(false);
    self.sortAddInfoConsumption = function (){
        self.sortedByConsumption(true);
        self.sortedByProduction(false);
        var array = self.addInfo();
        for (var i=0;i<array.length;i++){
            for (var j=0;j<array.length;j++){
                if (parseFloat(array[i].consumption) < parseFloat(array[j].consumption)){
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }
        }

        //refresh observable array
        var data = self.addInfo().slice(0);
        self.addInfo([]);
        self.addInfo(data);
    }
    self.sortedByProduction = ko.observable(false)
    self.sortAddInfoProduction = function (){
        self.sortedByConsumption(false);
        self.sortedByProduction(true);
        var array = self.addInfo();
        for (var i=0;i<array.length;i++){
            for (var j=0;j<array.length;j++){
                if (parseFloat(array[i].production) > parseFloat(array[j].production)){
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }
        }

        //refresh observable array
        var data = self.addInfo().slice(0);
        self.addInfo([]);
        self.addInfo(data);
    }
    self.selectedDate = ko.observable();
}

// Activates knockout.js
function Score() {
    var appVievM = new AppViewModel();
    ko.applyBindings(appVievM);
    getUsers(appVievM);
    button_constr(".time-button");

    //enables click event traking for chart
    $('#chartDiv').bind('jqplotDataClick',
        function (ev, seriesIndex, pointIndex, data) {
            function User(name, production, consumption, achievement){
                this.name = name;
                this.production = production;
                this.consumption = consumption;
                this.achievement = achievement;
            }

            var Users = [];

            var column = pointIndex;
            var scale = appVievM.thisGraph();
            var users = appVievM.return_active_user();
            var ids = [];
            ids.push(current_user.getId());
            var names = [];
            names.push(current_user.getName());
            for (var i=0; i<users.length; i++){
                ids.push(users[i].id());
                names.push(users[i].name());
            }
            var diapason = appVievM.currentRange();
            var v  = values.getDate(appVievM.currentRange(), ids);
            var date = v[pointIndex];

            if (appVievM.currentRange()=='week'){
                var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                var period=' from ';
                var day = parseInt(date);
                var month = date.substring(3,6);
                var year = date.substring(7,11);
                year = parseInt(year);
                switch (month){
                    case 'Jan':
                        month = 0;
                        break;
                    case 'Feb':
                        month = 1;
                        break;
                    case 'Mar':
                        month = 2;
                        break;
                    case 'Apr':
                        month = 3;
                        break;
                    case 'May':
                        month = 4;
                        break;
                    case 'Jun':
                        month = 5;
                        break;
                    case 'Jul':
                        month = 6;
                        break;
                    case 'Aug':
                        month = 7;
                        break;
                    case 'Sep':
                        month = 8;
                        break;
                    case 'Oct':
                        month = 9;
                        break;
                    case 'Nov':
                        month = 10;
                        break;
                    case 'Dec':
                        month = 11;
                        break;
                }
                var JSDate = new Date (year, month, day);

                JSDate.setDate(JSDate.getDate()-7)
                period += JSDate.getDate()+"'th "+months[JSDate.getMonth()]+' '+JSDate.getFullYear();
                period += ' to '+day+"'th "+months[month]+' '+year;
                appVievM.selectedDate('period '+period);
            } else {
                appVievM.selectedDate(date);
            }


            var arrcons = values.getConsumption(appVievM.currentRange(), ids);
            var arrprod = values.getProduction(appVievM.currentRange(), ids);

            appVievM.addInfo([]);

            for (var i=0;i<ids.length;i++){
                var cons = values.getConsumption(appVievM.currentRange(), ids)[i][pointIndex];
                var prod = values.getProduction(appVievM.currentRange(), ids)[i][pointIndex];
                cons = arrcons[i][pointIndex];
                prod = arrprod[i][pointIndex];
                cons = cons.toFixed(1);
                prod = prod.toFixed(1);
                Users.push( new User(names[i],cons, prod,'') );
            }

            //best producer and lowest consumer
            var best = Users[0].production;
            var best_n = 0;
            var lowest = Users[0].consumption;
            var lowest_n = 0;
            for (var i = 1; i<Users.length; i++){
                if (Users[i].production > best){
                    best = Users[i].production;
                    best_n = i;
                }
                if (Users[i].consumption < lowest){
                    lowest = Users[i].consumption;
                    lowest_n = i;
                }
            }
            Users[best_n].achievement = 'Best producer';
            Users[lowest_n].achievement = 'Lowest consumer';
            if(best_n==lowest_n){
                Users[best_n].achievement='Best in the peer group';
            }
            for (var i=0; i<Users.length;i++){
                appVievM.addInfo.push({
                                        name: Users[i].name,
                                        consumption: Users[i].consumption+' kWh',
                                        production: Users[i].production+' kWh',
                                        achievement: Users[i].achievement
                                        });
            }
        }
    );
}
manager.add(Score);

