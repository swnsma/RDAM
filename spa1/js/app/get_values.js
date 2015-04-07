var m_names = new Array("Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec");
function Values() {
    if (arguments.callee.instance)
        return arguments.callee.instance;
    arguments.callee.instance = this;

    var arr_data = [];
    arr_data['day'] = []; //
    arr_data['week'] = [];
    arr_data['month'] = [];

    function parseWeeksDate(weekDate){
        var d = new Date();
        var magicNumbers =3600*24*1000*7;
        d.setTime(Date.parse(weekDate) - magicNumbers);
        return d.getDate()+ ' '+m_names[d.getMonth()]+' '+ d.getFullYear()+ ' - ' + weekDate;
    }
    function parseSomeTypeData(data, type) {
            var id = data[0].id;
            if (arr_data[type][id] == undefined) {
                arr_data[type][id] = {
                    values: {
                        production: [],
                        consumption: []
                    },
                    date: []
                };
            }
            var l = data[0].values.length-1;
            for(var j = l; j >= 0; --j) {
                if(type=="week"){
                    arr_data[type][id].date.push(parseWeeksDate(data[0].values[j][0]));
                }else{
                    arr_data[type][id].date.push(data[0].values[j][0]);
                }

                arr_data[type][id].values.production.push(+data[0].values[j][1]);
                arr_data[type][id].values.consumption.push(+data[0].values[j][2]);
        }
    }
    function parseData(data) {
        data = data.data;
        parseSomeTypeData(data.day, 'day');
        parseSomeTypeData(data.week, 'week');
        parseSomeTypeData(data.month, 'month');
 }

    this.getProCon=function(type, ids){
        var data = arr_data[type];
        if (data == 'undefined') return null;
        var result = [];
        for(var i =0;i<ids.length;i++) {
            result.push(data[ids[i]].values.production);
            result.push(data[ids[i]].values.consumption)
        }
        return result;
    };

    this.getProduction = function(type, ids) {
        var data = arr_data[type];
        if (data == 'undefined') return null;
        var result = [];
        for(var i =0;i<ids.length;i++) {
            result.push(data[ids[i]].values.production);
        }
        return result;
    };

    this.getConsumption = function(type, ids) {
        var data = arr_data[type];
        if (data == 'undefined') return null;
        var result = [];
        for(var i in ids) {
            result.push(data[ids[i]].values.consumption);
        }
        return result;
    };

    this.getDate = function(type, ids) {
        var data = arr_data[type];
        if (data == 'undefined') return null;
        if (typeof ids == 'object') {
            if (ids.length!= 0)
                return data[ids[0]].date;
            else
                return null;
        } else {
            return data[ids].date;
        }
    };

    this.checkExistsUser = function(id) {
        return arr_data['day'][id] != undefined; //будь-який тип, т.к дані приходять одночасно
    };

    var bool = false;

    this.getValues = function(ids, funcSuccess, funcError,type) {
        var id = [];
        for(var i=0;i<ids.length;i++) {
            if (!this.checkExistsUser(ids[i]))
                id.push(ids[i]);
        }
        if (id.length == 0) {
            funcSuccess([]);
        } else {
            $.ajax({
                url: window.app.url+'/ajax/users_values.php?id=' + id.join(',') + '&todt=last'+type,
                type: 'GET',
                contentType: 'application/json',
                async: false,
                beforeSend: function(){
                    if(bool==true){
                        bool=false;
                    }

                },
                success: function (response)
                {
                    if(bool==false) {
                        if (response) {
                            parseData(response);
                            funcSuccess(id);
                        } else {
                            funcError('');
                        }
                        bool=true;
                    }

                },
                error: function (xhr, status, error) {
                    var err = JSON.parse(xhr.responseText);
                    funcError(err.error_message);
                }
            });
        }
    }
}

var values = new Values;
