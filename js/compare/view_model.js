/**
 * Created by Таня on 20.11.2014.
 */
function AppViewModel() {
    var self = this;
    self.arrayUsers=ko.observableArray([]);
    getUsers(self);
    self.set_active = function(seat){
        seat.active(!seat.active());
    }
    self.return_active_user = ko.computed(function(){
        debugger;
        var result = [];
        for(var i=0;i<self.arrayUsers().length;++i){

            if(self.arrayUsers()[i].active()===true){
                result.push(self.arrayUsers()[i]);
            }
        }
        console.log(result);
        return result;
    });
}


// Activates knockout.js
$(document).ready(function () {

    ko.applyBindings(new AppViewModel());

});