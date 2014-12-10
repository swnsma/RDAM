/**
 * Created by Таня on 20.11.2014.
 */
function getUsers(self) {
    var options = {
        url: 'http://rdam.zz.mu/ajax/users_info.php?from_id=' + 1  + '&fields=rating',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {

            loading.disable();
//            console.log(current_user.getId());
//            console.log(current_user.getName());
//            console.log(response.data[0].user)
            analyze(response,self);

        },
        error: function () {
        }
    };
    $.ajax(options);
};
function analyze(response,self){
    if (response && response.data && response.data.length) {
        var mappedTasks = [];
        for (var i = 0; i < response.data.length; i++){
            if(response.data[i].id!=self.current_user().id()) {
                var a = response.data[i];
                var j = i % masColor.length;
                var b = new Users(a.user, a.id, false, masColor[j],a.rating);

                mappedTasks.push(b);
            }
        }
        self.arrayUsers(mappedTasks);
    }
}
function get_date_user(id,type,mas,allmas,self) {
    var options = {
        url:'http://rdam.zz.mu/ajax/user_values.php?id=' + id +'&todt=' + 'last' +'&type='+type,
        type: 'GET',
        contentType: 'application/json',
        beforeSend: function(response){
            $('#list').css({
                'display':'none'
            });
        },
        success: function (response) {

//            console.log(type)
            add_user(id,mas,response.data);
            //////////////////////////////////
            //////////////////////////function
                var masTik=[];
                var masDat=[];
                var array=[];
                if(allmas[0]().length!=0) {
                    for(var j=0;j<allmas[0]()[0].data.length;++j){
                        masTik.push(allmas[0]()[0].data[j].time);
                    }
                    if( masTik.length<8)
                    {
                        for(var j=0;j<masTik.length;++j)
                        {
                            masTik[j]=day( masTik[j].slice(8,10), masTik[j].slice(5,7));
                        }
                    }
                    else
                    {
                        for(var j=0;j<masTik.length;++j)
                        {
                        masTik[j]=mont(masTik[j].slice(5,7));
                        }
                    }
                    self.flag(!self.flag())

                    for(var j=0;j<allmas[0]().length;++j ){
                        array=[];
                        for(var i=0;i<allmas[0]()[j].data.length;++i){
                            array.push(+allmas[0]()[j].data[i][self.consProd()]);
                        }
                        masDat.push(array);
                    }
                    masDat.reverse();
                    masTik.reverse();
                    changeGraph(masTik, masDat, self.title(),self.rend(),self.colors);
                    
                }
            $('#list').css({
                'display':'block'
            });
            ////////////////////////////////////////////////
        },
        error: function () {
            alert('ОшибкаЗапроса');
        }
    };
    $.ajax(options);
};
function Users_date(id,data){
    this.id=id;
    this.data=data;
}
function Date_user(time,production,consumption){
    this.time=time;
    this.consumption=consumption;
    this.production=production;
};
function add_user(id,mas,response){
    var mas_date=[];

    for(var i=0;i<response.length;++i){
        mas_date.push(new Date_user(response[i][0],response[i][1],response[i][2]));
    }

    mas.push(new Users_date(id,mas_date));
};

