function Values() {
    if (arguments.callee.instance)
        return arguments.callee.instance;
    arguments.callee.instance = this;

    var arr_data = [];
    arr_data['day'] = []; //
    arr_data['week'] = [];
    arr_data['month'] = [];

    function parseSomeTypeData(data, type) {
        for(var i in data) {
            var id = data[i].id;
            if (arr_data[type][id] == undefined) {
                arr_data[type][id] = {
                    values: {
                        production: [],
                        consumption: []
                    },
                    date: []
                };
            }
            var l = data[i].values.length-1;
            for(var j = l; j >= 0; --j) {
                arr_data[type][id].date.push(data[i].values[j][0]);
                arr_data[type][id].values.production.push(+data[i].values[j][1]);
                arr_data[type][id].values.consumption.push(+data[i].values[j][2]);
            }
        }
    }

    function parseData(data) {
        data = data.data;
        parseSomeTypeData(data.day, 'day');
        parseSomeTypeData(data.week, 'week');
        parseSomeTypeData(data.month, 'month');
    }

    this.getProduction = function(type, ids) {
        var data = arr_data[type];
        if (data == 'undefined') return null;
        var result = [];
        for(var i in ids) {
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

    this.getValues = function(ids, funcSuccess, funcError) {
        var id = [];
        for(var i in ids) {
            if (!this.checkExistsUser(ids[i]))
                id.push(ids[i]);
        }
        if (id.length == 0) {
            funcSuccess([]);
            return;
        }
//        debugger;
        else
        {

            $.ajax({
                url: 'http://rdam.tk/ajax2/users_values.php?id=' + id.join(',') + '&todt=last',
                type: 'GET',
                contentType: 'application/json',
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
//                            debugger;
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