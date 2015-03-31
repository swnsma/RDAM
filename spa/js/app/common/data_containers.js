
function AppViewModel(id,items,legend,get_type,equalHeight,equalWidth){
    var self= this;
    var currentUserID = 1;
    var self = this;
    self.dataLoaded = ko.observable(false);
    self.working = ko.observable(true);//if true screen will be blocked
    self.users = ko.observableArray([]);

    if (useRandom) {
        addRandomUsers(self);
    } else {
        addUsers(self);
    }

    self.dataTypes = ko.observableArray(['production', 'consumption']);
    self.dataType = ko.observable(self.dataTypes()[0]);
    self.setDataType = function (type) {
        self.dataType(type);
    }
    self.scales = ko.observableArray([{ name: 'Day scale', index: 'dayInterval' }, { name: 'Week scale', index: 'weekInterval' }, { name: 'Month scale', index: 'monthInterval' }]);
    self.scale = ko.observable(self.scales()[0]);
    self.setScale = function (scale) {
        self.scale(scale);
    }
    debugger;
    self.currentUser = self.users()[0];
    self.selectedUsers = ko.computed(function () {
        var selected = 0;
        for (var u in self.users()) {
            if (self.users()[u]().selected()) {
                selected++;
            }
        }
        return selected;
    });
    self.maxSelected = 5;
    self.canSelect = ko.computed(function () {
        return self.maxSelected - self.selectedUsers();
    });
    self.setActiveUser = function (user) {
        var selected = self.selectedUsers();
        //for avoid situation when no users are selcted
        if ((selected == 1) && (user.selected() == true)) {
            return;
        }
        if ((self.selectedUsers() == self.maxSelected) && (!user.selected())) {
            return;
        }
        if (!user.selected()) {
            for (var i in colors) {
                if (!colors[i].used) {
                    user.color = colors[i].color;
                    colors[i].used = true;
                    break;
                }
            }
            if (!user.energyDataLoaded) {
                loadUserById(self, user.id);
            }
            user.selected(true);
        } else {
            for (var i in colors) {
                if (colors[i].color == user.color) {
                    colors[i].used = false;
                    break;
                }
            }
            user.selected(false);
        }
    }

    self.setActiveUser(self.users()[currentUserN]());
    self.selectedRange = ko.observable();
    self.graphDescriptor = ko.computed(function () {
        if (!self.users()[0]) {
            return 0;
        }
        var desc = {};
        desc.dataSets = [];
        desc.colors = [];
        //array of datasets to render on graph
        for (var i = 0; i < self.users().length; i++) {
            if (self.users()[i]().selected()) {
                desc.dataSets.push(self.users()[i]()[self.dataType()][self.scale().index]);
                desc.colors.push(self.users()[i]().color);
            }
        }
        //scale for graph
        desc.scale = self.scale().index;
        //if you want, you can set your own labels for horizontal axes like this
        //desc.horLables = ['first','second','third']
        //if you don't - label will be drawn according to scale
        desc.applySelectedRange = function (dateStart, dateEnd, rangeSelected) {
            if (dateStart == '') {
                self.selectedRange('');
                return;
            }
            self.selectedRange({ dateStart: dateStart, dateEnd: dateEnd, rangeSelected: rangeSelected });
        }

        //need this part for initialising table under the graph
        var minDate;
        var maxDate;
        if(desc.dataSets[0][0]===undefined){
            return desc;
        }
        minDate = new Date(desc.dataSets[0][0].date);
        maxDate = new Date(desc.dataSets[0][0].date);
        for (var set in desc.dataSets) {
            for (var val in desc.dataSets[set]) {
                if (desc.dataSets[set][val].date < minDate) {
                    minDate = new Date(desc.dataSets[set][val].date);
                }
                if (desc.dataSets[set][val].date > maxDate) {
                    maxDate = new Date(desc.dataSets[set][val].date);
                }
            }
        }
        maxDate.setHours(23);
        maxDate.setMinutes(59);
        maxDate.setSeconds(59);
        maxDate.setMilliseconds(999);
        self.selectedRange({ dateStart: minDate, dateEnd: maxDate, rangeSelected: false });

        return desc;
    });
    self.productionAmount = ko.computed(function () {
        if (!self.users()[currentUserN]) {
            return 0;
        }
        var sum = 0;
        var array = self.users()[currentUserN]().production[self.scale().index];
        for (var i = 0; i < array.length; i++) {
            sum += parseFloat(array[i].value);
        }
        sum = sum.toFixed(1);
        return sum;
    });
    self.CO2Amount = ko.computed(function () {
        var res;
        res = (self.productionAmount() * 0.61).toFixed(1);
        return res;
    });
    self.kmOnCar = ko.computed(function () {
        var res;
        res = (self.productionAmount() * 0.61 * 3.8624256).toFixed(1);
        return res;
    });
    self.hOfVac = ko.computed(function () {
        var res;
        res = (self.productionAmount() / 1.5).toFixed(1);
        return res;
    });
    self.trees = ko.computed(function () {
        var res;
        res = (self.productionAmount() * 0.61 * 0.026).toFixed(1);
        return res;
    });

    self.sortingBy = ko.observable('selfSufficiency');
    self.sortByProd = function () {
        self.sortingBy('production');
    }
    self.sortByCons = function () {
        self.sortingBy('consumption');
    }
    self.sortByRate = function () {
        self.sortingBy('selfSufficiency');
    }
    self.addInfo = ko.computed(function () {
        var res = {};
        res.rows = [];
        res.range = '';
        if (self.selectedRange() == '') {
            return;
        }

        function rangeSelected() {
            debugger;
            var dateStart = self.selectedRange().dateStart;
            var dateEnd = self.selectedRange().dateEnd;
            for (var user in self.users()) {
                var u = self.users()[user]();
                if (!u.selected()) {
                    continue;
                }
                var row = [];
                row.name = u.name;
                var cons = sumByDateRange(u.consumption[self.scale().index], dateStart, dateEnd);
                var prod = sumByDateRange(u.production[self.scale().index], dateStart, dateEnd);
                var sSuff = prod / cons * 100;
                sSuff>100?sSuff=100:sSuff;
                if (isNaN(sSuff)) {
                    sSuff = '';
                } else {
                    sSuff = sSuff.toFixed(2) * 1;
                }
                if (cons != null) {
                    cons = cons.toFixed(2) * 1;
                }
                if (prod != null) {
                    prod = prod.toFixed(2) * 1;
                }

                row.production = prod;
                row.consumption = cons;
                row.selfSufficiency = sSuff;

                row.bestProducer = false;
                row.lowestConsumer = false;
                row.bestRate = false;

                res.rows.push(row);
            }
        }
        rangeSelected();

        function findWinners() {
            if (res.rows.length < 2) {
                return;
            }
            var bestProducerN = 0;
            var lowestConsumerN = 0;
            var bestRateN = 0;
            var bestProd = res.rows[0].production;
            var lowestCons = res.rows[0].consumption;
            var bestRate = res.rows[0].selfSufficiency;
            for (var r in res.rows) {
                if (res.rows[r].production > bestProd) {
                    bestProd = res.rows[r].production;
                    bestProducerN = r;
                }
                if (res.rows[r].consumption < lowestCons&&res.rows[r].consumption!=0) {
                    lowestCons = res.rows[r].consumption;
                    lowestConsumerN = r;
                }
                if (res.rows[r].selfSufficiency > bestRate) {
                    bestRate = res.rows[r].selfSufficiency;
                    bestRateN = r;
                }
            }
            res.rows[bestProducerN].bestProducer = true;
            res.rows[lowestConsumerN].lowestConsumer = true;
            res.rows[bestRateN].bestRate = true;
        }
        findWinners();

        function setRangeName() {
            if (self.scale().index == 'monthInterval') {
                if (!self.selectedRange().rangeSelected) {
                    var dS = self.selectedRange().dateStart;
                    var dE = self.selectedRange().dateEnd;
                    res.range = monthsShort[dS.getMonth()] + ', ' + dS.getFullYear();
                    res.range += ' - ' + monthsShort[dE.getMonth()] + ', ' + dE.getFullYear();
                } else {
                    var d = self.selectedRange().dateEnd;
                    res.range = months[d.getMonth()] + ', ' + d.getFullYear();
                }
            }

            if (self.scale().index == 'dayInterval') {
                var dS = self.selectedRange().dateStart;
                var dE = self.selectedRange().dateEnd;
                if (self.selectedRange().rangeSelected) {
                    res.range = dE.getDate() + ' ' + months[dE.getMonth()] + ', ' + dE.getFullYear();
                } else {
                    res.range = dS.getDate() + ' ' + months[dS.getMonth()] + ', ' + dS.getFullYear();
                    res.range += ' - ' + dE.getDate() + ' ' + months[dE.getMonth()] + ', ' + dE.getFullYear();
                }
            }

            if (self.scale().index == 'weekInterval') {
                var dS = new Date(self.selectedRange().dateStart);
                dS.setDate(dS.getDate() + 1);
                var dE = self.selectedRange().dateEnd;
                res.range = dS.getDate() + ' ' + months[dS.getMonth()] + ', ' + dS.getFullYear();
                res.range += ' - ' + dE.getDate() + ' ' + months[dE.getMonth()] + ', ' + dE.getFullYear();
            }
        }
        setRangeName();

        function sort() {
            var field = self.sortingBy();
            switch (field) {
                case 'consumption': {
                    for (var r1 in res.rows) {
                        for (var r2 in res.rows) {
                            if (res.rows[r1][field] < res.rows[r2][field]) {
                                var temp = res.rows[r1];
                                res.rows[r1] = res.rows[r2];
                                res.rows[r2] = temp;
                            }
                        }
                    }
                    break;
                }
                default: {
                    for (var r1 in res.rows) {
                        for (var r2 in res.rows) {
                            if (res.rows[r1][field] > res.rows[r2][field]) {
                                var temp = res.rows[r1];
                                res.rows[r1] = res.rows[r2];
                                res.rows[r2] = temp;
                            }
                        }
                    }
                    break;
                }
            }

        }
        sort();

        function allToFixed() {
            for (var r in res.rows) {
                res.rows[r].production = res.rows[r].production.toFixed(2);
                res.rows[r].consumption = res.rows[r].consumption.toFixed(2);
            }
        }
        allToFixed();

        return res;
    });

    self.enableHover = function (user) {
        user.mouseHover(true);
    }
    self.disableHover = function (user) {
        user.mouseHover(false);
    }
    self.getBackgroundColor = function (user) {
        var color;
        if (user.mouseHover()) {
            color = '#f7f7f7';
        }
        if (user.selected()) {
            color = user.color;
        }
        return color;
    }
    var t = 0;

    self.batteries = ko.observableArray([]);
    self.fromGrid = ko.observable('');
    self.fromPanel= ko.observable('');
    self.haveData = false;
    self.stringGrid=ko.computed(function(){
        if(self.haveData){
            return self.fromGrid()+' kWh';
        }else{
            return self.fromGrid();
        }
    });
    self.stringPanel= ko.computed(function(){
        if(self.haveData){
            return self.fromPanel()+' kWh';
        }else{
            return self.fromPanel();
        }
    });
    self.changeTextData= function(newData){
        if(newData[0]===0||newData[1]===0||newData[0]>0&&newData[1]>0){
            self.haveData=true;
        }else{
            self.haveData=false;
        }
        self.fromGrid(newData[0]);
        self.fromPanel(newData[1]);
    };
    self.activate = function () {
        var id = window.location.hash.slice(1);
        api.getData(id, function (someValues) {
            var result = [];
            parseData(someValues, result);
            self.batteries(result)
        }, '');
    };
    self.equalHeightElement=equalHeight;
    self.equalWidthElement = equalWidth;
    self.desc =ko.observable("The Downing Street complex is a four storey Grade-I and II listed brick built Georgian terraced townhouse.It is a home to the Prime Minister and his family, and a busy office and workplace for the PM and his support staff. In 1732 the first-ever PM Robert Walpole refused to accept the house as a personal gift from King George II. Instead he insisted it be used by future First Lords of the Treasury. In 1735 the architect William Kent connected No.10 Downing Street to a larger house at the rear of the property (erected in 1677) facing Horse Guards Parade. 100% of PMO’s electricity supply is on a green tariff, generated from renewable sources.");
    self.resize=ko.observable(true);
    self.img = ko.observable();
    self.img("http://195.69.221.236/"+current_user.getPhoto());
    self.desc(current_user.getDescr());
    self.userName = ko.observable(current_user.getName());
    self.textTweet = ko.computed(function(){
        return self.userName()+" helps to make the planet green! See more details at "+window.location;
    });
    self.idChart = id;
    self.data=items;
    self.buttons=ko.observableArray(['Days','Weeks','Months']);
    self.thisGraph=ko.observable(0);
    self.first_loading=ko.observable(false);
    self.sumProd=ko.observable(0);
    self.sumP = ko.computed(function(){
       return self.sumProd()+" kWh";
    });
    self.sumC=ko.computed(function(){
        return (self.sumProd()*0.61).toFixed(1)+" kg";
    });
    self.sumTrees=ko.computed(function(){
        return (self.sumProd()*0.61*0.026).toFixed(1)+" trees";
    });
    self.sumVac=ko.computed(function(){
        return (self.sumProd()/1.5).toFixed(1)+ " hours";
    });
    self.sumCar=ko.computed(function(){
        return ((self.sumProd()*0.61*3.8624256).toFixed(1))+" km";
    });
    self.legend=legend;
    self.get_type=get_type;
    self.appearance=ko.observable(true);
    self.changeAppearance=function(){
        self.appearance(!self.appearance());
    };
    self.changeData=function(data){
        var index=self.buttons().indexOf(data);
        self.thisGraph(index);
    };
}
ko.bindingHandlers.showGraph={
    init: function(element, valueAccessor, allBindings, viewModel){
        var masId = [current_user.getId()];
        var rend;
        if(viewModel.appearance()){
            rend=$.jqplot.BarRenderer;
        }else
        {
           rend=$.jqplot.LineRenderer;
        }
        values.getValues(masId,
            function(masid){
                $('#loading').css({
                    'display':'none'
                });
                $('#data').css({
                    'display':'block'
                });
                var dd = values.getDate('day',masId);
                viewModel.first_loading(true);

                var product = viewModel.data('day',masId);
                var sum = 0;
                for(var i in product[0]){
                    sum+=product[0][i];
                }
                viewModel.sumProd(sum.toFixed(1));
                changeGraph(viewModel.idChart,dd,product,dd[0]+' - '+dd[dd.length-1],rend,['#EAA228','#4BB2C5'],viewModel.legend,viewModel.equalHeightElement,viewModel.equalWidthElement);
            },
            function(e){
                alert(e);
            },viewModel.get_type

        )
    },
    update: function(element, valueAccessor, allBindings, viewModel){
        if(viewModel.first_loading()) {
            viewModel.resize();
            var masId = [current_user.getId()];
            viewModel.thisGraph();
            var rend;
            if(viewModel.appearance()){
                rend=$.jqplot.BarRenderer;
            }else{
                rend=$.jqplot.LineRenderer;
            }
            var type = 'day';
            if (viewModel.thisGraph() === 1) {
                type = 'week';
            } else if (viewModel.thisGraph() === 2) {
                type = 'month';
            }
            var dd = values.getDate(type, masId);
            var product = viewModel.data(type,masId);
            var sum = 0;
            var periodDate;
            if(type=='week'){
                periodDate = dd[0].slice(0, dd[0].indexOf('-')-1) + ' - ' + dd[dd.length-1].slice(0, dd[dd.length-1].indexOf('-')-1);
            }
            else
            {
                periodDate=dd[0]+' - '+dd[dd.length-1]
            }
            for(var i in product[0]){
                sum+=product[0][i];
            }
            viewModel.sumProd(sum.toFixed(1));
            changeGraph(viewModel.idChart,dd, product,periodDate, rend, ['#EAA228','#4BB2C5'],viewModel.legend,viewModel.equalHeightElement,viewModel.equalWidthElement);

        }

    }
}

